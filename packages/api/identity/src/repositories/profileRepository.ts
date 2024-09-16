import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';

export interface IProfileRepository {
  findByUuid(uuid: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
}

export class ProfileRepository implements IProfileRepository {
  private tableName: string = getEnv('IDENTITY_TABLE_NAME');
  private dynamodb: DynamoDBDocumentClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: getEnvOrDefault('REGION', 'eu-west-2') }),
  );

  public async findByUuid(uuid: string) {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk And begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `MEMBER#${uuid}`,
        ':sk': 'PROFILE#',
      },
    };
    return await this.dynamodb.send(new QueryCommand(params));
  }

  public async findByEmail(email: string) {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: 'gsi3',
      KeyConditionExpression: '#pk = :pk And begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#pk': 'email',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `${email}`,
        ':sk': 'PROFILE#',
      },
    };
    return await this.dynamodb.send(new QueryCommand(params));
  }
}
