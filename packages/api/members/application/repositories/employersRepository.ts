import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { EmployersQueryPayload } from '../types/employerTypes';
import { EmployerModel } from '../models/employerModel';

export class EmployersRepository {
  private readonly dynamoDBDocClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(dynamoDB: DynamoDBDocumentClient, tableName: string) {
    this.dynamoDBDocClient = dynamoDB;
    this.tableName = tableName;
  }

  async getEmployers({ organisationId, employerId }: EmployersQueryPayload) {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: employerId
        ? '#pk = :pk AND #sk = :sk'
        : '#pk = :pk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `ORGANISATION#${organisationId}`,
        ':sk': employerId ? `EMPLOYER#${employerId}` : 'EMPLOYER#',
      },
    };
    const queryResult = await this.dynamoDBDocClient.send(new QueryCommand(queryParams));

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return [];
    }

    const validatedItems = queryResult.Items.map((employer) => EmployerModel.parse(employer));

    return validatedItems;
  }
}
