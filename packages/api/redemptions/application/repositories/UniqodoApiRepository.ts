import { z } from 'zod';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager, SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

import { NoCodesAvailableError } from '../services/redeem/strategies/redeemVaultStrategy/helpers/NoCodesAvailableError';
import { IntegrationCode } from '../services/redeem/strategies/redeemVaultStrategy/RedeemIntegrationVaultHandler';

type UniqodoRequestBody = {
  customer: {
    id: string;
    email: string;
  };
  promotionId: string;
};

type UniqodoHeaders = { 'Content-Type': string; 'UQD-ACCESS-KEY': string };

export const SecretsSchema = z.object({
  apiKey: z.string(),
});

export const UniqodoErrorResponseSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});

export const UniqodoResponseSchema = z.object({
  claim: z.object({
    createdAt: z.string(),
    code: z.string(),
  }),
  customer: z.object({
    id: z.string(),
  }),
  promotion: z.object({
    id: z.string(),
    endDate: z.string(),
  }),
});

export type UniqodoResponseData = z.infer<typeof UniqodoResponseSchema>;

export interface IUniqodoApiRepository {
  getCode(promotionId: string, memberId: string, memberEmail: string): Promise<IntegrationCode>;
}

export class UniqodoApiRepository implements IUniqodoApiRepository {
  static readonly key = 'UniqodoApiRepository' as const;
  static readonly inject = [Logger.key, SecretsManager.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly awsSecretsMangerClient: ISecretsManager,
  ) {}

  async getCode(promotionId: string, memberId: string, memberEmail: string): Promise<IntegrationCode> {
    const requestBody: string = this.createRequestBody(memberId, memberEmail, promotionId);

    const headers: UniqodoHeaders = await this.createHeaders();

    const response: UniqodoResponseData = await this.fetchUniqodoCode(requestBody, headers);

    return this.buildIntegrationCode(response);
  }

  private async fetchUniqodoCode(requestBody: string, headers: UniqodoHeaders): Promise<UniqodoResponseData> {
    const url = getEnv(RedemptionsStackEnvironmentKeys.UNIQODO_CLAIM_URL);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        body: requestBody,
        headers: headers,
      });
    } catch (error) {
      this.logger.error({
        message: 'Error fetching uniqodo code',
        error,
      });

      throw new NoCodesAvailableError('Failed to get code from Uniqodo API');
    }

    if (!response.ok) {
      const message = await response.text();
      this.logger.error({
        message: `Uniqodo API request failed`,
        context: {
          response: {
            status: response.status,
            data: message,
          },
        },
      });

      throw new NoCodesAvailableError('Failed to get code from Uniqodo API');
    }

    const data = await response.json();
    this.logger.info({
      message: 'Uniqodo API response',
      context: {
        response: {
          status: response.status,
          data: data,
        },
      },
    });

    return UniqodoResponseSchema.parse(data);
  }

  private buildIntegrationCode(uniqodoResponseData: UniqodoResponseData): IntegrationCode {
    return {
      code: uniqodoResponseData.claim.code,
      createdAt: new Date(uniqodoResponseData.claim.createdAt),
      expiresAt: new Date(uniqodoResponseData.promotion.endDate),
    };
  }

  private async createHeaders(): Promise<UniqodoHeaders> {
    const uniqodoApiKey = await this.fetchUniqodoApiKey();

    return {
      'Content-Type': 'application/json',
      'UQD-ACCESS-KEY': uniqodoApiKey,
    };
  }

  private createRequestBody(memberId: string, memberEmail: string, promotionId: string) {
    const requestBody: UniqodoRequestBody = {
      customer: {
        id: memberId,
        email: memberEmail,
      },
      promotionId: promotionId,
    };

    return JSON.stringify(requestBody);
  }

  private async fetchUniqodoApiKey() {
    let uniqodoApiJson;
    const secretId = getEnv(RedemptionsStackEnvironmentKeys.UNIQODO_SECRETS_MANAGER_NAME);
    try {
      uniqodoApiJson = await this.awsSecretsMangerClient.getSecretValueJson(secretId);
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch Uniqodo secrets',
        context: { secretId },
      });

      throw new Error('failed to fetch Uniqodo api secrets');
    }

    return `${SecretsSchema.parse(uniqodoApiJson).apiKey}`;
  }
}
