import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';

import { RedeemVaultStrategyRedemptionDetails } from '../IRedeemStrategy';

export class RedeemVaultStrategyRedemptionDetailsBuilder {
  static readonly key = 'RedeemVaultStrategyRedemptionDetailsBuilder' as const;

  public buildRedeemVaultStrategyRedemptionDetails(
    vaultEntity: VaultEntity,
    redemptionType: 'vault' | 'vaultQR',
    redemptionUrl: string | null,
    memberId: string,
    code: string,
  ): RedeemVaultStrategyRedemptionDetails {
    const redemptionDetails: RedeemVaultStrategyRedemptionDetails = {
      code: code,
      vaultDetails: {
        id: vaultEntity.id,
        alertBelow: vaultEntity.alertBelow,
        email: vaultEntity.email ?? '',
        vaultType: vaultEntity.vaultType,
        integration: vaultEntity.integration,
        integrationId: String(vaultEntity.integrationId),
      },
    };

    if (redemptionType != 'vaultQR' && redemptionUrl) {
      const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemptionUrl, memberId);
      redemptionDetails.url = parsedUrl;
    }

    return redemptionDetails;
  }
}
