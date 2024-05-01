import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

export interface IProfileRepository {
    findByUuid(uuid: string): Promise<any>;
}

export class ProfileRepository implements IProfileRepository{
    private tableName: string;
    private dynamodb;
  
    constructor(readonly table: string, readonly regionName: string) {
      this.tableName = table;
      this.dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: regionName }));
    }

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
      }
    };
    return await this.dynamodb.send(new QueryCommand(params));
  }
  
}