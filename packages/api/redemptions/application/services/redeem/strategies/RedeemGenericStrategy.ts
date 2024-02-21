import { Redemption } from '../../../repositories/RedeptionsRepository';

import { IRedeemStrategy, RedeemedStrategyResult } from './IRedeemStrategy';

export class RedeemGenericStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemGenericStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemedStrategyResult> {
    console.log('handleGenericRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionDetails: {},
    };
  }
}
