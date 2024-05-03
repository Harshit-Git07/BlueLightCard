import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { MemberRedemptionEvent } from '@blc-mono/core/schemas/redemptions';

import { redemptionTypeEnum } from '../../database/schema';

export const memberRedemptionEventFactory = Factory.define<MemberRedemptionEvent>(() => ({
  account: faker.string.numeric(12),
  detail: {
    memberDetails: {
      memberId: faker.string.uuid(),
      brazeExternalUserId: faker.string.uuid(),
    },
    redemptionDetails: {
      redemptionId: faker.string.uuid(),
      affiliate: faker.company.name(),
      redemptionType: faker.helpers.arrayElement(redemptionTypeEnum.enumValues),
      companyId: faker.number.int({
        min: 1,
        max: 1_000_000,
      }),
      companyName: faker.company.name(),
      offerId: faker.number.int({
        min: 1,
        max: 1_000_000,
      }),
      offerName: faker.commerce.productName(),
      code: faker.string.alphanumeric(5),
      url: faker.internet.url(),
      clientType: faker.helpers.arrayElement(['web', 'mobile']),
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
