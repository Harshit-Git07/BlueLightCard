import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { VaultRedemptionTransactionalEmailParams } from '@blc-mono/redemptions/application/repositories/EmailRepository';

export const redemptionTransactionalEmailPayloadFactory = Factory.define<VaultRedemptionTransactionalEmailParams>(
  () => ({
    brazeExternalUserId: faker.string.uuid(),
    memberId: faker.string.uuid(),
    offerId: faker.string.uuid(),
    companyId: faker.string.uuid(),
    companyName: faker.company.name(),
    offerName: faker.commerce.productName(),
    url: faker.internet.url(),
    affiliate: faker.company.name(),
    code: faker.string.alphanumeric(5),
  }),
);
