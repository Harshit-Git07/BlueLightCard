import { Logger } from '@aws-lambda-powertools/logger';
import { PostAuthenticationTriggerEvent } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const oldUserPoolId = process.env.OLD_USER_POOL_ID;
const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-postAuthentication` });

export const handler = async (event: PostAuthenticationTriggerEvent, context: any) => {
  const email = event.request.userAttributes.email;
  const userPoolId = event.userPoolId;
  const migratedFromOldPool = event.request.userAttributes['custom:migrated_old_pool'];

  logger.info(`Audit has been ran before: ${migratedFromOldPool}`);

  // if the 'custom:migrated_old_pool' attribute is not present or 'false', then run the audit
  if (!migratedFromOldPool || migratedFromOldPool === 'false') {
    logger.info('audit', {
        audit: true,
        action: 'signin',
        memberId : event.request.userAttributes['custom:blc_old_id'],
        clientId: event.callerContext.clientId,
    });
  // if the 'custom:migrated_old_pool' attribute is true, and this is the new pool, remove the attribute so that the audit runs on future logins
  } else if (oldUserPoolId && userPoolId !== oldUserPoolId) {
    const cognitoISP = new CognitoIdentityServiceProvider();

    try {
      await cognitoISP.adminUpdateUserAttributes({
          UserPoolId: userPoolId,
          Username: email,
          UserAttributes: [
              {
                  Name: 'custom:migrated_old_pool',
                  Value: 'false'
              }
          ]
      }).promise();
    } catch (e: any) {
      logger.debug("failed to set attribute 'custom:migrated_old_pool' to 'false'",  {e} );
    }
  }
  return event;
};
