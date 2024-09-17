import * as Factory from 'factory.ts';

import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { OfferEntity, OfferKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/OfferEntity';

export const offerEntityFactory = Factory.Sync.makeFactory<OfferEntity>({
  ...offerFactory.build(),
  partitionKey: Factory.each((i) => OfferKeyBuilders.buildPartitionKey((i + 1).toString())),
  sortKey: Factory.each((i) => OfferKeyBuilders.buildSortKey((i + 1).toString())),
  gsi1PartitionKey: OfferKeyBuilders.buildGsi1PartitionKey(false),
  gsi1SortKey: OfferKeyBuilders.buildGsi1SortKey(false),
  gsi2PartitionKey: Factory.each((i) => OfferKeyBuilders.buildGsi2PartitionKey((i + 1).toString())),
  gsi2SortKey: Factory.each((i) => OfferKeyBuilders.buildGsi2SortKey((i + 1).toString())),
});
