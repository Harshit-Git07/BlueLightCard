import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import z from 'zod';

import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

const client = new SecretsManagerClient();

const BrazeCredentialsSecretSchema = z.object({
  brazeApiKey: z.string().min(1),
});

type BrazeCredentialsSecret = z.infer<typeof BrazeCredentialsSecretSchema>;

export interface ISecretRepository {
  fetchBrazeSecrets(): Promise<BrazeCredentialsSecret>;
}

export class SecretRepository implements ISecretRepository {
  static readonly key = 'SecretRepository' as const;
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  public fetchBrazeSecrets = async (): Promise<BrazeCredentialsSecret> => {
    const brandSuffix = MAP_BRAND[getBrandFromEnv()];
    const secretName = `orders-svc-braze-api-key-${brandSuffix}`;

    try {
      const { SecretString: value } = await client.send(
        new GetSecretValueCommand({
          SecretId: secretName,
        }),
      );

      if (!value) throw Error(`Could not find secret: ${secretName}`);

      const secretObj = JSON.parse(value);

      const braze = BrazeCredentialsSecretSchema.parse(secretObj);

      return braze;
    } catch (error) {
      this.logger.error({ message: 'Error fetching braze api key', error });
      throw error;
    }
  };
}
