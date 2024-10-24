import * as Factory from 'factory.ts';

import { Boost } from '../models/Boost';

export const boostFactory = Factory.Sync.makeFactory<Boost>({
  type: 'boost',
  boosted: false,
});
