import { Logger } from '@aws-lambda-powertools/logger'
import axios from 'axios';
import parsePhoneNumber from 'libphonenumber-js';
var base64 = require('base-64');

const service: string = process.env.SERVICE as string
const blcApiUrl = process.env.BLC_API_URL
const blcApiAuth = process.env.BLC_API_AUTH
const logger = new Logger({ serviceName: `${service}-verify` })

export const handler = async (event: any, context: any) => {
    logger.debug("event", {event})

    if (event.triggerSource == "UserMigration_Authentication") {
        // Authenticate the user with your existing user directory service
        const user = await authenticateUser(event.userName, event.request.password);
        if (user) {
            event.response.userAttributes = user;
            event.response.finalUserStatus = "CONFIRMED";
            event.response.messageAction = "SUPPRESS";
        }
    }
    return event;
};

const authenticateUser = async (username: string, password: string) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${blcApiUrl}/api/4/user/login.php?mode=1`,
            headers: {
                "x-duo-user": base64.encode(username),
                "x-duo-password": base64.encode(password),
                "Authorization": `Basic ${blcApiAuth}`
            }
        })
        logger.debug("old login response", { response })
        if (response && response.data && response.data.success) {
            return {
                email: username,
                email_verified: "true",
                phone_number: formatPhoneNumber(response.data.data.phone),
                phone_number_verified: "true",
                "custom:blc_old_id": response.data.data.id,
                "custom:blc_old_uuid": response.data.data.uuid,
            }
        }
    } catch (error) {
        logger.error('error during old login', { error })
    }
}

const formatPhoneNumber = (unparsedPhoneNumber: string) => {
    const phoneNumber = parsePhoneNumber(unparsedPhoneNumber, 'GB');
    if (phoneNumber && phoneNumber.isValid() && phoneNumber.number) {
        logger.debug ("phoneNumber", phoneNumber.number);
        return phoneNumber.number
    } else {
        return '';
    }
};