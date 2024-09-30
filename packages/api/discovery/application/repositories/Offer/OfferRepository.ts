import { getEnv } from '@blc-mono/core/utils/getEnv';
import { OFFER_PREFIX } from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { OfferEntity, OfferKeyBuilders } from '../schemas/OfferEntity';

const GSI1_NAME = 'gsi1';
const GSI2_NAME = 'gsi2';

export class OfferRepository {
  private readonly dynamoDb: DynamoDBService;
  private readonly tableName: string;
  constructor() {
    this.dynamoDb = new DynamoDBService();
    this.tableName = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME);
  }

  async insert(offerEntity: OfferEntity): Promise<OfferEntity | undefined> {
    return (await this.dynamoDb.put({
      Item: offerEntity,
      TableName: this.tableName,
    })) as OfferEntity;
  }

  async batchInsert(offerEntities: OfferEntity[]): Promise<void> {
    const DYNAMODB_MAX_BATCH_SIZE = 25;
    for (let i = 0; i < offerEntities.length; i += DYNAMODB_MAX_BATCH_SIZE) {
      const chunk = offerEntities.slice(i, i + DYNAMODB_MAX_BATCH_SIZE);
      await this.dynamoDb.batchWrite({
        RequestItems: {
          [this.tableName]: chunk.map((offerEntity) => ({
            PutRequest: {
              Item: offerEntity,
            },
          })),
        },
      });
    }
  }

  async delete(id: string, companyId: string): Promise<OfferEntity | undefined> {
    return (await this.dynamoDb.delete({
      Key: {
        partitionKey: OfferKeyBuilders.buildPartitionKey(id),
        sortKey: OfferKeyBuilders.buildSortKey(companyId),
      },
      TableName: this.tableName,
    })) as OfferEntity;
  }

  async retrieveById(id: string, companyId: string): Promise<OfferEntity | undefined> {
    return (await this.dynamoDb.get({
      Key: {
        partitionKey: OfferKeyBuilders.buildPartitionKey(id),
        sortKey: OfferKeyBuilders.buildSortKey(companyId),
      },
      TableName: this.tableName,
    })) as OfferEntity;
  }

  async getNonLocal(): Promise<OfferEntity[] | undefined> {
    return (await this.dynamoDb.query({
      IndexName: GSI1_NAME,
      KeyConditionExpression: 'gsi1PartitionKey = :local_value',
      ExpressionAttributeValues: { ':local_value': OfferKeyBuilders.buildGsi1PartitionKey(false) },
      TableName: this.tableName,
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
      TableName: this.tableName,
    })) as OfferEntity[];
  }
}
