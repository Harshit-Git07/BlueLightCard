import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { GenericEntity } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { createGenericsId, createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';

export const genericEntityFactory = Factory.define<GenericEntity>(() => ({
  id: createGenericsId(),
  redemptionId: createRedemptionsId(),
  code: faker.string.alphanumeric(6),
}));
