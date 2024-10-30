import { createHash } from 'crypto';
import { z } from 'zod';

import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { Brand } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager, SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

export type EagleEyeApiConfigError = {
  kind: 'EagleEyeAPIRequestError' | 'Error';
  data: {
    message: string;
  };
};

export type EagleEyeApiConfigSuccess = {
  kind: 'Ok';
  data: {
    code: string;
    createdAt: Date;
    expiresAt: Date;
  };
};

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

export interface IEagleEyeApiRepository {
  getCode(resourceId: number, memberId: string): Promise<EagleEyeApiConfigSuccess | EagleEyeApiConfigError>;
}

export class EagleEyeApiRepository implements IEagleEyeApiRepository {
  static readonly key = 'EagleEyeApiRepository' as const;
  static readonly inject = [Logger.key, SecretsManager.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly awsSecretsManagerClient: ISecretsManager,
  ) {}

  async getCode(resourceId: number, memberId: string): Promise<EagleEyeApiConfigSuccess | EagleEyeApiConfigError> {
    const eagleEyeApiUrl = getEnv(RedemptionsStackEnvironmentKeys.EAGLE_EYE_API_URL);
    const requestUriPath = '/2.0/token/create';
    const url = `${eagleEyeApiUrl}${requestUriPath}`;

    let eagleEyeClientId;
    let eagleEyeClientSecret;
    const brand = getBrandFromEnv();
    try {
      const secrets = await this.awsSecretsManagerClient.getSecretValueJson(
        `blc-mono-redemptions/eagle-eye-api-${MAP_BRAND[brand]}`,
      );
      const eagleEyeSecrets = EagleEyeCredentialsSecretSchema.parse(secrets);
      eagleEyeClientId = eagleEyeSecrets.clientId;
      eagleEyeClientSecret = eagleEyeSecrets.clientSecret;
    } catch (error) {
      this.logger.error({
        message: 'Failed to fetch Eagle Eye API secrets',
      });
      return {
        kind: 'Error',
        data: {
          message: 'Failed to fetch Eagle Eye API secrets',
        },
      };
    }
    const reference = brand === 'DDS_UK' ? `DDS-${memberId}` : `BLC-${memberId}`;

    //62577, working resource id
    const requestBody = JSON.stringify({
      resourceType: 'CAMPAIGN',
      resourceId: resourceId,
      consumerIdentifier: {
        reference: reference,
      },
    });

    const securityHash = this.calculateSecurityHashHeaderValue(requestUriPath, requestBody, eagleEyeClientSecret);

    const headers = {
      'X-EES-AUTH-CLIENT-ID': eagleEyeClientId,
      'X-EES-AUTH-HASH': securityHash,
    };

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
      return { kind: 'EagleEyeAPIRequestError', data: { message: `Eagle Eye API request failed - ${responseText}` } };
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
    return {
      kind: 'Ok',
      data: {
        code: EagleEyeResponseSchema.parse(responseJson).token,
        createdAt: new Date(EagleEyeResponseSchema.parse(responseJson).tokenDates.start),
        expiresAt: new Date(EagleEyeResponseSchema.parse(responseJson).tokenDates.end),
      },
    };
  }

  private calculateSecurityHashHeaderValue(requestUriPath: string, requestBody: string, eagleEyeClientSecret: string) {
    const stringToHash = requestUriPath + requestBody + eagleEyeClientSecret;

    const hash = createHash('sha256');
    return hash.update(stringToHash).digest('hex');
  }
}
