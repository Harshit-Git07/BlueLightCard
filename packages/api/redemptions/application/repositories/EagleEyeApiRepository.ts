import { createHash } from 'crypto';
import { z } from 'zod';

import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager, SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

import { NoCodesAvailableError } from '../services/redeem/strategies/redeemVaultStrategy/helpers/NoCodesAvailableError';
import { IntegrationCode } from '../services/redeem/strategies/redeemVaultStrategy/RedeemIntegrationVaultHandler';

type EagleEyeRequestBody = {
  resourceType: string;
  resourceId: number;
  consumerIdentifier: {
    reference: string;
  };
};

type EagleEyeHeaders = { 'X-EES-AUTH-CLIENT-ID': string; 'X-EES-AUTH-HASH': string };

const EagleEyeCredentialsSecretSchema = z.object({
  clientSecret: z.string().min(1),
  clientId: z.string().min(1),
});

export const EagleEyeResponseSchema = z.object({
  accountId: z.number(),
  accountStatus: z.string(),
  accountTypeId: z.number(),
  accountTransactionId: z.string(),
  accountType: z.string(),
  accountSubType: z.string(),
  balances: z.object({
    available: z.number(),
    refundable: z.number(),
  }),
  issuerId: z.number(),
  resourceId: z.number(),
  resourceType: z.string(),
  token: z.string(),
  tokenDates: z.object({
    start: z.string(),
    end: z.string(),
  }),
  tokenId: z.number(),
  tokenStatus: z.string(),
  consumerId: z.number(),
});

export type EagleEyeResponseData = z.infer<typeof EagleEyeResponseSchema>;

export interface IEagleEyeApiRepository {
  getCode(resourceId: number, memberId: string): Promise<IntegrationCode>;
}

export class EagleEyeApiRepository implements IEagleEyeApiRepository {
  static readonly key = 'EagleEyeApiRepository' as const;
  static readonly inject = [Logger.key, SecretsManager.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly awsSecretsManagerClient: ISecretsManager,
  ) {}

  async getCode(resourceId: number, memberId: string): Promise<IntegrationCode> {
    const requestUriPath = '/2.0/token/create';

    const brand = getBrandFromEnv();

    const requestBody: string = this.createRequestBody(brand, memberId, resourceId);

    const { eagleEyeClientId, eagleEyeClientSecret } = await this.fetchEagleEyeApiCredentials(brand);

    const securityHash: string = this.calculateSecurityHashHeaderValue(
      requestUriPath,
      requestBody,
      eagleEyeClientSecret,
    );

    const headers: EagleEyeHeaders = this.generateEagleEyeHeaders(eagleEyeClientId, securityHash);

    const eagleEyeResponseData: EagleEyeResponseData = await this.fetchEagleEyeCode(
      requestUriPath,
      headers,
      requestBody,
    );

    return this.buildIntegrationCode(eagleEyeResponseData);
  }

  private async fetchEagleEyeCode(
    requestUriPath: string,
    headers: EagleEyeHeaders,
    requestBody: string,
  ): Promise<EagleEyeResponseData> {
    const eagleEyeApiUrl = getEnv(RedemptionsStackEnvironmentKeys.EAGLE_EYE_API_URL);
    const url = `${eagleEyeApiUrl}${requestUriPath}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: requestBody,
    });

    if (!response.ok) {
      const responseText = await response.text();
      this.logger.error({
        message: `Eagle Eye API request failed`,
        context: {
          response: {
            data: responseText,
            status: response.status,
          },
        },
      });

      throw new NoCodesAvailableError('Failed to get code from EagleEye API');
    }

    const responseJson = await response.json();

    this.logger.info({
      message: 'Eagle Eye API response',
      context: {
        response: {
          data: responseJson,
          status: response.status,
        },
      },
    });

    return EagleEyeResponseSchema.parse(responseJson);
  }

  private buildIntegrationCode(eagleEyeResponse: EagleEyeResponseData): IntegrationCode {
    return {
      code: eagleEyeResponse.token,
      createdAt: new Date(eagleEyeResponse.tokenDates.start),
      expiresAt: new Date(eagleEyeResponse.tokenDates.end),
    };
  }

  private generateEagleEyeHeaders(eagleEyeClientId: string, securityHash: string): EagleEyeHeaders {
    return {
      'X-EES-AUTH-CLIENT-ID': eagleEyeClientId,
      'X-EES-AUTH-HASH': securityHash,
    };
  }

  private createRequestBody(brand: string, memberId: string, resourceId: number) {
    const reference: string = brand === 'DDS_UK' ? `DDS-${memberId}` : `BLC-${memberId}`;

    //62577, working resource id
    const requestBody: EagleEyeRequestBody = {
      resourceType: 'CAMPAIGN',
      resourceId: resourceId,
      consumerIdentifier: {
        reference: reference,
      },
    };

    return JSON.stringify(requestBody);
  }

  private async fetchEagleEyeApiCredentials(brand: keyof typeof MAP_BRAND) {
    const secretId = `blc-mono-redemptions/eagle-eye-api-${MAP_BRAND[brand]}`;
    try {
      const secrets = await this.awsSecretsManagerClient.getSecretValueJson(secretId);
      const eagleEyeSecrets = EagleEyeCredentialsSecretSchema.parse(secrets);
      const eagleEyeClientId = eagleEyeSecrets.clientId;
      const eagleEyeClientSecret = eagleEyeSecrets.clientSecret;

      return { eagleEyeClientId, eagleEyeClientSecret };
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch Eagle Eye API secrets',
        context: { secretId, brand },
      });

      throw new Error('failed to fetch eagle eye api secrets');
    }
  }

  private calculateSecurityHashHeaderValue(requestUriPath: string, requestBody: string, eagleEyeClientSecret: string) {
    const stringToHash = requestUriPath + requestBody + eagleEyeClientSecret;

    const hash = createHash('sha256');
    return hash.update(stringToHash).digest('hex');
  }
}
