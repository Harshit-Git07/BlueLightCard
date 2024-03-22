import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { VaultCreatedEvent, VaultCreatedEventDetail } from '../../controllers/eventBridge/vault/VaultCreatedController';
import { VaultUpdatedEvent, VaultUpdatedEventDetail } from '../../controllers/eventBridge/vault/VaultUpdatedController';
import { AffiliateConfigurationHelper } from '../../helpers/affiliateConfiguration';
import {
  IRedemptionsRepository,
  Redemption,
  RedemptionsRepository,
  UpdateRedemption,
} from '../../repositories/RedemptionsRepository';
import { IVaultsRepository, NewVault, Vault, VaultsRepository } from '../../repositories/VaultsRepository';

export interface IVaultService {
  updateVault(event: VaultUpdatedEvent): Promise<void>;
  createVault(event: VaultCreatedEvent): Promise<void>;
}

export class VaultService implements IVaultService {
  static readonly key = 'VaultService';
  static readonly inject = [
    Logger.key,
    RedemptionsRepository.key,
    VaultsRepository.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepo: IRedemptionsRepository,
    private readonly vaultsRepo: IVaultsRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  public async updateVault(event: VaultUpdatedEvent): Promise<void> {
    const { detail } = event;
    const redemption = await this.redemptionsRepo.findOneByOfferId(detail.offerId);
    if (!redemption) {
      this.logger.error({
        message: 'Vault Update - Redemption find one by offer id failed: Redemption not found',
        context: {
          offerId: detail.offerId,
        },
      });
      throw new Error(
        `Vault Update - Redemption find one by offer id failed: Redemption not found (offerId=${detail.offerId})`,
      );
    }
    const vault = await this.vaultsRepo.findOneByRedemptionId(redemption.id);
    if (!vault) {
      this.logger.error({
        message: 'Vault Update - Vault find one by redemption id failed: Vault not found',
        context: {
          redemptionId: redemption.id,
        },
      });
      throw new Error(
        `Vault Update - Vault find one by redemption id failed: Vault not found (redemptionId=${redemption.id})`,
      );
    }

    const updatedRedemptionData = this.makeUpdatedRedemptionDataForUpdateVault(detail, redemption);
    const updatedVaultData = this.makeUpdatedVaultDataForUpdateVault(detail);

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const redemptionRepoTransaction = this.redemptionsRepo.withTransaction(transactionConnection);
      const vaultRepoTransaction = this.vaultsRepo.withTransaction(transactionConnection);

      await redemptionRepoTransaction.updateOneByOfferId(detail.offerId, updatedRedemptionData);
      await vaultRepoTransaction.updateOneById(vault.id, updatedVaultData);
    });
  }

  public async createVault(event: VaultCreatedEvent): Promise<void> {
    const { detail } = event;

    await this.transactionManager.withTransaction(async (transaction) => {
      const updatedRedemptionData = this.makeUpdatedRedemptionForCreateVault(detail);
      const transactionConnection = { db: transaction };
      const redemptionRepoTransaction = this.redemptionsRepo.withTransaction(transactionConnection);
      const vaultRepoTransaction = this.vaultsRepo.withTransaction(transactionConnection);
      const updatedRedemption = await redemptionRepoTransaction.updateOneByOfferId(
        detail.offerId,
        updatedRedemptionData,
      );

      if (!updatedRedemption) {
        this.logger.error({
          message: 'Vault Create - Redemption update by offer id failed: No redemptions found',
          context: {
            offerId: detail.offerId,
            companyId: detail.companyId,
            platform: detail.platform,
          },
        });
        throw new Error('Failed to create vault (no matching redemptions found)');
      }

      await vaultRepoTransaction.create({
        alertBelow: detail.alertBelow,
        status: detail.vaultStatus ? 'active' : 'in-active',
        maxPerUser: detail.maxPerUser,
        showQR: detail.showQR,
        terms: detail.terms,
        email: detail.adminEmail || null,
        redemptionId: updatedRedemption.id,
        vaultType: 'legacy',
        ...this.getIntegrationsForCreateVault(detail),
      });
    });
  }

  // HELPERS

  private getAffiliateSettingForUpdatedVault(
    detail: VaultUpdatedEventDetail,
    redemptionAttachedToVault: Redemption,
  ): Pick<Redemption, 'connection' | 'affiliate' | 'url'> | undefined {
    if (detail?.link) {
      if (detail.link == redemptionAttachedToVault?.url) {
        const affiliateConfig = new AffiliateConfigurationHelper(detail.link).getConfig();
        if (affiliateConfig) {
          return {
            connection: 'affiliate',
            affiliate: affiliateConfig?.affiliate,
            url: detail.link,
          };
        } else {
          return {
            connection: 'direct',
            affiliate: null,
            url: detail.link,
          };
        }
      }
      if (detail.link !== redemptionAttachedToVault?.url) {
        return {
          connection: 'direct',
          affiliate: null,
          url: detail.link,
        };
      }
    }
  }

  private getVaultStatusForUpdatedVault(detail: VaultUpdatedEventDetail): Vault['status'] | undefined {
    switch (detail?.vaultStatus) {
      case true:
        return 'active';
      case false:
        return 'in-active';
      default:
        return undefined;
    }
  }

  private getIntegrationsSettingForUpdatedVault(
    detail: VaultUpdatedEventDetail,
  ): Pick<Vault, 'integration' | 'integrationId'> | undefined {
    if (detail?.eeCampaignId) {
      return {
        integration: 'eagleeye',
        integrationId: detail?.eeCampaignId,
      };
    } else if (detail?.ucCampaignId) {
      return {
        integration: 'uniqodo',
        integrationId: detail?.ucCampaignId,
      };
    }
    if (detail?.eeCampaignId === null) {
      return {
        integration: null,
        integrationId: null,
      };
    } else if (detail?.ucCampaignId === null) {
      return {
        integration: null,
        integrationId: null,
      };
    }
  }

  private makeUpdatedRedemptionDataForUpdateVault(
    detail: VaultUpdatedEventDetail,
    redemptionAttachedToVault: Redemption,
  ): Partial<Redemption> {
    const affiliateSetting = this.getAffiliateSettingForUpdatedVault(detail, redemptionAttachedToVault);

    return {
      ...affiliateSetting,
      redemptionType: detail?.linkId ? 'vault' : 'vaultQR',
    };
  }

  private makeUpdatedVaultDataForUpdateVault(detail: VaultUpdatedEventDetail): Partial<Vault> {
    const integrations = this.getIntegrationsSettingForUpdatedVault(detail);

    return {
      status: this.getVaultStatusForUpdatedVault(detail),
      vaultType: 'legacy',
      ...integrations,
    };
  }

  private getIntegrationsForCreateVault(
    event: VaultCreatedEventDetail,
  ): Pick<NewVault, 'integration' | 'integrationId'> {
    switch (true) {
      case Boolean(event.eeCampaignId):
        return {
          integration: 'eagleeye',
          integrationId: event.eeCampaignId ?? null,
        };
      case Boolean(event.ucCampaignId):
        return {
          integration: 'uniqodo',
          integrationId: event.ucCampaignId ?? null,
        };
      default:
        return {
          integration: null,
          integrationId: null,
        };
    }
  }

  private makeUpdatedRedemptionForCreateVault(event: VaultCreatedEventDetail): UpdateRedemption {
    if (!event.link) {
      return {
        redemptionType: 'vaultQR',
        connection: 'direct',
        affiliate: null,
        url: null,
      };
    }
    const affiliateConfiguration = new AffiliateConfigurationHelper(event.link).getConfig();

    if (!affiliateConfiguration) {
      return {
        redemptionType: 'vault',
        connection: 'direct',
        affiliate: null,
        url: event.link,
      };
    }

    return {
      redemptionType: 'vault',
      connection: 'affiliate',
      affiliate: affiliateConfiguration.affiliate,
      url: event.link,
    };
  }
}
