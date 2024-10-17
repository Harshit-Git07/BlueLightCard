import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { PatchVaultBatchModel } from '../../models/patchVaultBatch';

export const updateVaultBatchEventFactory = Factory.define<PatchVaultBatchModel>(() => ({
  expiry: faker.date.future().toISOString(),
}));
