import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Response } from './../../../core/src/utils/restResponse/response'
import { BRANDS } from './../../../core/src/types/brands.enum';
import { getCardStatus } from './../../../core/src/utils/getCardStatus';
import { setDate } from './../../../core/src/utils/setDate';
const service: string = process.env.SERVICE as string
const tableName = process.env.TABLE_NAME;
const logger = new Logger({ serviceName: `${service}-syncCardStatusUpdate` })
const sqs = new SQSClient({ region: process.env.REGION ?? 'eu-west-2'});

// Function to send a message to SQS Queue
async function sendToDLQ(event: any) {
  const dlqUrl = process.env.DLQ_URL || '';
  const params = {
    QueueUrl: dlqUrl,
    MessageBody: JSON.stringify(event)
  };
  await sqs.send(new SendMessageCommand(params));
}

const client = new DynamoDBClient({region: process.env.REGION ?? 'eu-west-2'});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event: any, context: any) => {
  logger.debug('event received', event);
  const brand = (event.detail !== undefined || event.detail !== null) ? event.detail.brand?.toUpperCase() : null;

  if (brand == null) {
    logger.debug('brand details missing', brand);
    return Response.BadRequest({ message: 'Please provide brand details' });
  }

  if (!(brand in BRANDS)) {
    logger.debug('invalid brand', brand);
    return Response.BadRequest({ message: 'Please provide a valid brand' });
  }

  if(event.detail.uuid === undefined || event.detail.uuid === ''
  || event.detail.cardNumber === undefined || event.detail.cardNumber === ''
  || event.detail.cardStatus === undefined ){
    logger.debug('required parameters are missing', event);
    return Response.BadRequest({ message: 'Required parameters are missing' });
  }
  const uuid = event.detail.uuid;
  const legacyCardId = event.detail.cardNumber;
  const newExpiry = event.detail.expires;
  const newPosted = event.detail.posted;
  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: '#pk= :pk And #sk = :sk',
    ExpressionAttributeValues: {
      ':pk': `MEMBER#${uuid}`,
      ':sk': `CARD#${legacyCardId}`,
    },
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
  };
  let Item : Record<string,string> = {};
  Item = {
      pk: `MEMBER#${uuid}`,
      sk: `CARD#${legacyCardId}`,
      status: getCardStatus(Number(event.detail.cardStatus))
  };

  try {
    const results = await dynamodb.send(new QueryCommand(queryParams));
    if(results.Items !== null && results.Count !== 0) { 
        const card = results.Items?.at(0) as Record<string, string>;
        Item['expires'] = (card.expires  === '0000000000000000' || (setDate(newExpiry) > card.expires)) ? `${setDate(newExpiry)}` : card.expires;
        Item['posted'] = card.posted === '0000000000000000' ? `${setDate(newPosted)}` : card.posted;
    }else {
        Item['expires'] = `${setDate(newExpiry)}`;
        Item['posted'] = `${setDate(newPosted)}`;
    }   
    const cardParams = {
        Item,
        TableName: tableName
    };
    try {
    const results = await dynamodb.send(new PutCommand(cardParams));
    logger.debug('results', { results });
    return Response.OK({ message: `user card data updated` });
    } catch (err: any) {
    logger.error("error syncing user card data", { uuid, err });
    await sendToDLQ(event);
    }
  } catch (err: any) {
    logger.error("error querying user card data", { uuid, err });
    await sendToDLQ(event);
  }
   
};


