import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { VaultBatchEntity } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { createVaultBatchesId, createVaultId } from '@blc-mono/redemptions/libs/database/schema';

export const vaultBatchEntityFactory = Factory.define<VaultBatchEntity>(() => {
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
