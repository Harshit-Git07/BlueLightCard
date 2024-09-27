import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionVaultBatchConfig } from '@blc-mono/redemptions/application/transformers/RedemptionVaultConfigTransformer';

export const redemptionVaultBatchConfigFactory = Factory.define<RedemptionVaultBatchConfig>(() => ({
  id: faker.string.uuid(),
  created: faker.date.recent().toISOString(),
  expiry: faker.date.recent().toISOString(),
}));
