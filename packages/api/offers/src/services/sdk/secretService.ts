import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export interface ISecretService {
  secretReader(secretName: string): Promise<SecretResponse>;
}

export class SecretService implements ISecretService {
  private client: SecretsManagerClient;
  constructor() {
    this.client = new SecretsManagerClient();
  }

  public async secretReader(secretName: string): Promise<SecretResponse> {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    try {
      const { SecretString } = await this.client.send(command);
      return SecretString;
    } catch (error) {
      throw new Error(`Error getting secrets from AWS ${error}`);
    }
  }
}

export type SecretResponse = string | unknown | Error;
