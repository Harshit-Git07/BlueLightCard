import { Logger } from '@aws-lambda-powertools/logger'
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import { v4 } from 'uuid';
import { CognitoIdentityServiceProvider, SQS } from 'aws-sdk'
import axios from 'axios';
import parsePhoneNumber from 'libphonenumber-js';
import { transformDateToFormatYYYYMMDD } from './../../../core/src/utils/date';
import { setDate } from './../../../core/src/utils/setDate';
import * as process from 'process'
import { createHmac } from 'crypto';
var base64 = require('base-64');

const service: string = process.env.SERVICE as string
const oldClientId = process.env.OLD_CLIENT_ID
const oldClientSecret = process.env.OLD_CLIENT_SECRET
const oldUserPoolId = process.env.OLD_USER_POOL_ID
const apiUrl = process.env.API_URL
const apiAuth = process.env.API_AUTH
const logger = new Logger({ serviceName: `${service}-migration` });
const sqs = new SQS();

const accountStatusErrors: { [key: string]: string} = {
  'Email Not Verified. Please see FAQs': "Your email has not been verified.\nPlease check your inbox for a verification link",
  'Awaiting Staff Approval. Please see FAQs': "Your account is awaiting staff approval",
  'Please contact us about your account.': "Your account has been suspended.\nPlease contact us",
};

async function sendToDLQ(event: any) {
    const dlqUrl = process.env.DLQ_URL || '';
    const params = {
      QueueUrl: dlqUrl,
      MessageBody: JSON.stringify(event)
    };
    await sqs.sendMessage(params).promise();
}

export const generateSecretHash = async (username: string, clientId: string, clientSecret: string) => {
  return createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

export const handler = async (event: any, context: any) => {
    logger.debug("event", {event})

    if (event.triggerSource == "UserMigration_Authentication") {
      try {
        // Authenticate the user with the old user pool
        let user = await authenticateUserOldPool(event.userName, event.request.password);

        if (!user) {
          // Authenticate the user with your existing user directory service
          user = await authenticateUser(event.userName, event.request.password);
        }

        if (user) {
          event.response.userAttributes = user;
          event.response.finalUserStatus = "CONFIRMED";
          event.response.messageAction = "SUPPRESS";
        }
      } catch (error: any) {
        logger.debug("error: ", { error });
        const mappedAccountStatusError = accountStatusErrors[error.message];

        if (mappedAccountStatusError) {
          throw new Error(":\n" + mappedAccountStatusError);
        } else {
          let errorMessage = error.message;
          
          if (errorMessage.length > 0 && errorMessage[errorMessage.length-1] === ".") {
            errorMessage = errorMessage.slice(0,-1);
          }

          throw new Error(":\n" + errorMessage);
        }
      }
    }

    return event;
}

const authenticateUserOldPool = async (username: string, password: string) => {
    //check on an old user pool
    if (oldClientId && oldUserPoolId && oldClientSecret) {
      logger.debug('trying to look old user pool');
      const cognitoISP = new CognitoIdentityServiceProvider();
      try {
        const cognitoResponse = await cognitoISP.adminInitiateAuth({
          AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
          AuthParameters: {
            PASSWORD: password,
            USERNAME: username,
            SECRET_HASH: await generateSecretHash(username, oldClientId, oldClientSecret)
          },
          UserPoolId: oldUserPoolId,
          ClientId: oldClientId
        }).promise();
        if (cognitoResponse) {
          const accessToken= cognitoResponse.AuthenticationResult?.AccessToken

          if (accessToken) {
            try {
              const user = await cognitoISP.getUser({ AccessToken: accessToken }).promise();

              if (user) {
                const attributesObject = user.UserAttributes.reduce((acc: { [key: string]: any }, attr) => {
                  if (attr.Name !== 'sub') { // Continue to skip 'sub' attribute
                    // @ts-ignore
                    acc[attr.Name] = attr.Value; // Keep the attribute name unchanged, including 'custom:' prefix
                  }
                  return acc;
                }, {});

                attributesObject['custom:migrated_old_pool'] = true;
                return attributesObject;
              }
            } catch (e: any) {
              logger.debug("user not found on old cognito: ",  {e} );
            }
          }
        }
      } catch (err) {
        logger.debug('user not authenticated on old cognito', {err} )
      }
    }
}

const authenticateUser = async (username: string, password: string) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${apiUrl}/api/4/user/migrationLogin.php.php?mode=1&audit=false`,
            headers: {
                "x-duo-user": base64.encode(username),
                "x-duo-password": base64.encode(password),
                "Authorization": `Basic ${apiAuth}`
            }
        })
        
        logger.debug("old login response", { response })
        if (response && response.data) {
            if (!response.data.success && response.data.code !== 1013) {
              throw new Error(response.data.message)
            }
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
    } catch (error: any) {
        logger.error('error during old login', { error, username })
        throw new Error(error.message)
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
    let dob = null;
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
                gender: data.gender,
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
