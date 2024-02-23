import { Redemption } from '../../../repositories/RedeptionsRepository';

import { IRedeemStrategy, RedeemShowCardStrategyResult } from './IRedeemStrategy';

export class RedeemShowCardStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemShowCardStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemShowCardStrategyResult> {
    console.log('handleShowCardRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionType: 'showCard',
      redemptionDetails: '',
    };
  }
}
