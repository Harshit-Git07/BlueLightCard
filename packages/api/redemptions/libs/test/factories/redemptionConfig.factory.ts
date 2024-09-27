import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionConfig } from '@blc-mono/redemptions/application/transformers/RedemptionConfigTransformer';
import { affiliateEnum, createRedemptionsId, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

export const redemptionConfigFactory = Factory.define<RedemptionConfig>(() => ({
  id: createRedemptionsId(),
  offerId: faker.string.uuid(),
  companyId: faker.string.uuid(),
  connection: 'affiliate',
  affiliate: faker.helpers.arrayElement(affiliateEnum.enumValues),
  offerType: 'online',
  redemptionType: faker.helpers.arrayElement(redemptionsTable.redemptionType.enumValues),
  url: faker.internet.url(),
}));
