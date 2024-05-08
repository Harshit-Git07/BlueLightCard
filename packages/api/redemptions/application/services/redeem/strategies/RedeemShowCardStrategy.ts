import { Redemption } from '../../../repositories/RedemptionsRepository';

import { IRedeemStrategy, RedeemShowCardStrategyResult } from './IRedeemStrategy';

export class RedeemShowCardStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemShowCardStrategy' as const;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  redeem(redemption: Redemption): Promise<RedeemShowCardStrategyResult> {
    return Promise.resolve({
      kind: 'Ok',
      redemptionType: 'showCard',
      redemptionDetails: '',
    });
  }
}
