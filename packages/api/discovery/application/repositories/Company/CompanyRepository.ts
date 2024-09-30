import { getEnv } from '@blc-mono/core/utils/getEnv';
import { CompanyEntity, CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

export class CompanyRepository {
  private readonly dynamoDb: DynamoDBService;
  private readonly tableName: string;
  constructor() {
    this.dynamoDb = new DynamoDBService();
    this.tableName = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME);
  }

  async insert(companyEntity: CompanyEntity): Promise<CompanyEntity | undefined> {
    return (await this.dynamoDb.put({
      Item: companyEntity,
      TableName: this.tableName,
    })) as CompanyEntity;
  }

  async retrieveById(id: string): Promise<CompanyEntity | undefined> {
    return (await this.dynamoDb.get({
      Key: {
        partitionKey: CompanyKeyBuilders.buildPartitionKey(id),
        sortKey: CompanyKeyBuilders.buildSortKey(id),
      },
      TableName: this.tableName,
    })) as CompanyEntity;
  }
}
