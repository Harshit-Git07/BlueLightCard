import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { createRedemptionsId, createVaultId, vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

export const vaultFactory = Factory.define<typeof vaultsTable.$inferSelect>(() => ({
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
  terms: faker.lorem.sentence(),
}));
