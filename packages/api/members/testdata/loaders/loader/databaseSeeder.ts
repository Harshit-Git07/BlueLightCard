import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/TransactWriteCommand';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';

const dynamoDb = new DynamoDBClient({
  region: 'eu-west-2',
  retryStrategy: new ConfiguredRetryStrategy(5, (attempt) => {
    const minimumDelay = 200;

    const oneSecondInMilliseconds = 1000;
    const additionalDelayPerAttempt = attempt * oneSecondInMilliseconds;

    return minimumDelay + additionalDelayPerAttempt;
  }),
});

export interface DynamoRow {
  pk: string;
  sk: string;
}

export async function seedDynamoTable(tableName: string, data: DynamoRow[]): Promise<void> {
  if (!process.env.SST_STAGE) {
    console.error('Please set SST_STAGE environment variable');
    process.exit(1);
  }

  while (data.length) {
    try {
      const batch = data.splice(0, 25);
      await batchWriteItems(tableName, batch);
    } catch (error) {
      console.log('Batch Write Error:', error);
    }
  }
}

async function batchWriteItems(tableName: string, items: DynamoRow[]): Promise<void> {
  const transactItems: TransactWriteCommandInput['TransactItems'] = items.map((item) => {
    return {
      Put: {
        TableName: tableName,
        Item: item,
      },
    };
  });
  await dynamoDb.send(
    new TransactWriteCommand({
      TransactItems: transactItems,
    }),
  );
}
