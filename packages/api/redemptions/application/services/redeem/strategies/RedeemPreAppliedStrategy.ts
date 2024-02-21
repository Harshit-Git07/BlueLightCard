import { Redemption } from '../../../repositories/RedeptionsRepository';

import { IRedeemStrategy, RedeemedStrategyResult } from './IRedeemStrategy';

export class RedeemPreAppliedStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemPreAppliedStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemedStrategyResult> {
    console.log('handlePreAppliedRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionDetails: {},
    };
  }
}
