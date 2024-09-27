import { DynamoDB } from 'aws-sdk';
import { MemberApplicationModel } from '../models/memberApplicationModel';

import {
  MemberApplicationUpdatePayload,
  MemberApplicationQueryPayload,
} from '../types/memberApplicationTypes';

export class MemberApplicationRepository {
  private dynamoDB: DynamoDB.DocumentClient;
  private tableName: string;

  constructor(dynamoDB: DynamoDB.DocumentClient, tableName: string) {
    this.dynamoDB = dynamoDB;
    this.tableName = tableName;
  }

  async getMemberApplications(
    query: MemberApplicationQueryPayload,
  ): Promise<MemberApplicationModel[] | null> {
    const queryParams: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `MEMBER#${query.memberUUID}`,
      },
    };

    if (query.applicationId) {
      queryParams.KeyConditionExpression += ' AND #sk = :sk';
      queryParams.ExpressionAttributeNames!['#sk'] = 'sk';
      queryParams.ExpressionAttributeValues![':sk'] = `APPLICATION#${query.applicationId}`;
    }

    const queryResult = await this.dynamoDB.query(queryParams).promise();

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }

    // Parse each item against the Zod schema
    const validatedItems = queryResult.Items.map((item) => MemberApplicationModel.parse(item));

    return validatedItems;
  }

  async upsertMemberApplication(
    query: MemberApplicationQueryPayload,
    payload: MemberApplicationUpdatePayload,
    isInsert: boolean = false,
  ): Promise<void> {
    MemberApplicationModel.parse({
      pk: `MEMBER#${query.memberUUID}`,
      sk: `APPLICATION#${query.applicationId}`,
      ...payload,
    });

    const updateExpression: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const field of Object.keys(payload) as (keyof MemberApplicationUpdatePayload)[]) {
      if (payload[field] !== undefined) {
        updateExpression.push(`${field} = :${field}`);
        expressionAttributeValues[`:${field}`] = payload[field];
      }
    }

    const updateParams = {
      TableName: this.tableName,
      Key: {
        pk: `MEMBER#${query.memberUUID}`,
        sk: `APPLICATION#${query.applicationId}`,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ConditionExpression: isInsert ? 'pk <> :pk OR sk <> :sk' : 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':pk': `MEMBER#${query.memberUUID}`,
        ':sk': `APPLICATION#${query.applicationId}`,
      },
    };

    await this.dynamoDB.update(updateParams).promise();
  }
}
