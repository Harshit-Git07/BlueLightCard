import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export interface ISecretsManager {
  getSecretValueJson(secretId: string): Promise<unknown>;
}

export class SecretsManager {
  static key = 'SecretManger' as const;
  private awsSecretsMangerClient = new SecretsManagerClient();

  /**
   * Retrieves the secret value for a given secret ID.
   *
   * @param secretId - The ID of the secret to retrieve the value for.
   * @return A Promise that resolves with the secret value, or rejects if there was an issue retrieving the secret value.
   */
  public async getSecretValueJson(secretId: string): Promise<unknown> {
    const awsResponse = await this.awsSecretsMangerClient.send(
      new GetSecretValueCommand({
        SecretId: secretId,
      }),
    );
    if (!awsResponse.SecretString) {
      throw new Error(`SecretString is not defined or is empty (secretId: ${secretId})`);
    }
    return JSON.parse(awsResponse.SecretString);
  }
}
