import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocument.from(new DynamoDBClient({}));

export function createDbConnection() {
  return client;
}
