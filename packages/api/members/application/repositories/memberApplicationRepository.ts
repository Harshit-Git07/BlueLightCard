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

    queryParams.ExpressionAttributeNames!['#sk'] = 'sk';

    if (query.applicationId) {
      queryParams.KeyConditionExpression += ' AND #sk = :sk';
      queryParams.ExpressionAttributeValues![':sk'] = `APPLICATION#${query.applicationId}`;
    } else {
      queryParams.KeyConditionExpression += ' AND begins_with(#sk, :skPrefix)';
      queryParams.ExpressionAttributeValues![':skPrefix'] = 'APPLICATION#';
    }

    const queryResult = await this.dynamoDB.query(queryParams).promise();

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }

    // Parse each item against the Zod schema and transform it
    const validatedItems = queryResult.Items.map((item) => {
      const transformedItem = Object.keys(item).reduce((acc, key) => {
        const lowerCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
        acc[lowerCaseKey] = item[key];
        return acc;
      }, {} as { [key: string]: any });
      return MemberApplicationModel.parse(transformedItem);
    });

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
        const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
        updateExpression.push(`${capitalizedField} = :${field}`);
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
