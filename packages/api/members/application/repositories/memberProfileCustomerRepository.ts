import {
  MemberProfileCustomerUpdatePayload,
  MemberProfileCustomerQueryPayload,
} from '../types/memberProfileCustomerTypes';
import { MemberProfileCustomerModel } from '../models/memberProfileCustomerModel';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

export class MemberProfileCustomerRepository {
  private readonly dynamoDBDocClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(dynamoDBDocClient: DynamoDBDocumentClient, tableName: string) {
    this.dynamoDBDocClient = dynamoDBDocClient;
    this.tableName = tableName;
  }

  async upsertMemberProfileCustomer(
    query: MemberProfileCustomerQueryPayload,
    payload: MemberProfileCustomerUpdatePayload,
    isInsert: boolean = false,
  ): Promise<void> {
    MemberProfileCustomerModel.parse({
      pk: `MEMBER#${query.memberUUID}`,
      sk: `PROFILE#${query.profileId}`,
      ...payload,
    });

    const updateExpression: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const field of Object.keys(payload) as (keyof MemberProfileCustomerUpdatePayload)[]) {
      if (payload[field] !== undefined) {
        updateExpression.push(`${field} = :${field}`);
        expressionAttributeValues[`:${field}`] = payload[field];
      }
    }

    const updateParams = {
      TableName: this.tableName,
      Key: {
        pk: `MEMBER#${query.memberUUID}`,
        sk: `PROFILE#${query.profileId}`,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ConditionExpression: isInsert ? 'pk <> :pk OR sk <> :sk' : 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':pk': `MEMBER#${query.memberUUID}`,
        ':sk': `PROFILE#${query.profileId}`,
      },
    };

    await this.dynamoDBDocClient.send(new UpdateCommand(updateParams));
  }
}
