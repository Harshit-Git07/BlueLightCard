import * as Factory from 'factory.ts';

import { MenuOffer } from '../models/Menu';

import { menuFactory } from './MenuFactory';

const offerFactory = Factory.Sync.makeFactory({
  id: Factory.each((i) => `${i + 1}`),
  company: Factory.each((i) => ({ id: `${i + 1}` })),
});

export const menuOfferFactory: Factory.Sync.Factory<MenuOffer> = Factory.Sync.makeFactory({
  offers: offerFactory.buildList(3),
}).combine(menuFactory);
