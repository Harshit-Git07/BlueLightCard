import { type APIGatewayEvent, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
import { Response } from '../../../core/src/utils/restResponse/response';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { isValidEmail } from './emailValidator';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);

const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false') ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-globalLogout`,
  logLevel: logLevel,
});

export const handler = async (event: APIGatewayEvent, context: Context): Promise<object> => {
  logger.info('input', { event });
  const ADMIN_AUTH_API_KEY = getEnv(
    IdentityStackEnvironmentKeys.ADMIN_AUTH_API_KEY,
  );
  const COGNITO_USER_POOL_ID = getEnv(
    IdentityStackEnvironmentKeys.BLC_UK_COGNITO_USER_POOL_ID,
  );
  const OLD_COGNITO_USER_POOL_ID = getEnv(
    IdentityStackEnvironmentKeys.BLC_UK_OLD_COGNITO_USER_POOL_ID,
  );
  const headers = event.headers;
  const adminAuthHeader = headers['x-admin-api-key'] ?? null;
  if (adminAuthHeader !== ADMIN_AUTH_API_KEY) {
    return Response.Unauthorized({ message: 'Unauthorized' });
  }
  const body = event.body;
  const data = body ? JSON.parse(body) : null;
  const email = data?.email;
  if (!email) {
    return Response.BadRequest({ message: 'Please provide valid email' });
  }
  if (!isValidEmail(email)) {
    return Response.BadRequest({ message: 'Please provide valid email' });
  }
  const cognitoISP = new CognitoIdentityServiceProvider();
  // Try logging out from new Pool First and then from OLD as fallback.
  try {
    await cognitoISP
        .adminUserGlobalSignOut({
          UserPoolId: COGNITO_USER_POOL_ID,
          Username: email
        }).promise();
    logger.debug('User Logged out from new pool');
    return Response.OK({ message: 'User Logged out' });
  } catch (error: any) {
    logger.error('error logging out user from new pool ', { error });
    if (error?.code && error.code === 'UserNotFoundException') {
      try {
        await cognitoISP
        .adminUserGlobalSignOut({
          UserPoolId: OLD_COGNITO_USER_POOL_ID,
          Username: email
        }).promise();
        logger.debug('User Logged out from old pool');
        return Response.OK({ message: 'User Logged out' });
      } catch (error) {
        logger.error('error logging out user from old pool ', { error });
        return Response.Error(error as Error);
      }
    }
    return Response.Error(error as Error);
  }
};
