import { Logger } from '@aws-lambda-powertools/logger';
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-deleteUserFromCognito`, logLevel: process.env.DEBUG_LOGGING_ENABLED ? 'DEBUG' : 'INFO'});

export async function deleteUserFromCognito(
  cognito: CognitoIdentityProviderClient,
  poolId: string,
  username: string,
) {
  if (!cognito || !poolId || !username) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `cognito client, poolId or username not provided`,
      }),
    };
  }
  const input = {
    UserPoolId: poolId,
    Username: username,
  };
  try {
    const command = new AdminGetUserCommand(input);
    const response = await cognito.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      const command = new AdminDeleteUserCommand(input);
      await cognito.send(command);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `User ${username} deleted`,
        }),
      };
    } else {
      return {
        statusCode: response.$metadata.httpStatusCode,
        body: JSON.stringify({
          message: `User ${username} not found to delete from Cognito`,
        }),
      };
    }
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `User ${username} could not be deleted`,
      }),
    };
  }
}
