import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';
export type giftCardFactory = {
  id: string;
  offerId: string;
  redemptionType: string;
  companyId: string;
  url: string;
  affiliate: string;
  connection: string;
};

export const giftCardFactory = Factory.define<giftCardFactory>(() => ({
  id: createRedemptionsId(),
  offerId: faker.string.numeric(),
  redemptionType: 'giftCard',
  companyId: faker.string.numeric(),
  url: 'https://www.awin1.com/',
  affiliate: 'awin',
  connection: 'affiliate',
}));
