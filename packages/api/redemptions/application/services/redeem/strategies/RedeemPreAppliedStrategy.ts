import { Redemption } from '../../../repositories/RedemptionsRepository';

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
