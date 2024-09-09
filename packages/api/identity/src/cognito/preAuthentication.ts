import { Logger } from '@aws-lambda-powertools/logger';
import { PreAuthenticationTriggerEvent } from 'aws-lambda';
import { isEmpty } from 'lodash';
import { UnsuccessfulLoginAttemptsService } from '../services/UnsuccessfulLoginAttemptsService';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);

const logLevel =
  getEnvOrDefault(IdentityStackEnvironmentKeys.DEBUG_LOGGING_ENABLED, 'false').toLowerCase() ==
  'true'
    ? 'DEBUG'
    : 'INFO';

const logger = new Logger({
  serviceName: `${service}-preAuthentication`,
  logLevel: logLevel,
});

const UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME = getEnv(
  IdentityStackEnvironmentKeys.UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME,
);
const API_AUTHORISER_USER = getEnv(IdentityStackEnvironmentKeys.API_AUTHORISER_USER);
const API_AUTHORISER_PASSWORD = getEnv(IdentityStackEnvironmentKeys.API_AUTHORISER_PASSWORD);
const RESET_PASSWORD_API_URL = getEnv(IdentityStackEnvironmentKeys.RESET_PASSWORD_API_URL);

const WRONG_PASSWORD_ENTER_LIMIT: number = parseInt(
  getEnvOrDefault(IdentityStackEnvironmentKeys.WRONG_PASSWORD_ENTER_LIMIT, '2'),
);

const WRONG_PASSWORD_RESET_TRIGGER_MINUTES: number = parseInt(
  getEnvOrDefault(IdentityStackEnvironmentKeys.WRONG_PASSWORD_RESET_TRIGGER_MINUTES, '30'),
);

const UNSUCCESSFUL_ATTEMPTS_CUSTOM_ERROR_MESSAGE = `:
It looks like the email or password you entered is incorrect.

Please check your email address. If it matches our records, we will send you a password reset email.

If you remember your password, you can try logging in again`;
const SYSTEM_DOWN_ERROR_MESSAGE =
  ':\n Unable to process your request.\nPlease contact customer service';

const unsuccessfulLoginAttemptsService = new UnsuccessfulLoginAttemptsService(
  UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME,
  logger,
);

/*
- On 1st attempt, if email is not in DB for brand, create record for member id, email, brand, count = 1 and timestamp to now.
- On 2nd attempt, if email exists in DB for brand, count is 1 and timestamp is in last 30 mins, update count to 2
- On 3rd attempt, if email exists in DB for brand, count is 2 and timestamp is in last 30 mins, trigger a reset password email and custom error message that blocks the login.
*/

export const handler = async (event: PreAuthenticationTriggerEvent, context: any) => {
  const email = event.request.userAttributes.email;
  const userPoolId = event.userPoolId;

  logger.info('audit', {
    audit: true,
    action: event.triggerSource,
    email: email,
    userPoolId: userPoolId,
  });

  const results = await unsuccessfulLoginAttemptsService.checkIfDatabaseEntryExists(
    email,
    userPoolId,
  );

  if (isEmpty(results) || results === undefined) {
    await unsuccessfulLoginAttemptsService.addOrUpdateRecord(email, userPoolId, 1);
    return event;
  }

  // gets first item from results array
  const [record] = results;

  // destructure record
  const { count, timestamp } = record;

  // is timestamp within last 30 minutes
  const isTimeStampWithinConfiguredMins = isTimeStampWithinConfiguredMinutes(timestamp);

  if (count < WRONG_PASSWORD_ENTER_LIMIT) {
    const newCount = isTimeStampWithinConfiguredMins ? count + 1 : 1;
    await unsuccessfulLoginAttemptsService.addOrUpdateRecord(email, userPoolId, newCount);
  } else if (count === WRONG_PASSWORD_ENTER_LIMIT && isTimeStampWithinConfiguredMins) {
    logger.debug('Limit exceeded for user with email: ' + email + ', sending reset password email');
    const sendResetPwdEmailApiResponse = await unsuccessfulLoginAttemptsService.sendEmailtoUser(
      email,
      RESET_PASSWORD_API_URL,
      API_AUTHORISER_USER,
      API_AUTHORISER_PASSWORD,
      String(WRONG_PASSWORD_ENTER_LIMIT),
      String(WRONG_PASSWORD_RESET_TRIGGER_MINUTES),
    );
    logger.debug(sendResetPwdEmailApiResponse.json());
    if (!sendResetPwdEmailApiResponse.ok) {
      throw new Error(SYSTEM_DOWN_ERROR_MESSAGE);
    }
    await unsuccessfulLoginAttemptsService.deleteRecord(email, userPoolId);
    throw new Error(UNSUCCESSFUL_ATTEMPTS_CUSTOM_ERROR_MESSAGE);
  } else if (count === WRONG_PASSWORD_ENTER_LIMIT && !isTimeStampWithinConfiguredMins) {
    await unsuccessfulLoginAttemptsService.addOrUpdateRecord(email, userPoolId, 1);
  }

  return event;
};

function isTimeStampWithinConfiguredMinutes(timestamp: number) {
  return timestamp > Date.now() - 1000 * WRONG_PASSWORD_RESET_TRIGGER_MINUTES * 60;
}
