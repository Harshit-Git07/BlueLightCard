import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedeemParams } from '@blc-mono/redemptions/application/services/redeem/strategies/IRedeemStrategy';

export const redeemParamsFactory = Factory.define<RedeemParams>(() => ({
  memberId: faker.string.uuid(),
  brazeExternalUserId: faker.string.uuid(),
  companyName: faker.string.uuid(),
  offerName: faker.string.uuid(),
  clientType: faker.helpers.arrayElement(['mobile', 'web']),
  memberEmail: faker.internet.email(),
}));
