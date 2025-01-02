import { getEnv } from '@blc-mono/core/utils/getEnv';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { GSI1_NAME } from '../constants/DynamoDBConstants';
import { EventEntity, EventKeyBuilders } from '../schemas/OfferEntity';

export class EventRepository {
  private readonly tableName: string;
  constructor() {
    this.tableName = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME);
  }

  async insert(entity: EventEntity): Promise<void> {
    await DynamoDBService.put({
      Item: entity,
      TableName: this.tableName,
    });
  }

  async delete(id: string, venueId: string): Promise<void> {
    await DynamoDBService.delete({
      Key: {
        partitionKey: EventKeyBuilders.buildPartitionKey(id),
        sortKey: EventKeyBuilders.buildSortKey(venueId),
      },
      TableName: this.tableName,
    });
  }

  async retrieveById(id: string, venueId: string): Promise<EventEntity | undefined> {
    const result = await DynamoDBService.get({
      Key: {
        partitionKey: EventKeyBuilders.buildPartitionKey(id),
        sortKey: EventKeyBuilders.buildSortKey(venueId),
      },
      TableName: this.tableName,
    });
    return result as EventEntity;
  }

  async retrieveAll(): Promise<EventEntity[]> {
    const results = await DynamoDBService.query({
      IndexName: GSI1_NAME,
      KeyConditionExpression: 'gsi1PartitionKey = :event_value',
      ExpressionAttributeValues: { ':event_value': EventKeyBuilders.buildGsi1PartitionKey() },
      TableName: this.tableName,
    });
    return results as EventEntity[];
  }

  async retrieveByIds(ids: { id: string; venueId: string }[]): Promise<EventEntity[]> {
    const keys = ids.map(({ id, venueId }) => ({
      partitionKey: EventKeyBuilders.buildPartitionKey(id),
      sortKey: EventKeyBuilders.buildSortKey(venueId),
    }));
    const results = await DynamoDBService.batchGet(keys, this.tableName);
    return results ? (results as EventEntity[]) : [];
  }
}
