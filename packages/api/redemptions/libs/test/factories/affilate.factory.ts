import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';

export const affiliateFactory = Factory.define<PostAffiliateModel>(() => ({
  memberId: faker.string.numeric(),
  affiliateUrl: faker.internet.url(),
  platform: faker.helpers.arrayElement(['BLC_UK', 'BLC_AU', 'DDS_UK']),
  companyId: faker.string.numeric(),
  offerId: faker.string.numeric(),
}));
