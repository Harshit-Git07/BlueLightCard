import * as Factory from 'factory.ts';

import { MenuType } from '../models/MenuResponse';
import { MenuEntity, MenuKeyBuilders } from '../repositories/schemas/MenuEntity';

import { menuFactory } from './MenuFactory';

export const menuEntityFactory: Factory.Sync.Factory<MenuEntity> = Factory.Sync.makeFactory({
  partitionKey: Factory.each((i) => MenuKeyBuilders.buildPartitionKey((i + 1).toString())),
  sortKey: Factory.each((i) => MenuKeyBuilders.buildSortKey((i + 1).toString())),
  gsi1PartitionKey: MenuKeyBuilders.buildGsi1SortKey(MenuType.MARKETPLACE),
  gsi1SortKey: MenuKeyBuilders.buildGsi1SortKey(MenuType.MARKETPLACE),
}).combine(menuFactory);
