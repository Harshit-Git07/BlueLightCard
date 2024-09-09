import { Logger } from '@aws-lambda-powertools/logger';
import { EventBridgeEvent } from 'aws-lambda';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';

const region: string = getEnvOrDefault(IdentityStackEnvironmentKeys.REGION, 'eu-west-2');
const sqs = new SQSClient({ region: region });

// Function to send a message to SQS Queue
async function sendToDLQ(event: any) {
  const dlqUrl = getEnv(IdentityStackEnvironmentKeys.DLQ_URL);
  const params = {
    QueueUrl: dlqUrl,
    MessageBody: JSON.stringify(event),
  };
  await sqs.send(new SendMessageCommand(params));
}

const service: string = getEnv(IdentityStackEnvironmentKeys.SERVICE);
const identityTableName: string = getEnv(IdentityStackEnvironmentKeys.IDENTITY_TABLE_NAME);
const idMappingTableName: string = getEnv(IdentityStackEnvironmentKeys.ID_MAPPING_TABLE_NAME);
const logger = new Logger({ serviceName: `${service}-companyFollowsUpdate` });
const client = new DynamoDBClient({ region: region });
const dynamodb = DynamoDBDocumentClient.from(client);

async function updateCompanyFollows(
  user: Record<string, string>,
  input: Input,
  event: EventBridgeEvent<any, any>,
) {
  const putParams = {
    Item: {
      pk: `MEMBER#${user.uuid}`,
      sk: `COMPANYFOLLOWS#${input.company_id}`,
      likeType: input.likeType,
    },
    TableName: identityTableName,
  };
  try {
    const results = await dynamodb.send(new PutCommand(putParams));
    logger.debug('results', { results });
  } catch (err: any) {
    logger.error('error syncing company follows', { err });
    await sendToDLQ(event);
  }
}

async function deleteCompanyFollows(
  user: Record<string, string>,
  input: Input,
  event: EventBridgeEvent<any, any>,
) {
  const deleteParams = {
    Key: {
      pk: `MEMBER#${user.uuid}`,
      sk: `COMPANYFOLLOWS#${input.company_id}`,
    },
    TableName: identityTableName,
  };
  try {
    const results = await dynamodb.send(new DeleteCommand(deleteParams));
    logger.debug('deleted', { results });
  } catch (err: any) {
    logger.error('error deleting company follows', { err });
    await sendToDLQ(event);
  }
}

export const handler = async (event: EventBridgeEvent<any, any>) => {
  logger.info('event received', { event });
  if (!event.detail) {
    logger.error('event detail is missing', { event });
  }
  const input = event.detail as Input;

  //call dynamoDB to map user legacy id to user uuid
  const queryParams = {
    TableName: idMappingTableName,
    KeyConditionExpression: '#legacy_id= :legacy_id',
    ExpressionAttributeValues: {
      ':legacy_id': `BRAND#${input.brand}#${input.legacy_id}`,
    },
    ExpressionAttributeNames: {
      '#legacy_id': 'legacy_id',
    },
  };
  const result = await dynamodb.send(new QueryCommand(queryParams));
  if (result.Items === null || result.Items?.length === 0) {
    logger.error('user uuid not found', { input });
  }
  const user = result.Items?.at(0) as Record<string, string>;
  logger.info('user uuid found', { user });
  if (input.action === 'update') {
    await updateCompanyFollows(user, input, event);
  } else if (input.action === 'delete') {
    await deleteCompanyFollows(user, input, event);
  }
};

type Input = {
  company_id: string;
  likeType: string;
  brand: string;
  legacy_id: string;
  action: string;
};
