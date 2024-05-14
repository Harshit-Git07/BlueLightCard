import { SQS } from 'aws-sdk';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Response } from './../../../core/src/utils/restResponse/response';
import { BRANDS } from './../../../core/src/types/brands.enum';
import { getCardStatus } from './../../../core/src/utils/getCardStatus';
const service: string = process.env.SERVICE as string;
const tableName = process.env.TABLE_NAME;
const idMappingtableName = process.env.ID_MAPPING_TABLE_NAME;
const logger = new Logger({ serviceName: `${service}-migrateUserProfileAndCardData` });
const sqs = new SQS();

// Function to send a message to SQS Queue
async function sendToDLQ(event: any) {
  const dlqUrl = process.env.DLQ_URL || '';
  const params = {
    QueueUrl: dlqUrl,
    MessageBody: JSON.stringify(event),
  };
  await sqs.sendMessage(params).promise();
}

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event: any, context: any) => {
  logger.debug('event received', event);
  const brand = event.detail !== undefined || event.detail !== null ? event.detail.brand?.toUpperCase() : null;

  if (brand == null) {
    return Response.BadRequest({ message: 'Please provide brand details' });
  }

  if (!(brand in BRANDS)) {
    return Response.BadRequest({ message: 'Please provide a valid brand' });
  }

  if (
    event.detail.uuid === undefined ||
    event.detail.uuid === '' ||
    event.detail.legacyUserId === undefined ||
    event.detail.legacyUserId === '' ||
    event.detail.profileUuid === undefined ||
    event.detail.profileUuid === ''
  ) {
    return Response.BadRequest({ message: 'Required parameters are missing' });
  }

  const uuid = event.detail.uuid;
  const legacyId = event.detail.legacyUserId;
  const profileUuid = event.detail.profileUuid;
  const legacyCardId = event.detail.cardId;

  const userParams = {
    Item: {
      pk: `MEMBER#${uuid}`,
      sk: `BRAND#${brand}`,
      legacy_id: legacyId,
    },
    TableName: tableName,
  };
  try {
    const results = await dynamodb.send(new PutCommand(userParams));
    logger.debug('results', { results });
  } catch (err: any) {
    logger.error('error migrating user data ', { uuid, err });
    await sendToDLQ(event);
  }

  //save id mapping
  const idMappingParams = {
    Item: {
      legacy_id: `BRAND#${brand}#${legacyId}`,
      uuid: uuid,
    },
    TableName: idMappingtableName,
  };
  try {
    const results = await dynamodb.send(new PutCommand(idMappingParams));
    logger.debug('results', { results });
  } catch (err: any) {
    logger.error('error saving id mapping data', { uuid, err });
    await sendToDLQ(event);
  }

  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: '#pk= :pk And begins_with(#sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `MEMBER#${uuid}`,
      ':sk': `PROFILE#`,
    },
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
  };
  // check for existing card profile data
  try {
    let oldProfileUuid = null;
    const result = await dynamodb.send(new QueryCommand(queryParams));
    if (result.Items !== null && result.Count !== 0) {
      const user = result.Items?.at(0) as Record<string, string>;
      oldProfileUuid = user.sk;
    }
    const profileParams = {
      Item: {
        pk: `MEMBER#${uuid}`,
        sk: oldProfileUuid !== null ? oldProfileUuid : `PROFILE#${profileUuid}`,
        firstname: event.detail.name,
        surname: event.detail.surname,
        spare_email: event.detail.spareemail ?? 'NA',
        spare_email_validated: event.detail.spareemailvalidated,
        organisation: event.detail.service,
        gender: event.detail.gender,
        dob: event.detail.dob,
        merged_uid: event.detail.merged_uid,
        merged_time: event.detail.merged_time,
        mobile: event.detail.mobile,
        employer: event.detail.trustName,
        employer_id: event.detail.trustId,
        ga_key: event.detail.ga_key,
      },
      TableName: tableName,
    };
    try {
      const results = await dynamodb.send(new PutCommand(profileParams));
      logger.debug('results', { results });
    } catch (err: any) {
      logger.error('error inserting user profile', { uuid, err });
      await sendToDLQ(event);
    }
  } catch (err: any) {
    logger.error('error querying user profile', { uuid, err });
    await sendToDLQ(event);
  }

  if (event.detail.cardId != undefined && event.detail.cardId != '') {
    const cardParams = {
      Item: {
        pk: `MEMBER#${uuid}`,
        sk: `CARD#${legacyCardId}`,
        status: getCardStatus(Number(event.detail.cardStatus)),
        expires: event.detail.cardExpires,
        posted: event.detail.cardPosted,
      },
      TableName: tableName,
    };

    try {
      const results = await dynamodb.send(new PutCommand(cardParams));
      logger.debug('results', { results });
    } catch (err: any) {
      logger.error('error migrating user card data', { uuid, err });
      await sendToDLQ(event);
    }
  }
};
