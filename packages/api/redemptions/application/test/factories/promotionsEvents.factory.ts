import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { PromotionUpdatedEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/promotions/PromotionUpdateController';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';
import { platformEnum } from '@blc-mono/redemptions/libs/database/schema';

import {
  PromotionUpdatedEvent as PromotionUpdatedEventWithMeta,
  PromotionUpdatedEventDetail,
} from '../../handlers/eventBridge/promotions/events';

type PromotionsEventsFactoryDetails = {
  id: number;
  name: string;
  start: string;
  end: string;
  status: number;
  link: string;
  platform: string;
  bannerName: string;
  promotionType: number;
  companyId: number;
  isAgeGated: boolean;
};

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
export const promotionUpdatedEventFactory = Factory.define<PromotionUpdatedEventWithMeta>(() => ({
  account: faker.string.numeric(12),
  detail: promotionUpdatedEventDetailFactory.build(),
  'detail-type': 'promotion.updated.detail',
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: [RedemptionsDatasyncEvents.PROMOTION_UPDATED],
  source: RedemptionsDatasyncEvents.PROMOTION_UPDATED,
  time: faker.date.recent().toISOString(),
  version: '0',
}));

export const promotionUpdateEventDetails = Factory.define<PromotionsEventsFactoryDetails>(() => ({
  id: faker.number.int(4),
  name: faker.lorem.words(3),
  start: randomDateYYYYMMDD(),
  end: randomDateYYYYMMDD(),
  status: 1,
  link: faker.internet.url(),
  platform: 'web',
  bannerName: faker.lorem.words(3),
  promotionType: faker.number.int(1),
  companyId: faker.number.int(4),
  isAgeGated: faker.datatype.boolean(),
}));

export const promotionUpdatedEvenWithOutMetaFactory = Factory.define<PromotionUpdatedEvent>(() => ({
  version: '0',
  id: faker.string.uuid(),
  'detail-type': 'promotion.updated.detail',
  source: 'promotion.updated',
  account: faker.string.numeric(12),
  time: faker.date.recent().toISOString(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: ['promotion.updated'],
  detail: {
    ...promotionUpdateEventDetails.build(),
  },
}));
