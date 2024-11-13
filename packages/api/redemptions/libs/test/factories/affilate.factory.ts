import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { BRANDS } from '@blc-mono/core/constants/common';
import { createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';
import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';

export const affiliateFactory = Factory.define<PostAffiliateModel>(() => ({
  memberId: faker.string.numeric(),
  affiliateUrl: faker.internet.url(),
  platform: faker.helpers.arrayElement(BRANDS),
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
}));

type testGiftPreAppliedCardRedemption = {
  id: string;
  offerId: string;
  redemptionType: 'preApplied' | 'giftCard';
  connection: 'none' | 'affiliate';
  companyId: string;
  affiliate: 'awin';
  url: string;
};

export const giftCardFactory = Factory.define<testGiftPreAppliedCardRedemption>(() => ({
  id: createRedemptionsId(),
  offerId: faker.string.numeric(),
  redemptionType: 'giftCard',
  companyId: faker.string.numeric(),
  url: 'https://www.awin1.com/',
  affiliate: 'awin',
  connection: 'affiliate',
}));
