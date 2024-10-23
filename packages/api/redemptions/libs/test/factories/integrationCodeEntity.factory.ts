import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { IntegrationCodeEntity } from '@blc-mono/redemptions/application/repositories/IntegrationCodesRepository';
import { createIntegrationCodesId, createVaultId, integrationEnum } from '@blc-mono/redemptions/libs/database/schema';

export const integrationCodeEntityFactory = Factory.define<IntegrationCodeEntity>(() => {
  const created = faker.date.past();
  const expiry = faker.date.future({ years: 1 });

  created.setMilliseconds(0);
  expiry.setMilliseconds(0);

  return {
    id: createIntegrationCodesId(),
    vaultId: createVaultId(),
    code: faker.string.alphanumeric(8),
    created,
    expiry,
    memberId: faker.string.uuid(),
    integrationId: faker.string.alphanumeric(20),
    integration: faker.helpers.arrayElement(integrationEnum.enumValues),
  };
});
