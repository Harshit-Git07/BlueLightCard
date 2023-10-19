import { Logger } from '@aws-lambda-powertools/logger'
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import { v4 } from 'uuid';
import { SQS } from 'aws-sdk';
import axios from 'axios';
import parsePhoneNumber from 'libphonenumber-js';
import { transformDateToFormatYYYYMMDD } from './../../../core/src/utils/date';
import { setDate } from './../../../core/src/utils/setDate';
var base64 = require('base-64');

const service: string = process.env.SERVICE as string
const apiUrl = process.env.API_URL
const apiAuth = process.env.API_AUTH
const logger = new Logger({ serviceName: `${service}-migration` });
const sqs = new SQS();
async function sendToDLQ(event: any) {
    const dlqUrl = process.env.DLQ_URL || '';
    const params = {
      QueueUrl: dlqUrl,
      MessageBody: JSON.stringify(event)
    };
    await sqs.sendMessage(params).promise();
}

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
            url: `${apiUrl}/api/4/user/login.php?mode=1&audit=false`,
            headers: {
                "x-duo-user": base64.encode(username),
                "x-duo-password": base64.encode(password),
                "Authorization": `Basic ${apiAuth}`
            }
        })
        logger.debug("old login response", { response })
        if (response && response.data && response.data.success) {
            //add to event bus
            await addUserSignInMigratedEvent(response.data.data);
            return {
                email: username,
                email_verified: "true",
                phone_number: formatPhoneNumber(response.data.data.mobile),
                phone_number_verified: "true",
                "custom:blc_old_id": response.data.data.id,
                "custom:blc_old_uuid": response.data.data.uuid,
            }
        }
    } catch (error) {
        logger.error('error during old login', { error, username })
    }
}

const formatPhoneNumber = (unparsedPhoneNumber: string) => {
    if (typeof unparsedPhoneNumber !== 'string'){
        return '+440000000000';
    }
    const phoneNumber = parsePhoneNumber(unparsedPhoneNumber, 'GB');
    if (phoneNumber && phoneNumber.isValid() && phoneNumber.number) {
        logger.debug ("phoneNumber", phoneNumber.number);
        return phoneNumber.number
    } else {
        return '+440000000000';
    }
};

const addUserSignInMigratedEvent = async (data: any) => {
    const profileUuid: string = v4();
    const uuid = data.uuid;
    let cardstatus = 1;
    if(data.carddata !== undefined && (data.carddata.cardstatus !== undefined || data.carddata.cardstatus !== null))
    {
        cardstatus = data.carddata.cardstatus;
    }
    let dateposted = '0000-00-00 00:00:00';
    if(data.carddata !== undefined && data.carddata.dateposted !== undefined){
        dateposted = data.carddata.dateposted;
    }
    let dob = '0000-00-00';
    if(!isNaN(Date.parse(data.dob))){
        dob = transformDateToFormatYYYYMMDD(data.dob);
    }
    const input = {
        Entries: [
            {
            Time: new Date("TIMESTAMP"),
            EventBusName: process.env.EVENT_BUS,
            Source: process.env.EVENT_SOURCE,
            DetailType:`${data.brand} User Sign In Migrated`,
            Detail: JSON.stringify({
                uuid: uuid,
                brand: data.brand,
                profileUuid: profileUuid,
                legacyUserId: data.id,
                name: data.fname,
                surname: data.lname,
                dob: dob,
                gender: data.gender ?? 'O',
                mobile: formatPhoneNumber(data.mobile),
                spareemail: data.spareemail ?? ' ',
                spareemailvalidated: data.spareemailvalidated,
                service: data.service,
                county: data.county,
                trustId: data.employerdata.primarytrust ?? '0',
                trustName: data.employerdata.employer ?? ' ',
                merged_uid: data.merged_uid == null ?? '0',
                merged_time: setDate(data.merged_time),
                ga_key: data.GA_Key ?? ' ',
                cardId: data.cardid,
                cardExpires: setDate(data.expiresiso),
                cardStatus: cardstatus,
                cardPosted: setDate(dateposted)
            }),
            },
        ],
        };
        const client = new EventBridgeClient({ region: process.env.REGION });
        try{
        const command = new PutEventsCommand(input);
        await client.send(command);
        }catch(err: any) {
        logger.error("error adding user sign in migrated event", { uuid, err });
        await sendToDLQ(data);
        throw new Error(`Error adding user sign in migrated event${data} : ${err.message}.`)
    }
    
}