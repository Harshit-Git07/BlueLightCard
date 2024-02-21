import { Redemption } from '../../../repositories/RedeptionsRepository';

import { IRedeemStrategy, RedeemedStrategyResult } from './IRedeemStrategy';

export class RedeemVaultStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemVaultStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemedStrategyResult> {
    console.log('handleVaultRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionDetails: {},
    };
  }
}
