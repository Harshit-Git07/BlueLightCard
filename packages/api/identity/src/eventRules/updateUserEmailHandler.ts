import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Logger } from '@aws-lambda-powertools/logger';
import { deleteUserFromCognito } from '../cognito/deleteUserFromCognito';
import { updateCognitoEmail } from '../cognito/updateCognitoEmail';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);

const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';
const logger = new Logger({
  serviceName: `${service}-updateUserEmailRuleHandler`,
  logLevel: logLevel,
});

export const handler = async (event: any) => {
  const cognito = new CognitoIdentityProviderClient();
  const userPoolIdDds = getEnv(IdentityStackEnvironmentKeys.USER_POOL_ID_DDS);
  const userPoolId = getEnv(IdentityStackEnvironmentKeys.USER_POOL_ID);
  const oldUserPoolId = getEnv(IdentityStackEnvironmentKeys.OLD_USER_POOL_ID);
  const oldUserPoolIdDds = getEnv(IdentityStackEnvironmentKeys.OLD_USER_POOL_ID_DDS);

  const poolId = !/DDS/i.test(event.detail.brand) ? userPoolId : userPoolIdDds;
  const oldPoolId = !/DDS/i.test(event.detail.brand) ? oldUserPoolId : oldUserPoolIdDds;
  const email = event.detail.user_email;
  const oldEmail = event.detail.old_user_email;

  if (!poolId || !oldPoolId || !email || !oldEmail) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `cognito poolId or email(s) not provided`,
      }),
    };
  }

  try {
    await deleteUserFromCognito(cognito, oldPoolId, oldEmail);
    if (event.detail.isSpare === 'true') {
      await deleteUserFromCognito(cognito, poolId, oldEmail);
    } else {
      await updateCognitoEmail(cognito, poolId, oldEmail, email);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User email update success.`,
      }),
    };
  } catch (error: any) {
    logger.error(`error updating user email in Cognito`, { error });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `User email update failed.`,
      }),
    };
  }
};
