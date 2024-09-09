import * as Factory from 'factory.ts';

import { Boost } from '../models/Boost';

export const boostFactory = Factory.Sync.makeFactory<Boost>({
  type: 'boost',
  boostStart: '2024-09-01',
  boostEnd: '2024-09-30',
  updatedAt: '2024-09-01T00:00:00',
});
