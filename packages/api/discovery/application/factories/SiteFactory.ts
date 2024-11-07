import * as Factory from 'factory.ts';

import { Site } from '../models/Site';

export const siteFactory = Factory.Sync.makeFactory<Site>({
  id: Factory.each((i) => `${i + 1}`),
  dealsOfTheWeekMenu: Factory.each((i) => ({ id: `deals-of-the-week-id-${i + 1}` })),
  featuredOffersMenu: Factory.each((i) => ({ id: `featured-offers-id-${i + 1}` })),
  updatedAt: '2022-09-01T00:00:00',
});
