import * as Factory from 'factory.ts';

import { eventFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { EventEntity, EventKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/OfferEntity';

export const eventEntityFactory: Factory.Sync.Factory<EventEntity> = Factory.Sync.makeFactory({
  partitionKey: Factory.each((i) => EventKeyBuilders.buildPartitionKey((i + 1).toString())),
  sortKey: Factory.each((i) => EventKeyBuilders.buildSortKey((i + 1).toString())),
  gsi1PartitionKey: EventKeyBuilders.buildGsi1PartitionKey(),
  gsi1SortKey: Factory.each((i) => EventKeyBuilders.buildGsi1SortKey((i + 1).toString())),
  gsi2PartitionKey: Factory.each((i) => EventKeyBuilders.buildGsi2PartitionKey((i + 1).toString())),
  gsi2SortKey: Factory.each((i) => EventKeyBuilders.buildGsi2SortKey((i + 1).toString())),
}).combine(eventFactory);
