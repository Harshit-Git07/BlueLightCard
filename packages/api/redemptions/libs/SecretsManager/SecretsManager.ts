import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import type { Provider } from '@smithy/types';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

export type SecretsErrorResponse = {
  message: string;
};

export class SecretsManager<O extends object> {
  static key = 'SecretManager' as const;
  static readonly inject = [Logger.key] as const;

  private awsSecretsMangerClient: SecretsManagerClient;
  constructor(private readonly logger: ILogger) {
    this.awsSecretsMangerClient = new SecretsManagerClient();
  }

  /**
   * Sets the region for the AWS Secrets Manager client.
   *
   * @param {Provider<string>} region - The region to set for the AWS Secrets Manager client.
   * @returns {void}
   */
  public setRegion = (region: Provider<string>): void => {
    this.awsSecretsMangerClient.config.region = region;
  };
  /**
   * Retrieves the secret value for a given secret ID.
   *
   * @param {string} secretId - The ID of the secret to retrieve the value for.
   * @return {Promise<O | SecretsErrorResponse>} - A Promise that resolves with the secret value, or an error response if there was an issue retrieving the secret value.
   */
  public async getSecretValue(secretId: string): Promise<O | SecretsErrorResponse> {
    const awsResponse = await this.awsSecretsMangerClient.send(
      new GetSecretValueCommand({
        SecretId: secretId,
      }),
    );
    if (!awsResponse.SecretString) {
      const response = { message: 'SecretString not found in aws response' };
      this.logger.error(response);
      return response;
    }
    return JSON.parse(awsResponse.SecretString) as O;
  }
}
