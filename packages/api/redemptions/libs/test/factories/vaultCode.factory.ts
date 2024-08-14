import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import {
  createVaultBatchesId,
  createVaultCodesId,
  createVaultId,
  vaultCodesTable,
} from '@blc-mono/redemptions/libs/database/schema';

export const vaultCodeFactory = Factory.define<typeof vaultCodesTable.$inferSelect>(() => {
  const created = faker.date.past();
  const expiry = faker.date.future({ years: 1 });

  created.setMilliseconds(0);
  expiry.setMilliseconds(0);

  return {
    id: createVaultCodesId(),
    batchId: createVaultBatchesId(),
    code: faker.string.alphanumeric(8),
    created,
    expiry,
    memberId: faker.string.uuid(),
    vaultId: createVaultId(),
  };
});
