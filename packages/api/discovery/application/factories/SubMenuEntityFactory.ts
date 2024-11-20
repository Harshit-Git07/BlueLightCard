import * as Factory from 'factory.ts';

import { SubMenuEntity, SubMenuKeyBuilders } from '../repositories/schemas/SubMenuEntity';

import { subMenuFactory } from './SubMenuFactory';

export const subMenuEntityFactory: Factory.Sync.Factory<SubMenuEntity> = Factory.Sync.makeFactory({
  partitionKey: Factory.each((i) => SubMenuKeyBuilders.buildPartitionKey((i + 1).toString())),
  sortKey: Factory.each((i) => SubMenuKeyBuilders.buildSortKey((i + 1).toString())),
  gsi1PartitionKey: Factory.each((i) => SubMenuKeyBuilders.buildGsi1PartitionKey((i + 1).toString())),
  gsi1SortKey: Factory.each((i) => SubMenuKeyBuilders.buildGsi1SortKey((i + 1).toString())),
  gsi2PartitionKey: Factory.each((i) => SubMenuKeyBuilders.buildGsi2PartitionKey((i + 1).toString())),
  gsi2SortKey: Factory.each((i) => SubMenuKeyBuilders.buildGsi2SortKey((i + 1).toString())),
}).combine(subMenuFactory);
