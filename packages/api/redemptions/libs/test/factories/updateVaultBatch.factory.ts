import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { createVaultBatchesId } from '@blc-mono/redemptions/libs/database/schema';

import { PatchVaultBatchModel } from '../../models/patchVaultBatch';

export const updateVaultBatchEventFactory = Factory.define<PatchVaultBatchModel>(() => ({
  batchId: createVaultBatchesId(),
  expiry: faker.date.future().toISOString(),
}));
