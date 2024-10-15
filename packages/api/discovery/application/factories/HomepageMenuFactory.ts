import * as Factory from 'factory.ts';

import { HomepageMenu } from '../models/HomepageMenu';

export const homepageMenuFactory = Factory.Sync.makeFactory<HomepageMenu>({
  id: Factory.each((i) => `${i + 1}`),
  name: 'Sample Menu',
  startTime: '2024-09-01T00:00:00',
  endTime: '2024-09-30T23:59:59',
  updatedAt: '2024-09-01T00:00:00',
});
