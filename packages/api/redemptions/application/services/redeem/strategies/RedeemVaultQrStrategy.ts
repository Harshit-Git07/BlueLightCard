import { Redemption } from '../../../repositories/RedeptionsRepository';

import { IRedeemStrategy, RedeemVaultQrStrategyResult } from './IRedeemStrategy';

export class RedeemVaultQrStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemVaultQrStrategy' as const;

  async redeem(redemption: Redemption): Promise<RedeemVaultQrStrategyResult> {
    console.log('handleVaultQRRedemption', redemption);

    return {
      kind: 'Ok',
      redemptionType: 'vaultQR',
      redemptionDetails: '',
    };
  }
}
