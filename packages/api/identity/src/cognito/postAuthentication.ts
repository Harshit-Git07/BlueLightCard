import { Logger } from '@aws-lambda-powertools/logger';
import { PostAuthenticationTriggerEvent } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { UnsuccessfulLoginAttemptsService } from '../../src/services/UnsuccessfulLoginAttemptsService';

const oldUserPoolId = process.env.OLD_USER_POOL_ID;
const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-postAuthentication`, logLevel: process.env.DEBUG_LOGGING_ENABLED ? 'DEBUG' : 'INFO' });
const TABLE_NAME = process.env.TABLE_NAME ?? "";

const unsuccessfulLoginAttemptsService = new UnsuccessfulLoginAttemptsService(TABLE_NAME, logger);

export const handler = async (event: PostAuthenticationTriggerEvent, context: any) => {
  const email = event.request.userAttributes.email;
  const userPoolId = event.userPoolId;
  const migratedFromOldPool = event.request.userAttributes['custom:migrated_old_pool'];

  // if the 'custom:migrated_old_pool' attribute is not present or 'false', then run the audit
  if (!migratedFromOldPool || migratedFromOldPool === 'false') {
    logger.info('audit', {
        audit: true,
        action: 'signin',
        memberId : event.request.userAttributes['custom:blc_old_id'],
        clientId: event.callerContext.clientId,
    });

  // if the 'custom:migrated_old_pool' attribute is true, and this is the new pool, remove the attribute so that the audit runs on future logins
  } else if (isNewPool(oldUserPoolId, userPoolId)) {
    logger.debug(`Audit has been ran before: ${migratedFromOldPool}`);
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
      logger.error("failed to set attribute 'custom:migrated_old_pool' to 'false'",  {e} );
    }
  }
  
  if (isNewPool(oldUserPoolId, userPoolId)) {
    await deleteDBRecordIfExists(email, userPoolId);
  }

  return event;
};

async function deleteDBRecordIfExists(email: string, userPoolId: string) {
  const emailExists = await unsuccessfulLoginAttemptsService.checkIfDatabaseEntryExists(email, userPoolId);

    //Remove database entry if one exists
    if (emailExists) {
      try {
        await unsuccessfulLoginAttemptsService.deleteRecord(email, userPoolId);
      } catch (e: any) {
        logger.error("failed to delete record with email: " + email + " and user pool id: " + userPoolId, {e} );
      }
    }
}

function isNewPool(oldUserPoolId: string | undefined, userPoolId: string) {
  return oldUserPoolId && userPoolId !== oldUserPoolId;
}

