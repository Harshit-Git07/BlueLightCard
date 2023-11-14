import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  BatchWriteCommand,
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
  PutCommand,
  GetCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';

export class DbHelper {
  private static client = new DynamoDBClient({});
  private static dynamodb = DynamoDBDocumentClient.from(this.client);

  static async query(params: any) {
    return await this.dynamodb.send(new QueryCommand(params));
  }
  static async batchGet(params: any) {
    return await this.dynamodb.send(new BatchGetCommand(params));
  }

  static async get(params: any) {
    return await this.dynamodb.send(new GetCommand(params));
  }

  static async save(params: any) {
    return await this.dynamodb.send(new PutCommand(params));
  }

  static async transactionalWrite(params: any) {
    return await this.dynamodb.send(new TransactWriteCommand(params));
  }

  static async update(params: any) {
    return await this.dynamodb.send(new UpdateCommand(params));
  }

  static async batchWrite(params: any) {
    return await this.dynamodb.send(new BatchWriteCommand(params));
  }
}
