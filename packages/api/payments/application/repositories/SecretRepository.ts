import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

const client = new SecretsManagerClient();

type StripeSecrets = {
  secretKey: string;
  publishableKey: string;
};

export interface ISecretRepository {
  fetchStripeSecrets(): Promise<StripeSecrets>;
}

export class SecretRepository implements ISecretRepository {
  static readonly key = 'SecretRepository' as const;
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  public fetchStripeSecrets = async (): Promise<StripeSecrets> => {
    const brandSuffix = MAP_BRAND[getBrandFromEnv()];
    const secretName = `stripe-api-key-${brandSuffix}`;

    try {
      const { SecretString: value } = await client.send(
        new GetSecretValueCommand({
          SecretId: secretName,
        }),
      );

      if (!value) throw Error(`Could not find secret: ${secretName}`);

      const secretObj = JSON.parse(value);

      return {
        secretKey: secretObj['secret_key'],
        publishableKey: secretObj['publishable_key'],
      };
    } catch (error) {
      //TODO: logging
      this.logger.error({ message: 'Error fetching stripe secrets', error });
      throw error;
    }
  };
}
