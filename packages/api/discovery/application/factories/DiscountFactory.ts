import * as Factory from 'factory.ts';

import { Discount } from '../models/Discount';

export const discountFactory = Factory.Sync.makeFactory<Discount>({
  type: 'Percentage off',
  description: 'Other',
  coverage: 'All Site',
  updatedAt: '2024-09-01T00:00:00',
});
