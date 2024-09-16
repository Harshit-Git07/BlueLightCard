import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';

export interface IIdMappingRepository {
  findByLegacyId(brand: string, legacyId: string): Promise<any>;
}

export class IdMappingRepository implements IIdMappingRepository {
  private tableName: string = getEnv('ID_MAPPING_TABLE_NAME');
  private dynamodb: DynamoDBDocumentClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: getEnvOrDefault('REGION', 'eu-west-2') }),
  );

  public async findByLegacyId(brand: string, legacyId: string) {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: '#legacy_id= :legacy_id',
      ExpressionAttributeValues: {
        ':legacy_id': `BRAND#${brand}#${legacyId}`,
      },
      ExpressionAttributeNames: {
        '#legacy_id': 'legacy_id',
      },
    };
    return await this.dynamodb.send(new QueryCommand(queryParams));
  }
}
