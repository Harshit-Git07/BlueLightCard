import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
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
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

import {
  DYNAMODB_MAX_BATCH_GET_SIZE,
  DYNAMODB_MAX_BATCH_WRITE_SIZE,
  MAX_BASE_DELAY,
  MAX_BATCH_RETRY_ATTEMPTS,
} from '../repositories/constants/DynamoDBConstants';

const logger = new LambdaLogger({ serviceName: 'dynamoDB' });

const getBackoffDelayWithJitter = (attempt: number): number => {
  const delay = MAX_BASE_DELAY * Math.pow(2, attempt);

  return delay + Math.random() * delay;
};

export class DynamoDBService {
  private static readonly client: DynamoDBClient = new DynamoDBClient({ region: getEnvRaw('AWS_DEFAULT_REGION') });
  private static readonly dynamodb: DynamoDBDocumentClient = DynamoDBDocumentClient.from(this.client, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });

  private static readonly callWithPagination = async (
    command: (lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined) => QueryCommand | ScanCommand,
  ) => {
    let items: Record<string, NativeAttributeValue>[] = [];
    let lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined = undefined;
    do {
      const data: ScanCommandOutput | QueryCommandOutput = await DynamoDBService.dynamodb.send(
        command(lastEvaluatedKey),
      );

      if (data.Items) {
        items = items.concat(data.Items);
      }

      lastEvaluatedKey = data.LastEvaluatedKey;
    } while (lastEvaluatedKey);
    return items;
  };

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

  static async scan(params: ScanCommandInput): Promise<Record<string, NativeAttributeValue>[] | undefined> {
    try {
      const CreatedScanCommand = (lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined) =>
        new ScanCommand({ ...params, ExclusiveStartKey: lastEvaluatedKey });
      return await this.callWithPagination(CreatedScanCommand);
    } catch (error) {
      const message = 'Error trying to scan record using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  private static async batchWrite(params: BatchWriteCommandInput): Promise<void> {
    try {
      let data: BatchWriteCommandOutput;
      data = await this.dynamodb.send(new BatchWriteCommand(params));

      let attempt = 0;

      while (
        data.UnprocessedItems &&
        Object.keys(data.UnprocessedItems).length > 0 &&
        attempt < MAX_BATCH_RETRY_ATTEMPTS
      ) {
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

  private static async executeBatchGet(
    keys: { partitionKey: string; sortKey: string }[],
    tableName: string,
  ): Promise<Record<string, NativeAttributeValue>[] | undefined> {
    const params: BatchGetCommandInput = {
      RequestItems: {
        [tableName]: {
          Keys: keys,
        },
      },
    };
    const itemsToReturn = [];
    try {
      let data: BatchGetCommandOutput;
      data = await this.dynamodb.send(new BatchGetCommand(params));
      let attempt = 0;
      if (data?.Responses?.[tableName]) {
        itemsToReturn.push(...data.Responses[tableName]);
      }
      while (
        data.UnprocessedKeys &&
        Object.keys(data.UnprocessedKeys).length > 0 &&
        attempt < MAX_BATCH_RETRY_ATTEMPTS
      ) {
        attempt++;
        const delay = getBackoffDelayWithJitter(attempt);

        logger.info({ message: `Unprocessed items found, retrying batch write. Attempt number: [${attempt}]` });

        await new Promise((resolve) => setTimeout(resolve, delay));

        data = await this.dynamodb.send(
          new BatchGetCommand({
            ...params,
            RequestItems: data.UnprocessedKeys,
          }),
        );
        if (data?.Responses?.[tableName]) {
          itemsToReturn.push(...data.Responses[tableName]);
        }
      }
      return itemsToReturn;
    } catch (error) {
      const message = 'Error trying to batch get records using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  static async batchGet(
    items: { partitionKey: string; sortKey: string }[],
    tableName: string,
  ): Promise<Record<string, NativeAttributeValue>[] | undefined> {
    const itemsToGet = [];
    for (let i = 0; i < items.length; i += DYNAMODB_MAX_BATCH_GET_SIZE) {
      const chunk = items.slice(i, i + DYNAMODB_MAX_BATCH_GET_SIZE);
      const retrievedItems = await this.executeBatchGet(chunk, tableName);
      if (retrievedItems) {
        itemsToGet.push(...retrievedItems);
      }
    }
    return itemsToGet;
  }

  static async batchInsert<T>(items: Record<string, T>[], tableName: string): Promise<void> {
    for (let i = 0; i < items.length; i += DYNAMODB_MAX_BATCH_WRITE_SIZE) {
      const chunk = items.slice(i, i + DYNAMODB_MAX_BATCH_WRITE_SIZE);
      await this.batchWrite({
        RequestItems: {
          [tableName]: chunk.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      });
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

  static async batchDelete(items: { partitionKey: string; sortKey: string }[], tableName: string): Promise<void> {
    for (let i = 0; i < items.length; i += DYNAMODB_MAX_BATCH_WRITE_SIZE) {
      const chunk = items.slice(i, i + DYNAMODB_MAX_BATCH_WRITE_SIZE);
      await DynamoDBService.batchWrite({
        RequestItems: {
          [tableName]: chunk.map((item) => ({
            DeleteRequest: {
              Key: {
                partitionKey: item.partitionKey,
                sortKey: item.sortKey,
              },
            },
          })),
        },
      });
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
      const CreatedQueryCommand = (lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined) =>
        new QueryCommand({ ...params, ExclusiveStartKey: lastEvaluatedKey });
      return await this.callWithPagination(CreatedQueryCommand);
    } catch (error) {
      const message = 'Error trying to query records using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }
}
