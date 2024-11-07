import { MemberProfileUpdatePayload, MemberProfileQueryPayload } from '../types/memberProfileTypes';
import { MemberProfileModel } from '../models/memberProfileModel';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

export class MemberProfileRepository {
  private readonly dynamoDBDocClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(dynamoDBDocClient: DynamoDBDocumentClient, tableName: string) {
    this.dynamoDBDocClient = dynamoDBDocClient;
    this.tableName = tableName;
  }

  async getMemberProfiles(query: MemberProfileQueryPayload): Promise<MemberProfileModel[] | null> {
    const queryParams: QueryCommandInput = {
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

    if (query.profileId) {
      queryParams.KeyConditionExpression += ' AND #sk = :sk';
      queryParams.ExpressionAttributeValues![':sk'] = `PROFILE#${query.profileId}`;
    } else {
      queryParams.KeyConditionExpression += ' AND begins_with(#sk, :skPrefix)';
      queryParams.ExpressionAttributeValues![':skPrefix'] = 'PROFILE#';
    }

    const queryResult = await this.dynamoDBDocClient.send(new QueryCommand(queryParams));

    if (!queryResult.Items || queryResult.Items.length === 0) {
      return null;
    }

    // Parse each item against the Zod schema and transform it
    const validatedItems = queryResult.Items.map((item) => {
      return MemberProfileModel.parse(item);
    });

    return validatedItems;
  }

  async upsertMemberProfile(
    query: MemberProfileQueryPayload,
    payload: MemberProfileUpdatePayload,
    isInsert: boolean = false,
  ): Promise<void> {
    MemberProfileModel.parse({
      pk: `MEMBER#${query.memberUUID}`,
      sk: `PROFILE#${query.profileId}`,
      ...payload,
    });

    const updateExpression: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};

    for (const field of Object.keys(payload) as (keyof MemberProfileUpdatePayload)[]) {
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
