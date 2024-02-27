import { Redemption } from '../../../repositories/RedemptionsRepository';

import { IRedeemStrategy, RedeemVaultStrategyResult } from './IRedeemStrategy';

export class RedeemVaultStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemVaultStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemVaultStrategyResult> {
    console.log('handleVaultRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: '',
    };
  }
}
