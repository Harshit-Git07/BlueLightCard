import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { VaultDetails } from '@blc-mono/redemptions/application/services/redeem/strategies/IRedeemStrategy';
import { createVaultId } from '@blc-mono/redemptions/libs/database/schema';

export const vaultDetailsFactory = Factory.define<VaultDetails>(() => ({
  id: createVaultId(),
  alertBelow: 10,
  vaultType: 'standard',
  email: faker.internet.email(),
  integrationId: faker.string.uuid(),
  integration: 'eagleeye',
}));
