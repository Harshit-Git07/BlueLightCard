import { Redemption } from '../../../repositories/RedeptionsRepository';

import { IRedeemStrategy, RedeemedStrategyResult } from './IRedeemStrategy';

export class RedeemShowCardStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemShowCardStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemedStrategyResult> {
    console.log('handleShowCardRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionDetails: {},
    };
  }
}
