
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import {z, ZodError} from 'zod';
import { Response } from '../../../core/src/utils/restResponse/response'
import { sendToDLQ } from '../helpers/DLQ';
import { v4 } from 'uuid';

const service = process.env.SERVICE as string
const table = process.env.TABLE_NAME;
const logger = new Logger({ serviceName: `${service}-createUserProfile` })
const client = new DynamoDBClient({region: process.env.REGION ?? 'eu-west-2'});
const dynamodb = DynamoDBDocumentClient.from(client);

const EventBusEvent = z.object({
  uuid: z.string().uuid(),
  brand: z.enum(["BLC_UK", "DDS_UK", "BLC_AU"]),
  surname: z.string(),
  employer: z.string(),
  firstname: z.string(),
  organisation: z.string(),
  ga_key: z.string().default(' '),
  spare_email: z.string().default(' '),
  employer_id: z.string().default('0'),
  dob: z.string().default('00/00/0000'),
  spare_email_validated: z.number().default(0),
  gender: z.string().default('O'),
  merged_time: z.string().default('0000000000000000'),
  merged_uid: z.boolean().default(false),
  mobile: z.string().default('+440000000000')
});

type EventBusEvent = z.infer<typeof EventBusEvent>;

export const handler = async (event: any, context: any) => {
  logger.info('event received', event);

  try {
    const details = EventBusEvent.parse(event.detail);
    
    const userParams = {
      Item: {
        pk: `MEMBER#${details.uuid}`,
        sk: `PROFILE#${v4()}`,
        dob: details.dob,
        employer: details.employer,
        employer_id: details.employer_id,
        firstname: details.firstname,
        ga_key: details.ga_key,
        gender: details.gender,
        mobile: details.mobile,
        merged_time: details.merged_time,
        merged_uid: details.merged_uid,
        organisation: details.organisation,
        spare_email: details.spare_email,
        spare_email_validated: details.spare_email_validated,
        surname: details.surname
      },
      TableName: table
    }
    try {
      const results = await dynamodb.send(new PutCommand(userParams));
      logger.debug('results', { results });
    } catch (err: any) {
      logger.error("error creating user profile data ", {uuid: details.uuid, err});
      await sendToDLQ(event);
    }

  } catch (err: any) {
    if(err instanceof ZodError){
      logger.error('required parameters are missing', {event, err});
      return Response.BadRequest({ message: 'Required parameters are missing' });
    }
  }
}