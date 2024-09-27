import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionVaultConfig } from '@blc-mono/redemptions/application/transformers/RedemptionVaultConfigTransformer';

import { redemptionVaultBatchConfigFactory } from './redemptionVaultBatchConfig.factory';

export const redemptionVaultConfigFactory = Factory.define<RedemptionVaultConfig>(() => {
  return {
    id: faker.string.uuid(),
    alertBelow: faker.number.int(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    maxPerUser: faker.number.int(),
    createdAt: faker.date.recent().toISOString(),
    email: faker.internet.email(),
    integration: faker.helpers.arrayElement(['none', 'shopify']),
    integrationId: faker.string.uuid(),
    batches: redemptionVaultBatchConfigFactory.buildList(3),
  };
});
