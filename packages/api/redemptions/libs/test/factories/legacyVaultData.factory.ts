import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { LegacyVaultData, ViewVaultBatchesData } from '../../../application/repositories/LegacyVaultApiRepository';

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

export const legacyVaultBatchesFactory = Factory.define<ViewVaultBatchesData>(() => ({
  [faker.string.uuid()]: {
    expires: faker.date.future().toISOString(),
    dateAdded: faker.date.past().toISOString(),
    filename: 'something.csv',
  },
}));
