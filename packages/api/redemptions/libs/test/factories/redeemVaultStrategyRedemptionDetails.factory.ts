import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedeemVaultStrategyRedemptionDetails } from '@blc-mono/redemptions/application/services/redeem/strategies/IRedeemStrategy';
import { createVaultId } from '@blc-mono/redemptions/libs/database/schema';

export const redeemVaultStrategyRedemptionDetailsFactory = Factory.define<RedeemVaultStrategyRedemptionDetails>(() => ({
  code: faker.string.alphanumeric(),
  url: faker.internet.url(),
  vaultDetails: {
    id: createVaultId(),
    alertBelow: faker.number.int(),
    email: faker.internet.email(),
    vaultType: 'standard',
    integration: faker.internet.url(),
    integrationId: faker.string.alphanumeric(),
  },
}));
