import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
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

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

const logger = new LambdaLogger({ serviceName: 'dynamoDB' });

export class DynamoDBService {
  private client: DynamoDBClient;
  private dynamodb: DynamoDBDocumentClient;

  constructor() {
    const region = getEnv(DiscoveryStackEnvironmentKeys.REGION);
    this.client = new DynamoDBClient({ region });
    this.dynamodb = DynamoDBDocumentClient.from(this.client);
  }

  async put(params: PutCommandInput): Promise<Record<string, NativeAttributeValue> | undefined> {
    try {
      const data = await this.dynamodb.send(new PutCommand(params));
      return data.Attributes;
    } catch (error) {
      const message = 'Error trying to put record using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  async delete(params: DeleteCommandInput): Promise<Record<string, NativeAttributeValue> | undefined> {
    try {
      const data = await this.dynamodb.send(new DeleteCommand(params));
      return data.Attributes;
    } catch (error) {
      const message = 'Error trying to delete record using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  async get(params: GetCommandInput): Promise<Record<string, NativeAttributeValue> | undefined> {
    try {
      const data = await this.dynamodb.send(new GetCommand(params));
      return data.Item;
    } catch (error) {
      const message = 'Error trying to get record using DynamoDB service';
      logger.error({ message, body: error });
      throw new Error(`${message}: [${error}]`);
    }
  }

  async query(params: QueryCommandInput): Promise<Record<string, NativeAttributeValue>[] | undefined> {
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
