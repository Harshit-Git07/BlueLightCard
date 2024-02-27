import {Logger} from "@aws-lambda-powertools/logger";
import {PreAuthenticationTriggerEvent} from "aws-lambda";
import { isEmpty } from "lodash";
import { UnsuccessfulLoginAttemptsService } from "../services/UnsuccessfulLoginAttemptsService";

const service: string = process.env.SERVICE as string
const logger = new Logger({ serviceName: `${service}-preAuthentication` })

const TABLE_NAME = process.env.TABLE_NAME ?? "";
const API_AUTHORISER_USER_BLC = process.env.API_AUTHORISER_USER_BLC ?? "";
const API_AUTHORISER_PASSWORD_BLC = process.env.API_AUTHORISER_PASSWORD_BLC ?? "";
const RESET_PASSWORD_API_URL = process.env.RESET_PASSWORD_API_URL ?? "";
const WRONG_PASSWORD_ENTER_LIMIT:number = Number(process.env.WRONG_PASSWORD_ENTER_LIMIT) ?? 2;
const WRONG_PASSWORD_RESET_TRIGGER_MINUTES:number = Number(process.env.WRONG_PASSWORD_RESET_TRIGGER_MINUTES) ?? 30;

const UNSUCCESSFUL_ATTEMPTS_CUSTOM_ERROR_MESSAGE = ": You previously had 2 unsuccessful login attempts for this email in the last 30 minutes. As a precaution, your current login attempt has been blocked. If your email exists in our system, you will receive a password reset email in your inbox.";

const unsuccessfulLoginAttemptsService = new UnsuccessfulLoginAttemptsService(TABLE_NAME, logger);

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
        action: 'resetPasswordCognitoHostedUI',
        email : email,
        userPoolId: userPoolId
    });

    const results = await unsuccessfulLoginAttemptsService.checkIfDatabaseEntryExists(email, userPoolId);

    if(isEmpty(results) || results === undefined) {
        await unsuccessfulLoginAttemptsService.addOrUpdateRecord(email, userPoolId, 1)
        return event;
    }
    
    // gets first item from results array
    const [record] = results;
    
    // destructure record
    const { count, timestamp } = record;
    
    // is timestamp within last 30 minutes
    const isTimeStampWithinLast30Mins =  isTimeStampWithinLast30Minutes(timestamp);
    
    if (count < WRONG_PASSWORD_ENTER_LIMIT) {
        const newCount = isTimeStampWithinLast30Mins ? count + 1 : 1;
        await unsuccessfulLoginAttemptsService.addOrUpdateRecord(email, userPoolId, newCount)
    } else if (count === WRONG_PASSWORD_ENTER_LIMIT && isTimeStampWithinLast30Mins) {
        await unsuccessfulLoginAttemptsService.deleteRecord(email, userPoolId);
        const sendResetPwdEmailApiResponse = await unsuccessfulLoginAttemptsService.sendEmailtoUser(email, RESET_PASSWORD_API_URL, 
            API_AUTHORISER_USER_BLC, API_AUTHORISER_PASSWORD_BLC)
        logger.info(sendResetPwdEmailApiResponse);
        throw new Error(UNSUCCESSFUL_ATTEMPTS_CUSTOM_ERROR_MESSAGE);
    } else if (count === WRONG_PASSWORD_ENTER_LIMIT && !isTimeStampWithinLast30Mins) {
        await unsuccessfulLoginAttemptsService.addOrUpdateRecord(email, userPoolId, 1);
    }

    return event;
}

function isTimeStampWithinLast30Minutes(timestamp: number) {
    return Date.now() - timestamp <= WRONG_PASSWORD_RESET_TRIGGER_MINUTES * 60 * 100;
}
