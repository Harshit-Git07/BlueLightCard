import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { VaultItem } from '../../../application/repositories/LegacyVaultApiRepository';

export const vaultItemFactory = Factory.define<VaultItem>(() => ({
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
}));
