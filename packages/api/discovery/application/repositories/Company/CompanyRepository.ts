import { getEnv } from '@blc-mono/core/utils/getEnv';
import { CompanyEntity, CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

export class CompanyRepository {
  private readonly tableName: string;
  constructor() {
    this.tableName = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME);
  }

  async insert(companyEntity: CompanyEntity): Promise<void> {
    await DynamoDBService.put({
      Item: companyEntity,
      TableName: this.tableName,
    });
  }

  async retrieveById(id: string): Promise<CompanyEntity | undefined> {
    return (await DynamoDBService.get({
      Key: {
        partitionKey: CompanyKeyBuilders.buildPartitionKey(id),
        sortKey: CompanyKeyBuilders.buildSortKey(id),
      },
      TableName: this.tableName,
    })) as CompanyEntity;
  }
}
