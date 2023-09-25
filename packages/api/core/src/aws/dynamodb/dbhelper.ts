import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

export class DbHelper {
  private static client = new DynamoDBClient({});
  private static dynamodb = DynamoDBDocumentClient.from(this.client);

  static async query(params: any) {
    return await this.dynamodb.send(new QueryCommand(params));
  }
  static async batchGet(params: any) {
    return await this.dynamodb.send(new BatchGetCommand(params));
  }


}
