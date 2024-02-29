import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { OfferCreatedEvent, OfferCreatedEventDetail } from '../../handlers/eventBridge/offers/events';

export const offerCreatedEventDetailFactory = Factory.define<OfferCreatedEventDetail>(() => ({
  offerId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  companyId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  offerUrl: faker.internet.url(),
  offerCode: faker.string.alphanumeric(5),
  offerType: faker.number.int({
    min: 0,
    max: 6,
  }),
  platform: faker.helpers.arrayElement(['BLC_UK', 'BLC_AU', 'DDS_UK']),
}));

export const offerCreatedEventFactory = Factory.define<OfferCreatedEvent>(() => ({
  account: faker.string.numeric(12),
  detail: offerCreatedEventDetailFactory.build(),
  'detail-type': 'redemptionOffer.created',
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: ['redemptionOffer.created'],
  source: 'redemptionOffer.created',
  time: faker.date.recent().toISOString(),
  version: '0',
}));
