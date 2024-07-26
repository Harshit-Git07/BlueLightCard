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
    expires: '2024-01-01 23:59:59',
    dateAdded: '2024-01-01 23:59:59',
    filename: 'something.csv',
  },
}));
