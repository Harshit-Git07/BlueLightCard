import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const defaultDynamoDbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-2' }),
  {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  },
);
