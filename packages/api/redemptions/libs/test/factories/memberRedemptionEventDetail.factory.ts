import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { MemberRedemptionEventDetail } from '@blc-mono/core/schemas/redemptions';
import { as } from '@blc-mono/core/utils/testing';

export const memberRedemptionEventDetailFactory = Factory.define<MemberRedemptionEventDetail>(() => ({
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
    redemptionType: as('vault'),
    code: faker.string.alphanumeric(5),
    url: faker.internet.url(),
    vaultDetails: {
      id: faker.string.uuid(),
      alertBelow: faker.number.int({
        min: 1,
        max: 10,
      }),
      vaultType: faker.helpers.arrayElement(['standard', 'legacy']),
      email: faker.internet.email(),
      integration: faker.helpers.arrayElement([null, 'eagleeye', 'uniqodo']),
      integrationId: faker.string.uuid(),
    },
  },
}));
