import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { createGenericsId, createRedemptionsId, genericsTable } from '@blc-mono/redemptions/libs/database/schema';

export const genericFactory = Factory.define<typeof genericsTable.$inferSelect>(() => ({
  id: createGenericsId(),
  redemptionId: createRedemptionsId(),
  code: faker.string.alphanumeric(6),
}));
