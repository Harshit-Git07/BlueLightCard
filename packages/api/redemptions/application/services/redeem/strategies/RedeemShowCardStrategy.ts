import { Redemption } from '../../../repositories/RedemptionsRepository';

import { IRedeemStrategy, RedeemShowCardStrategyResult } from './IRedeemStrategy';

export class RedeemShowCardStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemShowCardStrategy' as const;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async redeem(redemption: Redemption): Promise<RedeemShowCardStrategyResult> {
    return {
      kind: 'Ok',
      redemptionType: 'showCard',
      redemptionDetails: '',
    };
  }
}
