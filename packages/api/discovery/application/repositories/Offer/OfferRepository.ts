import { getEnv } from '@blc-mono/core/utils/getEnv';
import { OFFER_PREFIX } from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { OfferEntity, OfferKeyBuilders } from '../schemas/OfferEntity';

const GSI1_NAME = 'gsi1';
const GSI2_NAME = 'gsi2';

export class OfferRepository {
  private dynamoDb: DynamoDBService;
  constructor() {
    this.dynamoDb = new DynamoDBService();
  }

  async insert(offerEntity: OfferEntity): Promise<OfferEntity | undefined> {
    return (await this.dynamoDb.put({
      Item: offerEntity,
      TableName: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME),
    })) as OfferEntity;
  }

  async delete(id: string, companyId: string): Promise<OfferEntity | undefined> {
    return (await this.dynamoDb.delete({
      Key: {
        partitionKey: OfferKeyBuilders.buildPartitionKey(id),
        sortKey: OfferKeyBuilders.buildSortKey(companyId),
      },
      TableName: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME),
    })) as OfferEntity;
  }

  async retrieveById(id: string, companyId: string): Promise<OfferEntity | undefined> {
    return (await this.dynamoDb.get({
      Key: {
        partitionKey: OfferKeyBuilders.buildPartitionKey(id),
        sortKey: OfferKeyBuilders.buildSortKey(companyId),
      },
      TableName: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME),
    })) as OfferEntity;
  }

  async getNonLocal(): Promise<OfferEntity[] | undefined> {
    return (await this.dynamoDb.query({
      IndexName: GSI1_NAME,
      KeyConditionExpression: 'gsi1PartitionKey = :local_value',
      ExpressionAttributeValues: { ':local_value': OfferKeyBuilders.buildGsi1PartitionKey(false) },
      TableName: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME),
    })) as OfferEntity[];
  }

  async retrieveByCompanyId(companyId: string): Promise<OfferEntity[] | undefined> {
    return (await this.dynamoDb.query({
      IndexName: GSI2_NAME,
      KeyConditionExpression: 'gsi2PartitionKey = :company_id and begins_with(gsi2SortKey, :offer_prefix)',
      ExpressionAttributeValues: {
        ':company_id': OfferKeyBuilders.buildGsi2PartitionKey(companyId),
        ':offer_prefix': OFFER_PREFIX,
      },
      TableName: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME),
    })) as OfferEntity[];
  }
}
