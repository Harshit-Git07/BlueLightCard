import { DynamoDB } from 'aws-sdk';

import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../types/reusableCrudQueryPayload';

export class ReusableCrudRepository<T1 extends NamedZodType<z.ZodEffects<z.ZodObject<any>>>, T2> {
  constructor(
    private readonly dynamoDB: DynamoDB.DocumentClient,
    private readonly tableName: string,
    private readonly zodType: T1,
    private readonly pkPrefix: string,
    private readonly skPrefix: string,
  ) {}

  async get(query: ReusableCrudQueryPayload): Promise<T1[] | null> {
    const queryParams: DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `${this.pkPrefix}#${query.pk}`,
      },
    };

    queryParams.ExpressionAttributeNames!['#sk'] = 'sk';

    if (query.sk) {
      queryParams.KeyConditionExpression += ' AND #sk = :sk';
      queryParams.ExpressionAttributeValues![':sk'] = `${this.skPrefix}#${query.sk}`;
    } else {
      queryParams.KeyConditionExpression += ' AND begins_with(#sk, :skPrefix)';
      queryParams.ExpressionAttributeValues![':skPrefix'] = `${this.skPrefix}#`;
    }

    const queryResult = await this.dynamoDB.query(queryParams).promise();

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }

    // Parse each item against the Zod schema and transform it
    const validatedItems = queryResult.Items.map((item) => {
      const transformedItem = Object.keys(item).reduce((acc, key) => {
        const lowerCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
        if (this.zodType._def.schema._def.shape().hasOwnProperty(lowerCaseKey)) {
          acc[lowerCaseKey] = item[key];
        }
        return acc;
      }, {} as { [key: string]: any });
      return this.zodType.parse(transformedItem) as T1;
    });

    return validatedItems as T1[];
  }

  async upsert(
    query: ReusableCrudQueryPayload,
    payload: T2,
    isInsert: boolean = false,
  ): Promise<void> {
    this.zodType.parse({
      pk: `${this.pkPrefix}#${query.pk}`,
      sk: `${this.skPrefix}#${query.sk}`,
      ...payload,
    });

    const updateExpression: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const field of Object.keys(payload as object) as (keyof T2)[]) {
      if (payload[field] !== undefined) {
        const fieldStr = String(field);
        const capitalizedField = fieldStr.charAt(0).toUpperCase() + fieldStr.slice(1);
        updateExpression.push(`${capitalizedField} = :${fieldStr}`);
        expressionAttributeValues[`:${fieldStr}`] = payload[field];
      }
    }

    const updateParams = {
      TableName: this.tableName,
      Key: {
        pk: `${this.pkPrefix}#${query.pk}`,
        sk: `${this.skPrefix}#${query.sk}`,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')} `,
      ConditionExpression: isInsert ? 'pk <> :pk OR sk <> :sk' : 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':pk': `${this.pkPrefix}#${query.pk}`,
        ':sk': `${this.skPrefix}#${query.sk}`,
      },
    };

    await this.dynamoDB.update(updateParams).promise();
  }
}
