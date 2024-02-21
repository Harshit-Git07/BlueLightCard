import { Redemption } from '../../../repositories/RedeptionsRepository';

import { IRedeemStrategy, RedeemedStrategyResult } from './IRedeemStrategy';

export class RedeemVaultQrStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemVaultQrStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemedStrategyResult> {
    console.log('handleVaultQRRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionDetails: {},
    };
  }
}
