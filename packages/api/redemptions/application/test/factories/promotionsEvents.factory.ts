import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { platformEnum } from '@blc-mono/redemptions/libs/database/schema';

import {
  PromotionEvents,
  PromotionUpdatedEvent,
  PromotionUpdatedEventDetail,
} from '../../handlers/eventBridge/promotions/events';

function randomDateYYYYMMDD() {
  const date = faker.date.recent();
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const vaultDependentEntityFactory = Factory.define<PromotionUpdatedEventDetail['meta']['dependentEntities'][0]>(
  () => ({
    type: 'vault',
    companyId: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
    offerId: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
  }),
);

export const promotionUpdatedEventDetailFactory = Factory.define<PromotionUpdatedEventDetail>(() => ({
  meta: {
    dependentEntities: vaultDependentEntityFactory.buildList(1),
    platform: faker.helpers.arrayElement(platformEnum.enumValues),
  },
  update: {
    bannerName: faker.helpers.maybe(() => faker.lorem.words(3)),
    companyId: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
    end: randomDateYYYYMMDD(),
    id: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
    isAgeGated: faker.datatype.boolean(),
    link: faker.helpers.maybe(() => faker.helpers.arrayElement([faker.internet.url(), ''])),
    name: faker.lorem.words(3),
    promotionType: faker.number.int(2),
    start: randomDateYYYYMMDD(),
    status: faker.helpers.arrayElement([0, 1]),
  },
}));
export const promotionUpdatedEventFactory = Factory.define<PromotionUpdatedEvent>(() => ({
  account: faker.string.numeric(12),
  detail: promotionUpdatedEventDetailFactory.build(),
  'detail-type': 'promotion.updated.detail',
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: [PromotionEvents.PROMOTION_UPDATED],
  source: PromotionEvents.PROMOTION_UPDATED,
  time: faker.date.recent().toISOString(),
  version: '0',
}));
