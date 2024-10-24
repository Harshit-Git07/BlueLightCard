import { z } from 'zod';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager, SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

export type UniqodoApiConfigError = {
  kind: 'UniqodoAPIRequestError' | 'Error';
  data: {
    message: string;
  };
};

export type UniqodApiConfigSuccess = {
  kind: 'Ok';
  data: {
    code: string;
    createdAt: Date;
    expiresAt: Date;
    promotionId: string;
  };
};

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

export interface IUniqodoApiRepository {
  getCode(
    promotionId: string,
    memberId: string,
    memberEmail: string,
  ): Promise<UniqodApiConfigSuccess | UniqodoApiConfigError>;
}

export class UniqodoApiRepository implements IUniqodoApiRepository {
  static readonly key = 'UniqodoApiRepository' as const;
  static readonly inject = [Logger.key, SecretsManager.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly awsSecretsMangerClient: ISecretsManager,
  ) {}

  async getCode(
    promotionId: string,
    memberId: string,
    memberEmail: string,
  ): Promise<UniqodApiConfigSuccess | UniqodoApiConfigError> {
    let uniqodoApiJson;
    try {
      uniqodoApiJson = await this.awsSecretsMangerClient.getSecretValueJson(
        getEnv(RedemptionsStackEnvironmentKeys.UNIQODO_SECRETS_MANAGER_NAME),
      );
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch Uniqodo API secrets',
      });
      return {
        kind: 'Error',
        data: {
          message: 'Failed to fetch Uniqodo API secrets',
        },
      };
    }

    let response;
    try {
      response = await fetch(getEnv(RedemptionsStackEnvironmentKeys.UNIQODO_CLAIM_URL), {
        method: 'POST',
        body: JSON.stringify({
          customer: {
            id: memberId,
            email: memberEmail,
          },
          promotionId: '43c3780817f7ccb92012e519f0814c0b', //promotionId,
        }),
        headers: {
          'Content-Type': 'application/json',
          'UQD-ACCESS-KEY': `${SecretsSchema.parse(uniqodoApiJson).apiKey}`,
        },
      });
    } catch (error) {
      this.logger.error({
        message: 'Error fetching uniqodo code',
        error,
      });
      return {
        kind: 'Error',
        data: {
          message: `Failed to fetch Uniqodo code - ${error}`,
        },
      };
    }

    if (!response.ok) {
      const message = await response.text();
      this.logger.error({
        message: ` Uniqodo API request failed`,
        context: {
          response: {
            status: response.status,
            data: message,
          },
        },
      });
      return { kind: 'UniqodoAPIRequestError', data: { message: `Uniqodo API request failed - ${message}` } };
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
    return {
      kind: 'Ok',
      data: {
        code: UniqodoResponseSchema.parse(data).claim.code,
        createdAt: new Date(UniqodoResponseSchema.parse(data).claim.createdAt),
        expiresAt: new Date(UniqodoResponseSchema.parse(data).promotion.endDate),
        promotionId: UniqodoResponseSchema.parse(data).promotion.id,
      },
    };
  }
}
