import * as Factory from 'factory.ts';

import { Category } from '../models/Category';

export const categoryFactory = Factory.Sync.makeFactory<Category>({
  id: Factory.each((i) => i + 1),
  name: 'Skiing',
  parentCategoryIds: ['12'],
  level: 3,
  updatedAt: '2024-09-01T00:00:00',
});
