import { Redemption } from '../../../repositories/RedemptionsRepository';

import { IRedeemStrategy, RedeemVaultQrStrategyResult } from './IRedeemStrategy';

export class RedeemVaultQrStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemVaultQrStrategy' as const;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async redeem(redemption: Redemption): Promise<RedeemVaultQrStrategyResult> {
    return {
      kind: 'Ok',
      redemptionType: 'vaultQR',
      redemptionDetails: '',
    };
  }
}
