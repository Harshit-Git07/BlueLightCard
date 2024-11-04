import { getEnv } from '@blc-mono/core/utils/getEnv';
import { OFFER_PREFIX } from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { GSI1_NAME, GSI2_NAME } from '../constants/DynamoDBConstants';
import { OfferEntity, OfferKeyBuilders } from '../schemas/OfferEntity';

export class OfferRepository {
  private readonly tableName: string;
  constructor() {
    this.tableName = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME);
  }

  async insert(offerEntity: OfferEntity): Promise<void> {
    await DynamoDBService.put({
      Item: offerEntity,
      TableName: this.tableName,
    });
  }

  async batchInsert(offerEntities: OfferEntity[]): Promise<void> {
    await DynamoDBService.batchInsert(offerEntities, this.tableName);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await DynamoDBService.delete({
      Key: {
        partitionKey: OfferKeyBuilders.buildPartitionKey(id),
        sortKey: OfferKeyBuilders.buildSortKey(companyId),
      },
      TableName: this.tableName,
    });
  }

  async retrieveById(id: string, companyId: string): Promise<OfferEntity | undefined> {
    const result = await DynamoDBService.get({
      Key: {
        partitionKey: OfferKeyBuilders.buildPartitionKey(id),
        sortKey: OfferKeyBuilders.buildSortKey(companyId),
      },
      TableName: this.tableName,
    });
    return result as OfferEntity;
  }

  async getNonLocal(): Promise<OfferEntity[] | undefined> {
    const results = await DynamoDBService.query({
      IndexName: GSI1_NAME,
      KeyConditionExpression: 'gsi1PartitionKey = :local_value',
      ExpressionAttributeValues: { ':local_value': OfferKeyBuilders.buildGsi1PartitionKey(false) },
      TableName: this.tableName,
    });
    return results as OfferEntity[];
  }

  async retrieveByCompanyId(companyId: string): Promise<OfferEntity[] | undefined> {
    const results = await DynamoDBService.query({
      IndexName: GSI2_NAME,
      KeyConditionExpression: 'gsi2PartitionKey = :company_id and begins_with(gsi2SortKey, :offer_prefix)',
      ExpressionAttributeValues: {
        ':company_id': OfferKeyBuilders.buildGsi2PartitionKey(companyId),
        ':offer_prefix': OFFER_PREFIX,
      },
      TableName: this.tableName,
    });
    return results as OfferEntity[];
  }

  async retrieveByIds(offerIds: { id: string; companyId: string }[]): Promise<OfferEntity[]> {
    const keys = offerIds.map(({ id, companyId }) => ({
      partitionKey: OfferKeyBuilders.buildPartitionKey(id),
      sortKey: OfferKeyBuilders.buildSortKey(companyId),
    }));
    const results = await DynamoDBService.batchGet(keys, this.tableName);
    return results ? (results as OfferEntity[]) : [];
  }
}
