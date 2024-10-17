import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

const logger = new LambdaLogger({ serviceName: 'dynamoDB' });

export class DynamoDBService {
  private static readonly client: DynamoDBClient = new DynamoDBClient({ region: getEnvRaw('AWS_DEFAULT_REGION') });
  private static readonly dynamodb: DynamoDBDocumentClient = DynamoDBDocumentClient.from(this.client, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });

  static async put(params: PutCommandInput): Promise<Record<string, NativeAttributeValue> | undefined> {
    try {
      const data = await this.dynamodb.send(new PutCommand(params));
      return data.Attributes;
    } catch (error) {
      const message = 'Error trying to put record using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  static async batchWrite(params: BatchWriteCommandInput): Promise<void> {
    const maxAttempts = 5;
    const baseDelay = 1000;

    const getBackoffDelayWithJitter = (attempt: number): number => {
      const delay = baseDelay * Math.pow(2, attempt);

      return delay + Math.random() * delay;
    };

    try {
      let data: BatchWriteCommandOutput;
      data = await this.dynamodb.send(new BatchWriteCommand(params));

      let attempt = 0;

      while (data.UnprocessedItems && Object.keys(data.UnprocessedItems).length > 0 && attempt < maxAttempts) {
        attempt++;
        const delay = getBackoffDelayWithJitter(attempt);

        logger.info({ message: `Unprocessed items found, retrying batch write. Attempt number: [${attempt}]` });

        await new Promise((resolve) => setTimeout(resolve, delay));

        data = await this.dynamodb.send(
          new BatchWriteCommand({
            ...params,
            RequestItems: data.UnprocessedItems,
          }),
        );
      }
    } catch (error) {
      const message = 'Error trying to batch write records using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  static async delete(params: DeleteCommandInput): Promise<Record<string, NativeAttributeValue> | undefined> {
    try {
      const data = await this.dynamodb.send(new DeleteCommand(params));
      return data.Attributes;
    } catch (error) {
      const message = 'Error trying to delete record using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  static async get(params: GetCommandInput): Promise<Record<string, NativeAttributeValue> | undefined> {
    try {
      const data = await this.dynamodb.send(new GetCommand(params));
      return data.Item;
    } catch (error) {
      const message = 'Error trying to get record using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  static async query(params: QueryCommandInput): Promise<Record<string, NativeAttributeValue>[] | undefined> {
    try {
      const data = await this.dynamodb.send(new QueryCommand(params));
      return data.Items;
    } catch (error) {
      const message = 'Error trying to query records using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }
}
