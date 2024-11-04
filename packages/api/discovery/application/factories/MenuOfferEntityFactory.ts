import * as Factory from 'factory.ts';

import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';

import { MenuOfferEntity, MenuOfferKeyBuilders } from '../repositories/schemas/MenuOfferEntity';

export const menuOfferEntityFactory: Factory.Sync.Factory<MenuOfferEntity> = Factory.Sync.makeFactory({
  partitionKey: Factory.each((i) => MenuOfferKeyBuilders.buildPartitionKey((i + 1).toString())),
  sortKey: Factory.each((i) => MenuOfferKeyBuilders.buildSortKey((i + 1).toString())),
  gsi1PartitionKey: Factory.each((i) => MenuOfferKeyBuilders.buildGsi1PartitionKey((i + 1).toString())),
  gsi1SortKey: Factory.each((i) => MenuOfferKeyBuilders.buildGsi1SortKey((i + 1).toString())),
  gsi2PartitionKey: Factory.each((i) => MenuOfferKeyBuilders.buildGsi2PartitionKey((i + 1).toString())),
  gsi2SortKey: Factory.each((i) => MenuOfferKeyBuilders.buildGsi2SortKey((i + 1).toString())),
}).combine(offerFactory);
