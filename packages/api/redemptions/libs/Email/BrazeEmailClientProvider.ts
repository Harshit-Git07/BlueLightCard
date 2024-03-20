import { Braze } from 'braze-api';
import z from 'zod';

import { getEnv } from '@blc-mono/core/utils/getEnv';

import { SecretsManager } from '../SecretsManager/SecretsManager';

export interface BrazeEmailSecrets {
  brazeApiKey: string;
}

const brazeEmailSecrets = z.object({
  brazeApiKey: z.string().nonempty(),
});

export class BrazeEmailClientProvider {
  static key = 'BrazeEmail' as const;
  static inject = [SecretsManager.key] as const;

  constructor(private secretsManger: SecretsManager<BrazeEmailSecrets>) {}

  public async init(): Promise<Braze> {
    const secrets = await this.secretsManger.getSecretValue('blc-mono-redemptions/NewVaultSecrets');
    const braze = brazeEmailSecrets.safeParse(secrets);
    if (braze.success) {
      const brazeAPIUrl = getEnv('BRAZE_API_URL');
      return new Braze(brazeAPIUrl, braze.data.brazeApiKey);
    }
    throw new Error('Invalid secrets');
  }
}
