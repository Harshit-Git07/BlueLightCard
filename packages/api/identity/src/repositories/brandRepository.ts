import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

export class BrandRepository {
  private tableName: string;
  private dynamodb;

  constructor(readonly table: string, readonly regionName: string) {
    this.tableName = table;
    this.dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: regionName }));
  }

  async findItemsByUuid(uuid: string) {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `MEMBER#${uuid}`,
      },
    };
    return await this.dynamodb.send(new QueryCommand(params));
  }
}
