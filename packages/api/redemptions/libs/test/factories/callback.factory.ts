import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { EagleEyeModel, UniqodoModel } from '../../models/postCallback';

export const uniqodoModelFactory = Factory.define<UniqodoModel>(() => ({
  integrationType: 'uniqodo',
  code: faker.string.sample(10),
  offer_id: faker.string.sample(10),
  order_value: faker.string.sample(10),
  currency: faker.string.sample(3),
  redeemed_at: faker.date.recent().toISOString(),
  member_id: faker.string.sample(10),
  merchant_id: faker.string.sample(10),
}));

export const eagleEyeModelFactory = Factory.define<EagleEyeModel>(() => ({
  integrationType: 'eagleeye',
  accountTransactionId: faker.string.sample(10),
  tokenId: faker.string.sample(10),
  parentUnitId: faker.number.int({ min: 1, max: 10000 }),
  location: {
    unitId: faker.number.int(10),
    incomingIdentifier: faker.string.sample(10),
    outgoingIdentifier: faker.string.sample(10),
  },
  eventTime: faker.date.recent().toISOString(),
  memberId: faker.string.sample(10),
  consumerId: faker.string.sample(10),
}));
