import { Redemption } from '../../../repositories/RedeptionsRepository';

import { IRedeemStrategy, RedeemPreAppliedStrategyResult } from './IRedeemStrategy';

export class RedeemPreAppliedStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemPreAppliedStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemPreAppliedStrategyResult> {
    console.log('handlePreAppliedRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: '',
    };
  }
}
