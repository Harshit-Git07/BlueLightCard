import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { BRANDS } from '@blc-mono/core/constants/common';
import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';

export const affiliateFactory = Factory.define<PostAffiliateModel>(() => ({
  memberId: faker.string.numeric(),
  affiliateUrl: faker.internet.url(),
  platform: faker.helpers.arrayElement(BRANDS),
  companyId: faker.string.numeric(),
  offerId: faker.string.numeric(),
}));
