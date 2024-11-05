import { Factory } from 'fishery';

import { RedeemVaultStrategyResult } from '@blc-mono/redemptions/application/services/redeem/strategies/IRedeemStrategy';

import { redeemVaultStrategyRedemptionDetailsFactory } from './redeemVaultStrategyRedemptionDetails.factory';

export const redeemVaultStrategyResultFactory = Factory.define<RedeemVaultStrategyResult>(() => ({
  kind: 'Ok',
  redemptionType: 'vault',
  redemptionDetails: redeemVaultStrategyRedemptionDetailsFactory.build(),
}));
