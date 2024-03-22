import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { LegacyVaultData } from '../../repositories/LegacyVaultApiRepository';

export const legacyVaultDataFactory = Factory.define<LegacyVaultData>(() => ({
  companyId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  offerId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  linkId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
}));
