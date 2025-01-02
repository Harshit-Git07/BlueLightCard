import * as Factory from 'factory.ts';

import { eventFactory } from '@blc-mono/discovery/application/factories/OfferFactory';

import { MenuEventEntity, MenuEventKeyBuilders } from '../repositories/schemas/MenuOfferEntity';

export const menuEventEntityFactory = Factory.Sync.makeFactory<MenuEventEntity>({
  partitionKey: Factory.each((i) => MenuEventKeyBuilders.buildPartitionKey((i + 1).toString())),
  sortKey: Factory.each((i) => MenuEventKeyBuilders.buildSortKey((i + 1).toString())),
  gsi1PartitionKey: Factory.each((i) => MenuEventKeyBuilders.buildGsi1PartitionKey((i + 1).toString())),
  gsi1SortKey: Factory.each((i) => MenuEventKeyBuilders.buildGsi1SortKey((i + 1).toString())),
  gsi2PartitionKey: Factory.each((i) => MenuEventKeyBuilders.buildGsi2PartitionKey((i + 1).toString())),
  gsi2SortKey: Factory.each((i) => MenuEventKeyBuilders.buildGsi2SortKey((i + 1).toString())),
  gsi3PartitionKey: Factory.each((i) => MenuEventKeyBuilders.buildGsi3PartitionKey((i + 1).toString())),
  gsi3SortKey: Factory.each((i) => MenuEventKeyBuilders.buildGsi3SortKey((i + 1).toString())),
  ...eventFactory.build(),
});
