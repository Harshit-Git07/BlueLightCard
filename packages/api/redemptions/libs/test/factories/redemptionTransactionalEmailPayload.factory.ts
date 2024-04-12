import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionTransactionalEmailPayload } from '@blc-mono/redemptions/application/repositories/EmailRepository';

import { redemptionTypeEnum } from '../../database/schema';

export const redemptionTransactionalEmailPayloadFactory = Factory.define<RedemptionTransactionalEmailPayload>(() => ({
  memberDetails: {
    memberId: faker.string.uuid(),
    brazeExternalUserId: faker.string.uuid(),
  },
  redemptionDetails: {
    redemptionId: faker.string.uuid(),
    redemptionType: faker.helpers.arrayElement(redemptionTypeEnum.enumValues),
    companyId: faker.string.uuid(),
    companyName: faker.company.name(),
    offerId: faker.string.uuid(),
    offerName: faker.commerce.productName(),
    code: faker.string.alphanumeric(5),
    url: faker.internet.url(),
  },
}));
