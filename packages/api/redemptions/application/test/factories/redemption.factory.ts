import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import {
  affiliateEnum,
  createRedemptionsId,
  platformEnum,
  redemptionsTable,
} from '@blc-mono/redemptions/libs/database/schema';

export const redemptionFactory = Factory.define<typeof redemptionsTable.$inferSelect>(() => ({
  id: createRedemptionsId(),
  offerId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  companyId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  connection: 'affiliate',
  affiliate: faker.helpers.arrayElement(affiliateEnum.enumValues),
  offerType: 'online',
  platform: faker.helpers.arrayElement(platformEnum.enumValues),
  redemptionType: faker.helpers.arrayElement(redemptionsTable.redemptionType.enumValues),
  url: faker.internet.url(),
}));
