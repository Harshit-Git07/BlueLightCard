import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { OfferCreatedEvent, OfferCreatedEventDetail } from '../../controllers/eventBridge/offer/OfferCreatedController';
import { OfferUpdatedEvent, OfferUpdatedEventDetail } from '../../controllers/eventBridge/offer/OfferUpdatedController';

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
  'detail-type': RedemptionsDatasyncEvents.OFFER_CREATED,
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: [RedemptionsDatasyncEvents.OFFER_CREATED],
  source: RedemptionsDatasyncEvents.OFFER_CREATED,
  time: faker.date.recent().toISOString(),
  version: '0',
}));

export const offerUpdatedEventDetailFactory = Factory.define<OfferUpdatedEventDetail>(() => ({
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

export const offerUpdatedEventFactory = Factory.define<OfferUpdatedEvent>(() => ({
  account: faker.string.numeric(12),
  detail: offerUpdatedEventDetailFactory.build(),
  'detail-type': RedemptionsDatasyncEvents.OFFER_UPDATED,
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: [RedemptionsDatasyncEvents.OFFER_UPDATED],
  source: RedemptionsDatasyncEvents.OFFER_UPDATED,
  time: faker.date.recent().toISOString(),
  version: '0',
}));
