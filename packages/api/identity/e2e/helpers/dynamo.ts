import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  NativeAttributeValue,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  UpdateCommand,
  UpdateCommandInput
} from '@aws-sdk/lib-dynamodb';

export async function getItemFromIdentityTable(memberUuid: string, sortKeyPrefix: string): Promise<Record<string, any> | undefined> {
  const dynamodb = createDynamoDbClient();
  const queryParams = {
    TableName: `${process.env.E2E_IDENTITY_TABLE_NAME}`,
    KeyConditionExpression: '#pk= :pk AND begins_with(#sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `MEMBER#${memberUuid}`,
      ':sk': sortKeyPrefix,
    },
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
  };

  const result = await dynamodb.send(new QueryCommand(queryParams));
  return result.Items?.[0];
}

export async function getItemFromIdMappingTable(brand: string, legacyId: number, memberUuid: string): Promise<Record<string, any> | undefined> {
  const dynamodb = createDynamoDbClient();
  const queryParams = {
    TableName: `${process.env.E2E_ID_MAPPING_TABLE_NAME}`,
    KeyConditionExpression: '#legacy_id= :legacy_id AND #uuid = :uuid',
    ExpressionAttributeValues: {
      ':legacy_id': `BRAND#${brand}#${legacyId}`,
      ':uuid': memberUuid,
    },
    ExpressionAttributeNames: {
      '#legacy_id': 'legacy_id',
      '#uuid': 'uuid',
    },
  };

  const result = await dynamodb.send(new QueryCommand(queryParams));
  return result.Items?.[0];
}

export async function getUnsuccessfulLoginItemFor(
  email: string
): Promise<Record<string, NativeAttributeValue>[]> {
  const dynamodb = createDynamoDbClient();
  const params = {
    ExpressionAttributeValues: {
      ":email": email,
      ":userPoolId": process.env.E2E_IDENTITY_COGNITO_USER_POOL_ID
    },
    ExpressionAttributeNames: {
      "#email": "email",
      "#userPoolId": "userPoolId"
    },
    TableName: process.env.E2E_UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME,
    KeyConditionExpression: "#email = :email and #userPoolId = :userPoolId",
    IndexName: 'gsi1',
  }

  const response = await dynamodb.send(new QueryCommand(params));
  return response.Items ?? [];
}

export async function createProfileItemInIdentityTableFor(
  memberUuid: string,
  profileUuid: string
): Promise<void> {
  const dynamodb = createDynamoDbClient();
  const updateParams = {
    TableName: `${process.env.E2E_IDENTITY_TABLE_NAME}`,
    Key: {
      pk: `MEMBER#${memberUuid}`,
      sk: `PROFILE#${profileUuid}`
    }
  } as UpdateCommandInput;

  await dynamodb.send(new UpdateCommand(updateParams));
}

export async function createCardItemInIdentityTableFor(
  memberUuid: string,
  cardId: number,
  status: string,
  expires: string,
  posted: string
): Promise<void> {
  const dynamodb = createDynamoDbClient();
  const updateParams = {
    TableName: `${process.env.E2E_IDENTITY_TABLE_NAME}`,
    Item: {
      pk: `MEMBER#${memberUuid}`,
      sk: `CARD#${cardId}`,
      status,
      expires,
      posted,
    }
  } as PutCommandInput;

  await dynamodb.send(new PutCommand(updateParams));
}

export async function createUnsuccessfulLoginItemFor(
  email: string,
  count: number = 1
): Promise<void> {
  const dynamodb = createDynamoDbClient();
  const putParams = {
    TableName: process.env.E2E_UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME,
    Item: {
      email: email,
      userPoolId: process.env.E2E_IDENTITY_COGNITO_USER_POOL_ID,
      count: count,
      timestamp: Date.now(),
    },
  }

  await dynamodb.send(new PutCommand(putParams));
}

export async function deleteProfileItemFromIdentityTableFor(
  memberUuid: string,
  profileSortKey: string
): Promise<void> {
  const dynamodb = createDynamoDbClient();
  const queryParams = {
    TableName: `${process.env.E2E_IDENTITY_TABLE_NAME}`,
    Key: {
      pk: `MEMBER#${memberUuid}`,
      sk: profileSortKey
    }
  } as DeleteCommandInput;

  await dynamodb.send(new DeleteCommand(queryParams));
}

export async function deleteCardItemFromIdentityTableFor(
  memberUuid: string,
  cardId: number
): Promise<void> {
  const dynamodb = createDynamoDbClient();
  const queryParams = {
    TableName: `${process.env.E2E_IDENTITY_TABLE_NAME}`,
    Key: {
      pk: `MEMBER#${memberUuid}`,
      sk: `CARD#${cardId}`
    }
  } as DeleteCommandInput;

  await dynamodb.send(new DeleteCommand(queryParams));
}

export async function deleteItemsFromIdentityTableFor(
  memberUuid: string,
  brand: string,
  cardId: number,
  profileUuid: string
): Promise<void> {
  const dynamodb = createDynamoDbClient();
  const sortKeys = [`BRAND#${brand}`, `CARD#${cardId}`, `PROFILE#${profileUuid}`];
  for (const sortKey of sortKeys) {
    const queryParams = {
      TableName: `${process.env.E2E_IDENTITY_TABLE_NAME}`,
      Key: {
        pk: `MEMBER#${memberUuid}`,
        sk: sortKey
      }
    } as DeleteCommandInput;

    await dynamodb.send(new DeleteCommand(queryParams));
  }
}

export async function deleteItemFromIdMappingTableFor(
  memberUuid: string,
  brand: string,
  legacyId: number
): Promise<void> {
  const dynamodb = createDynamoDbClient();
  const queryParams = {
    TableName: `${process.env.E2E_ID_MAPPING_TABLE_NAME}`,
    Key: {
      legacy_id: `BRAND#${brand}#${legacyId}`,
      uuid: memberUuid
    }
  } as DeleteCommandInput;

  await dynamodb.send(new DeleteCommand(queryParams));
}

function createDynamoDbClient(): DynamoDBDocumentClient {
  const client = new DynamoDBClient({ region: process.env.E2E_AWS_REGION });
  return DynamoDBDocumentClient.from(client);
}