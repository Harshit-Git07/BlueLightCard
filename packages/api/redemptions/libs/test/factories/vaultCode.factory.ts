import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import {
  createVaultBatchesId,
  createVaultCodesId,
  createVaultId,
  vaultCodesTable,
} from '@blc-mono/redemptions/libs/database/schema';

export const vaultCodeFactory = Factory.define<typeof vaultCodesTable.$inferSelect>(() => ({
  id: createVaultCodesId(),
  batchId: createVaultBatchesId(),
  code: faker.string.alphanumeric(8),
  created: new Date('2024-07-16T03:17:18.000Z'),
  expiry: faker.date.future({ years: 1 }),
  memberId: faker.string.uuid(),
  vaultId: createVaultId(),
}));
