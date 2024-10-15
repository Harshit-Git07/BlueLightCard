import * as Factory from 'factory.ts';

import { MenuEntity, MenuKeyBuilders } from '../repositories/schemas/MenuEntity';

import { homepageMenuFactory } from './HomepageMenuFactory';

export const menuEntityFactory = Factory.Sync.makeFactory<MenuEntity>({
  ...homepageMenuFactory.build(),
  partitionKey: Factory.each((i) => MenuKeyBuilders.buildPartitionKey((i + 1).toString())),
  sortKey: Factory.each((i) => MenuKeyBuilders.buildSortKey((i + 1).toString())),
});
