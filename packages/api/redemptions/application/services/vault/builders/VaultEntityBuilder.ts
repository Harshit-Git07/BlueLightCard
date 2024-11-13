import { VaultEventDetail } from '@blc-mono/redemptions/application/controllers/eventBridge/vault/VaultEventDetail';
import {
  NewVaultEntity,
  UpdateVaultEntity,
  VaultEntity,
} from '@blc-mono/redemptions/application/repositories/VaultsRepository';

export class VaultEntityBuilder {
  static readonly key = 'VaultEntityBuilder' as const;

  public buildUpdateVaultEntity(vaultDetail: VaultEventDetail, redemptionId: string): UpdateVaultEntity {
    return {
      alertBelow: vaultDetail.alertBelow,
      status: vaultDetail.vaultStatus ? 'active' : 'in-active',
      maxPerUser: vaultDetail.maxPerUser,
      showQR: vaultDetail.showQR,
      email: vaultDetail.adminEmail,
      redemptionId: redemptionId,
      vaultType: 'legacy',
      ...this.getIntegrationsSettings(vaultDetail.eeCampaignId, vaultDetail.ucCampaignId),
    };
  }

  public buildNewVaultEntity(vaultDetail: VaultEventDetail, redemptionId: string): NewVaultEntity {
    return {
      alertBelow: vaultDetail.alertBelow,
      status: vaultDetail.vaultStatus ? 'active' : 'in-active',
      maxPerUser: vaultDetail.maxPerUser,
      showQR: vaultDetail.showQR,
      email: vaultDetail.adminEmail,
      redemptionId: redemptionId,
      vaultType: 'legacy',
      ...this.getIntegrationsSettings(vaultDetail.eeCampaignId, vaultDetail.ucCampaignId),
    };
  }

  private getIntegrationsSettings(
    eeCampaignId?: string | null,
    ucCampaignId?: string | null,
  ): Pick<VaultEntity, 'integration' | 'integrationId'> {
    if (eeCampaignId) {
      return {
        integration: 'eagleeye',
        integrationId: String(eeCampaignId),
      };
    }

    if (ucCampaignId) {
      return {
        integration: 'uniqodo',
        integrationId: String(ucCampaignId),
      };
    }

    return {
      integration: null,
      integrationId: null,
    };
  }
}
