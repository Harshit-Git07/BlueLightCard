import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionEventDetail } from '@blc-mono/redemptions/application/repositories/RedemptionEventsRepository';

import { redemptionTypeEnum } from '../../database/schema';

export const redemptionTransactionalEmailPayloadFactory = Factory.define<RedemptionEventDetail>(() => ({
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
    affiliate: faker.company.name(),
    offerName: faker.commerce.productName(),
    code: faker.string.alphanumeric(5),
    url: faker.internet.url(),
  },
}));
