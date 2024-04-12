import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionTransactionalEmailEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/redemptionTransactionalEmail/RedemptionTransactionalEmailController';

import { redemptionTypeEnum } from '../../database/schema';
export const emailEventFactory = Factory.define<RedemptionTransactionalEmailEvent>(() => ({
  account: faker.string.numeric(12),
  detail: {
    memberDetails: {
      memberId: faker.string.uuid(),
      brazeExternalUserId: faker.string.uuid(),
    },
    redemptionDetails: {
      redemptionId: faker.string.uuid(),
      redemptionType: faker.helpers.arrayElement(redemptionTypeEnum.enumValues),
      companyId: faker.string.uuid(),
      companyName: faker.company.name(),
      offerId: faker.string.uuid(),
      offerName: faker.commerce.productName(),
      code: faker.string.alphanumeric(5),
      url: faker.internet.url(),
    },
  },
  'detail-type': faker.helpers.arrayElement([
    'REDEEMED_GENERIC',
    'REDEEMED_PRE_APPLIED',
    'REDEEMED_SHOW_CARD',
    'REDEEMED_VAULT',
    'REDEEMED_VAULT_QR',
  ]),
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: ['redemption.transactional.email'],
  source: 'redemption.transactional.email',
  time: faker.date.recent().toISOString(),
  version: '0',
}));
