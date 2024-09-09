import * as Factory from 'factory.ts';

import { Marketplace, MarketplaceMenu } from '../models/Marketplace';

export const marketplaceMenuFactory = Factory.Sync.makeFactory<MarketplaceMenu>({
  name: 'Sample Marketplace Menu',
  image: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
  offers: Factory.each((i) => [i, i + 1, i + 2]),
  updatedAt: '2024-09-01T00:00:00',
});

export const marketplaceFactory = Factory.Sync.makeFactory<Marketplace>({
  name: 'Sample Marketplace',
  menus: [marketplaceMenuFactory.build()],
  startTime: '2024-09-01T00:00:00',
  endTime: '2024-09-30T23:59:59',
  updatedAt: '2024-09-01T00:00:00',
});
