import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import jwt from 'jsonwebtoken';

import { ParsedRequest } from '@blc-mono/redemptions/application/controllers/apiGateway/redeem/RedeemController';

const allowedStatuses = ['PHYSICAL_CARD', 'ADDED_TO_BATCH', 'USER_BATCHED'];

export const generateFakeJWT = (cardStatus?: string | undefined) => {
  const payload = {
    'custom:blc_old_id': faker.lorem.words(5),
    'custom:blc_old_uuid': faker.string.uuid(),
    card_status: cardStatus,
  };
  return `Bearer ${jwt.sign(payload, 'secret')}`;
};

export const requestFactory = Factory.define(() => ({
  body: JSON.stringify({
    offerId: faker.string.uuid(),
    companyName: faker.lorem.words(5),
    offerName: faker.lorem.words(5),
  }),
  headers: {
    Authorization: generateFakeJWT(faker.helpers.arrayElement(allowedStatuses)),
  },
  requestContext: {
    requestId: 'requestId',
  },
}));

export const redeemEventFactory = Factory.define<ParsedRequest>(() => ({
  body: {
    offerId: faker.string.uuid(),
    companyName: faker.lorem.words(5),
    offerName: faker.lorem.words(5),
  },
  headers: {
    authorization: 'Bearer token',
  },
  memberId: faker.lorem.words(5),
  brazeExternalUserId: faker.string.uuid(),
}));
