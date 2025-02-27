import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { BRANDS } from '@blc-mono/core/constants/common';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import {
  OfferCreatedEvent,
  OfferCreatedEventDetail,
} from '../../../application/controllers/eventBridge/offer/OfferCreatedController';
import {
  OfferUpdatedEvent,
  OfferUpdatedEventDetail,
} from '../../../application/controllers/eventBridge/offer/OfferUpdatedController';

export const offerCreatedEventDetailFactory = Factory.define<OfferCreatedEventDetail>(() => ({
  offerId: faker.string.uuid(),
  companyId: faker.string.uuid(),
  offerUrl: faker.internet.url(),
  offerCode: faker.string.alphanumeric(5),
  offerType: faker.number.int({
    min: 0,
    max: 6,
  }),
  platform: faker.helpers.arrayElement(BRANDS),
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
  offerId: faker.string.uuid(),
  companyId: faker.string.uuid(),
  offerUrl: faker.internet.url(),
  offerCode: faker.string.alphanumeric(5),
  offerType: faker.number.int({
    min: 0,
    max: 6,
  }),
  platform: faker.helpers.arrayElement(BRANDS),
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
