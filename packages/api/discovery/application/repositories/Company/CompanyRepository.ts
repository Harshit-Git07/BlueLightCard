import { getEnv } from '@blc-mono/core/utils/getEnv';
import { CompanyEntity, CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

export class CompanyRepository {
  private dynamoDb: DynamoDBService;
  constructor() {
    this.dynamoDb = new DynamoDBService();
  }

  async insert(companyEntity: CompanyEntity): Promise<CompanyEntity | undefined> {
    return (await this.dynamoDb.put({
      Item: companyEntity,
      TableName: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME),
    })) as CompanyEntity;
  }

  async retrieveById(id: string): Promise<CompanyEntity | undefined> {
    return (await this.dynamoDb.get({
      Key: {
        partitionKey: CompanyKeyBuilders.buildPartitionKey(id),
        sortKey: CompanyKeyBuilders.buildSortKey(id),
      },
      TableName: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME),
    })) as CompanyEntity;
  }
}
