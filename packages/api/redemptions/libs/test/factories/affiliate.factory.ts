import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { CREDITCARD, GIFTCARD, PREAPPLIED } from '@blc-mono/core/constants/redemptions';
import { createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';
export type affiliateRedemptionTypeFactory = {
  id: string;
  offerId: string;
  redemptionType: 'preApplied' | 'giftCard' | 'creditCard';
  companyId: string;
  url: string;
  affiliate: string;
  connection: string;
};

export const affiliateFactory = Factory.define<affiliateRedemptionTypeFactory>(({ params: { redemptionType } }) => ({
  id: createRedemptionsId(),
  offerId: faker.string.numeric(),
  redemptionType: redemptionType ?? faker.helpers.arrayElement([PREAPPLIED, GIFTCARD, CREDITCARD]),
  companyId: faker.string.numeric(),
  url: faker.internet.url(),
  affiliate: 'none',
  connection: 'direct',
}));
