import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { createVaultBatchesId, createVaultId, vaultBatchesTable } from '@blc-mono/redemptions/libs/database/schema';

export const vaultBatchFactory = Factory.define<typeof vaultBatchesTable.$inferSelect>(() => {
  const created = faker.date.past();
  const expiry = faker.date.future();

  created.setMilliseconds(0);
  expiry.setMilliseconds(0);

  return {
    id: createVaultBatchesId(),
    file: faker.system.filePath(),
    vaultId: createVaultId(),
    created,
    expiry,
  };
});
