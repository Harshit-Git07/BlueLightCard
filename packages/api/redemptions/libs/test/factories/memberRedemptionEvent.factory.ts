import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { MemberRedemptionEvent } from '@blc-mono/core/schemas/redemptions';
import { MemberRedemptionParams } from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';

export const memberRedemptionEventDetailFactory = Factory.define<MemberRedemptionEvent['detail']>(() => ({
  memberDetails: {
    memberId: faker.string.uuid(),
    brazeExternalUserId: faker.string.uuid(),
  },
  redemptionDetails: {
    redemptionId: faker.string.uuid(),
    affiliate: faker.company.name(),
    companyId: faker.string.uuid(),
    companyName: faker.company.name(),
    offerId: faker.string.uuid(),
    offerName: faker.commerce.productName(),
    clientType: faker.helpers.arrayElement(['web', 'mobile']),
    platform: faker.helpers.arrayElement(['BLC_UK', 'BLC_AU', 'DDS_UK']),
    redemptionType: 'vault',
    code: faker.string.alphanumeric(5),
    url: faker.internet.url(),
  },
}));

export const memberRedemptionEventFactory = Factory.define<MemberRedemptionEvent>(() => ({
  account: faker.string.numeric(12),
  detail: memberRedemptionEventDetailFactory.build(),
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

export const memberRedemptionParamsFactory = Factory.define<MemberRedemptionParams>(() => {
  const redemptionType = faker.helpers.arrayElement(['showCard', 'preApplied', 'generic', 'vault', 'vaultQR'] as const);
  const redemptionHasCode = ['generic', 'vault', 'vaultQR'].includes(redemptionType);

  return {
    clientType: 'web' as const,
    redemptionType: redemptionType,
    offerId: faker.string.uuid(),
    companyId: faker.string.uuid(),
    memberId: faker.number
      .int({
        min: 1,
        max: 1_000_000,
      })
      .toString(),
    code: redemptionHasCode ? '' : undefined,
  } as MemberRedemptionParams;
});
