import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import {
  PreAppliedTransactionalEmailParams,
  VaultOrGenericTransactionalEmailParams,
} from '@blc-mono/redemptions/application/repositories/EmailRepository';

export const vaultOrGenericEmailPayloadFactory = Factory.define<VaultOrGenericTransactionalEmailParams>(() => ({
  brazeExternalUserId: faker.string.uuid(),
  memberId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  companyId: faker.string.uuid(),
  companyName: faker.company.name(),
  offerName: faker.commerce.productName(),
  url: faker.internet.url(),
  affiliate: faker.company.name(),
  code: faker.string.alphanumeric(5),
}));

export const preAppliedEmailPayloadFactory = Factory.define<PreAppliedTransactionalEmailParams>(() => ({
  brazeExternalUserId: faker.string.uuid(),
  memberId: faker.string.uuid(),
  companyName: faker.company.name(),
  offerName: faker.commerce.productName(),
  url: faker.internet.url(),
}));
