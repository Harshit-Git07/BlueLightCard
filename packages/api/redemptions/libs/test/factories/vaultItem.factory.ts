import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { VaultItem } from '../../../application/repositories/LegacyVaultApiRepository';

export const vaultItemFactory = Factory.define<VaultItem>(() => ({
  companyId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  offerId: faker.string.uuid(),
}));
