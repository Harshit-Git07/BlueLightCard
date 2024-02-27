import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export class UnsuccessfulLoginAttemptsRepository {

  dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  constructor (private readonly tableName: string) {
    this.tableName = tableName;
  }

  async checkIfRecordExists(params: any) {
    console.log(params);
    try {
      return (await this.dynamodb.send(new QueryCommand(params))).Items;    
    } catch (error) {
      throw new Error("Unable to check record in database: " + error);
    }
  }

  async addOrUpdateRecord(command: PutCommand) {
    return await this.dynamodb.send(command);
  }

  async deleteRecord(command: DeleteCommand) {
    return await this.dynamodb.send(command);
  }

}
