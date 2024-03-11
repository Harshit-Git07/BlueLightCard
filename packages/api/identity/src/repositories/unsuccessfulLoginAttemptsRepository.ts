import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export class UnsuccessfulLoginAttemptsRepository {

  dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  constructor (private readonly tableName: string) {
    this.tableName = tableName;
  }

  async checkIfRecordExists(email: string, userPoolId: string) {

    const params = {
      ExpressionAttributeValues: {
          ":email": email,
           ":userPoolId": userPoolId
       },
       ExpressionAttributeNames: {
          "#email": "email",
          "#userPoolId": "userPoolId"
      },
      TableName: this.tableName,
      KeyConditionExpression: "#email = :email and #userPoolId = :userPoolId",
      IndexName: 'gsi1',
    }

    try {
      return (await this.dynamodb.send(new QueryCommand(params))).Items;    
    } catch (error) {
      throw new Error("Unable to check record in database: " + error);
    }
  }

  async addOrUpdateRecord(email: string, userPoolId: string, count: number) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
          email: email,
          userPoolId: userPoolId,
          count: count,
          timestamp: Date.now(),
      },
    });
    try {
      return await this.dynamodb.send(command);    
    } catch (error) {
      throw new Error("Unable to check add/update record in database: " + error);
    }
  }

  async deleteRecord(email: string, userPoolId: string) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
          email: email,
          userPoolId: userPoolId
      },
    });
    try {
      return await this.dynamodb.send(command);    
    } catch (error) {
      throw new Error("Unable to check add/update record in database: " + error);
    }
  }

}
