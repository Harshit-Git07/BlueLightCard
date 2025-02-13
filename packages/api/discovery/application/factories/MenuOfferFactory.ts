import * as Factory from 'factory.ts';

import { menuFactory } from './MenuFactory';
import { eventFactory, offerFactory } from './OfferFactory';

const ingestedOfferFactory = Factory.Sync.makeFactory({
  id: Factory.each((i) => `${i + 1}`),
  company: Factory.each((i) => ({ id: `${i + 1}` })),
  start: '2021-09-01T00:00:00Z',
  end: '2021-09-01T00:00:00Z',
  position: Factory.each((i) => i),
  overrides: {},
});

export const ingestedMenuOfferFactory = Factory.Sync.makeFactory({
  offers: ingestedOfferFactory.buildList(3),
}).combine(menuFactory);

export const menuOfferFactory = Factory.Sync.makeFactory({
  start: '2021-09-01T00:00:00Z',
  end: '2021-09-01T00:00:00Z',
  position: Factory.each((i) => i),
  overrides: {},
}).combine(offerFactory);

export const menuEventOfferFactory = Factory.Sync.makeFactory({
  start: '2021-09-01T00:00:00Z',
  end: '2021-09-01T00:00:00Z',
  position: Factory.each((i) => i),
  overrides: {},
}).combine(eventFactory);
