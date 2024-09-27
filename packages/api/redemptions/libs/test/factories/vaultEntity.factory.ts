import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { createRedemptionsId, createVaultId } from '@blc-mono/redemptions/libs/database/schema';

export const vaultEntityFactory = Factory.define<VaultEntity>(() => ({
  id: createVaultId(),
  redemptionId: createRedemptionsId(),
  status: 'active',
  alertBelow: 10,
  created: new Date('2024-07-16T03:17:18.000Z'),
  email: faker.internet.email(),
  vaultType: 'standard',
  integrationId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  integration: 'eagleeye',
  maxPerUser: faker.number.int({
    min: 1,
    max: 10,
  }),
  showQR: false,
}));
