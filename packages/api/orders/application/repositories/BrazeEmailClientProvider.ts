import { Braze } from 'braze-api';
import z from 'zod';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { OrdersStackEnvironmentKeys } from '@blc-mono/orders/infrastructure/constants/environment';

import { ISecretRepository, SecretRepository } from './SecretRepository';

const BrazeCredentialsSecretSchema = z.object({
  brazeApiKey: z.string().min(1),
});
export type BrazeCredentials = z.infer<typeof BrazeCredentialsSecretSchema>;

export interface IBrazeEmailClientProvider {
  getClient: () => Promise<Braze>;
}

export class BrazeEmailClientProvider implements IBrazeEmailClientProvider {
  static key = 'BrazeEmail' as const;
  static inject = [SecretRepository.key] as const;

  constructor(private secretRepository: ISecretRepository) {}

  private brazeApiUrl = getEnv(OrdersStackEnvironmentKeys.BRAZE_API_URL);

  public async getClient(): Promise<Braze> {
    const braze = await this.secretRepository.fetchBrazeSecrets();
    return new Braze(this.brazeApiUrl, braze.brazeApiKey);
  }
}
