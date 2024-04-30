import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { faker } from '@faker-js/faker';
// import { createHmac } from "crypto";
import { Config } from 'sst/node/config';

import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';

const logger = new CliLogger();

type TestUserDetails = {
  email: string;
  password: string;
  attributes: {
    blcOldId: number;
    blcOldUuid: string;
  };
};

export type TestUserTokens = {
  idToken: string;
  accessToken: string;
};

export class TestUser {
  private constructor(
    private readonly client: CognitoIdentityProviderClient,
    public readonly userDetail: TestUserDetails,
  ) {}

  public async authenticate(): Promise<TestUserTokens> {
    const authResponse = await this.client.send(
      new AdminInitiateAuthCommand({
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: Config.IDENTITY_COGNITO_E2E_CLIENT_ID,
        UserPoolId: Config.IDENTITY_COGNITO_USER_POOL_ID,
        AuthParameters: {
          USERNAME: this.userDetail.email,
          PASSWORD: this.userDetail.password,
          // SECRET_HASH: this.generateSecretHash(),
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

  // ============================= SETUP / CLEANUP =============================

  public static async setup() {
    const client = new CognitoIdentityProviderClient({ region: 'eu-west-2' });

    const userDetail: TestUserDetails = {
      email: `e2e-${faker.internet.email()}`,
      password: faker.internet.password(),
      attributes: {
        blcOldId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        blcOldUuid: faker.string.uuid(),
      },
    };

    logger.info({
      message: 'Setting up cognito user...',
    });
    logger.debug({
      message: `Creating user with username ${userDetail.email}...`,
    });

    await client.send(
      new AdminCreateUserCommand({
        UserPoolId: Config.IDENTITY_COGNITO_USER_POOL_ID,
        Username: userDetail.email,
        // Random temporary password
        TemporaryPassword: faker.internet.password(),
        UserAttributes: [
          { Name: 'email', Value: userDetail.email },
          { Name: 'email_verified', Value: 'true' },
          // Custom attributes
          { Name: 'custom:blc_old_id', Value: userDetail.attributes.blcOldId.toString() },
          { Name: 'custom:blc_old_uuid', Value: userDetail.attributes.blcOldUuid },
          // Tag user as test user (in case we need to manually cleanup later)
          { Name: 'custom:e2e', Value: 'true' },
        ],
        MessageAction: 'SUPPRESS',
      }),
    );

    logger.debug({
      message: 'Setting user password...',
    });

    // Update the password to prevent NEW_PASSWORD_REQUIRED challenge
    await client.send(
      new AdminSetUserPasswordCommand({
        Password: userDetail.password,
        UserPoolId: Config.IDENTITY_COGNITO_USER_POOL_ID,
        Username: userDetail.email,
        Permanent: true,
      }),
    );

    logger.info({
      message: '✅ Cognito user setup complete',
    });

    return new TestUser(client, userDetail);
  }

  public async cleanup() {
    logger.info({
      message: 'Cleaning up cognito user...',
    });

    await this.client.send(
      new AdminDeleteUserCommand({
        UserPoolId: Config.IDENTITY_COGNITO_USER_POOL_ID,
        Username: this.userDetail.email,
      }),
    );

    logger.info({
      message: '✅ Cognito user cleanup complete',
    });
  }
}
