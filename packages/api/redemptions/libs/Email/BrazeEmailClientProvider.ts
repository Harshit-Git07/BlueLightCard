import { Braze } from 'braze-api';
import z from 'zod';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { ISecretsManager, SecretsManager } from '../SecretsManager/SecretsManager';

const BrazeCredentialsSecretSchema = z.object({
  brazeApiKey: z.string().min(1),
});
export type BrazeCredentials = z.infer<typeof BrazeCredentialsSecretSchema>;

export interface IBrazeEmailClientProvider {
  getClient: () => Promise<Braze>;
}

export class BrazeEmailClientProvider implements IBrazeEmailClientProvider {
  static key = 'BrazeEmail' as const;
  static inject = [SecretsManager.key] as const;

  constructor(private secretsManger: ISecretsManager) {}

  private brazeApiUrl = getEnv(RedemptionsStackEnvironmentKeys.BRAZE_API_URL);

  public async getClient(): Promise<Braze> {
    const secrets = await this.secretsManger.getSecretValueJson(
      getEnv(RedemptionsStackEnvironmentKeys.SECRETS_MANAGER_NAME),
    );
    const braze = BrazeCredentialsSecretSchema.parse(secrets);
    return new Braze(this.brazeApiUrl, braze.brazeApiKey);
  }
}
