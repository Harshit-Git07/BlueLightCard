import { AdminInitiateAuthCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Config } from 'sst/node/config';

import { getEnv, getEnvOrDefault, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
const logger = new CliLogger();

export type TestUserTokens = {
  idToken: string;
  accessToken: string;
};

export class TestUser {
  public static async authenticate(): Promise<TestUserTokens> {
    const client = new CognitoIdentityProviderClient({ region: getEnvOrDefault('REGION', 'eu-west-2') });
    const clientId = getEnvRaw('IDENTITY_COGNITO_E2E_CLIENT_ID');
    const userPoolId = getEnvRaw('IDENTITY_COGNITO_E2E_USER_POOL_ID');
    const authResponse = await client.send(
      new AdminInitiateAuthCommand({
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: clientId && clientId.length > 0 ? clientId : Config.IDENTITY_COGNITO_E2E_CLIENT_ID,
        UserPoolId: userPoolId && userPoolId.length > 0 ? userPoolId : Config.IDENTITY_COGNITO_USER_POOL_ID,
        AuthParameters: {
          USERNAME: getEnvOrDefault('E2E_TESTS_USERNAME', 'e2e-tests@bluelightcard.co.uk'),
          PASSWORD: getEnv('E2E_TESTS_PASSWORD'),
        },
      }),
    );

    if (!authResponse.AuthenticationResult?.IdToken || !authResponse.AuthenticationResult?.AccessToken) {
      logger.error({
        message: `No authentication result found:\n${JSON.stringify(authResponse, null, 2)}`,
      });
      throw new Error('No authentication result found');
    }
    return {
      idToken: authResponse.AuthenticationResult.IdToken,
      accessToken: authResponse.AuthenticationResult.AccessToken,
    };
  }
}
