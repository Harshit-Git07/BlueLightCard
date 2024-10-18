import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { PromotionUpdatedEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/promotions/PromotionUpdateController';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

function randomDateYYYYMMDD() {
  const date = faker.date.recent();
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const promotionUpdatedEventDetails = Factory.define<PromotionUpdatedEvent['detail']>(() => ({
  id: faker.number.int(4),
  name: faker.lorem.words(3),
  start: randomDateYYYYMMDD(),
  end: randomDateYYYYMMDD(),
  status: 1,
  link: faker.internet.url(),
  bannerName: faker.lorem.words(3),
  promotionType: faker.number.int(1),
  companyId: faker.string.uuid(),
  isAgeGated: faker.datatype.boolean(),
}));

export const promotionsUpdatedEventFactory = Factory.define<PromotionUpdatedEvent>(() => ({
  version: '0',
  id: faker.string.uuid(),
  'detail-type': 'promotion.updated.detail',
  source: RedemptionsDatasyncEvents.PROMOTION_UPDATED,
  account: faker.string.numeric(12),
  time: faker.date.recent().toISOString(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: [],
  detail: promotionUpdatedEventDetails.build(),
}));
