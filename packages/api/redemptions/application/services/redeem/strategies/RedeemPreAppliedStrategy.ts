import { Redemption } from '../../../repositories/RedemptionsRepository';

import { IRedeemStrategy, RedeemPreAppliedStrategyResult } from './IRedeemStrategy';

export class RedeemPreAppliedStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemPreAppliedStrategy' as const;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  redeem(redemption: Redemption): Promise<RedeemPreAppliedStrategyResult> {
    return Promise.resolve({
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: '',
    });
  }
}
