import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Logger } from '@aws-lambda-powertools/logger';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({ serviceName: `${service}-updateCognitoUserEmail`, logLevel: logLevel });

export async function updateCognitoEmail(
  cognito: CognitoIdentityProviderClient,
  poolId: string,
  username: string,
  newEmail: string,
) {
  if (!cognito || !poolId || !username || !newEmail) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'cognito client, poolId, username or new email not provided',
      }),
    };
  }
  const input = {
    UserPoolId: poolId,
    Username: newEmail,
  };
  try {
    const command = new AdminGetUserCommand(input);
    const response = await cognito.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'user email already exists in Cognito',
        }),
      };
    }
  } catch (e: any) {
    logger.error(`error getting user email in Cognito`, { e });
  }

  const params = {
    UserPoolId: poolId,
    Username: username,
    UserAttributes: [
      {
        Name: 'email',
        Value: newEmail,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
  };
  try {
    const command = new AdminUpdateUserAttributesCommand(params);
    const user = await cognito.send(command);
    if (user.$metadata.httpStatusCode === 200) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'user email updated in Cognito',
        }),
      };
    }
  } catch (e: any) {
    logger.error('error updating user email in Cognito', { e });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'user email could not be updated in Cognito',
      }),
    };
  }
}
