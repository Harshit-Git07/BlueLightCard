import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { EagleEyeModel, UniqodoModel } from '../../models/postCallback';

export const uniqodoModelFactory = Factory.define<UniqodoModel>(() => ({
  integrationType: 'uniqodo',
  claim: {
    expiresAt: faker.date.recent().toISOString(),
    code: faker.string.sample(10),
    createdAt: faker.date.recent().toISOString(),
    deactivatedAt: faker.date.recent().toISOString(),
    linkedUniqueReference: faker.string.sample(10),
    promotionId: faker.string.sample(10),
  },
  promotion: {
    id: faker.string.sample(10),
    status: faker.string.sample(10),
    codeType: faker.string.sample(10),
    timezone: faker.string.sample(10),
    redemptionsPerCode: faker.number.int(10),
    title: faker.string.sample(10),
    rewardType: faker.string.sample(10),
    reward: {
      type: faker.string.sample(10),
      amount: faker.finance.amount(),
      discountType: faker.string.sample(10),
      upToMaximumOf: faker.finance.amount(),
      productExclusionRule: faker.string.sample(10),
    },
    availableToClaim: faker.number.int(10),
    availableToRedeem: faker.number.int(10),
    startDate: faker.date.recent().toISOString(),
    endDate: faker.date.recent().toISOString(),
    terms: faker.string.sample(10),
    codeExpiry: faker.number.int(10),
    codeExpiryUnit: faker.string.sample(10),
  },
  customer: faker.string.sample(10),
}));

export const eagleEyeModelFactory = Factory.define<EagleEyeModel>(() => ({
  integrationType: 'eagleeye',
  accountId: faker.string.sample(10),
  accountStatus: faker.string.sample(10),
  accountTypeId: faker.string.sample(10),
  accountTransactionId: faker.string.sample(10),
  accountType: faker.string.sample(10),
  accountSubType: faker.string.sample(10),
  balances: {
    available: faker.finance.amount(),
    refundable: faker.finance.amount(),
  },
  issuerId: faker.string.sample(10),
  resourceId: faker.string.sample(10),
  resourceType: faker.string.sample(10),
  token: faker.string.sample(10),
  tokenDates: {
    start: faker.date.recent().toISOString(),
    end: faker.date.recent().toISOString(),
  },
  tokenId: faker.string.sample(10),
  tokenStatus: faker.string.sample(10),
  consumerId: faker.string.sample(10),
}));
