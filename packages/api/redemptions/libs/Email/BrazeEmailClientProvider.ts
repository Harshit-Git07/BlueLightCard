import { Braze } from 'braze-api';
import z from 'zod';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { ISecretsManager, SecretsManager } from '../SecretsManager/SecretsManager';

const BrazeCredentialsSecretSchema = z.object({
  brazeApiKey: z.string().nonempty(),
});
export type BrazeCredentials = z.infer<typeof BrazeCredentialsSecretSchema>;

export class BrazeEmailClientProvider {
  static key = 'BrazeEmail' as const;
  static inject = [SecretsManager.key] as const;

  constructor(private secretsManger: ISecretsManager) {}

  private brazeApiUrl = getEnv(RedemptionsStackEnvironmentKeys.BRAZE_API_URL);

  public async init(): Promise<Braze> {
    const secrets = await this.secretsManger.getSecretValueJson('blc-mono-redemptions/NewVaultSecrets');
    const braze = BrazeCredentialsSecretSchema.parse(secrets);
    return new Braze(this.brazeApiUrl, braze.brazeApiKey);
  }
}
