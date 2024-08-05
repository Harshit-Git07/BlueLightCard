import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { createVaultBatchesId, createVaultId, vaultBatchesTable } from '@blc-mono/redemptions/libs/database/schema';

export const vaultBatchFactory = Factory.define<typeof vaultBatchesTable.$inferSelect>(() => ({
  id: createVaultBatchesId(),
  file: faker.system.filePath(),
  vaultId: createVaultId(),
  created: faker.date.past(),
  expiry: faker.date.future(),
}));
