import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { COMPARE, GIFTCARD, PREAPPLIED } from '@blc-mono/core/constants/redemptions';
import { Affiliate, Connection, createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';
export type affiliateRedemptionTypeFactory = {
  id: string;
  offerId: string;
  redemptionType: 'preApplied' | 'giftCard' | 'compare' | 'verify';
  companyId: string;
  url: string;
  affiliate: Affiliate;
  connection: Connection;
};

export const affiliateFactory = Factory.define<affiliateRedemptionTypeFactory>(
  ({ params: { redemptionType, offerId, companyId, id } }) => ({
    id: id ?? createRedemptionsId(),
    offerId: offerId ?? faker.string.numeric(),
    redemptionType: redemptionType ?? faker.helpers.arrayElement([PREAPPLIED, GIFTCARD, COMPARE]),
    companyId: companyId ?? faker.string.numeric(),
    url: faker.internet.url(),
    affiliate: 'awin',
    connection: 'direct',
  }),
);
