import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { VaultCreatedEvent, VaultCreatedEventDetail } from '../../controllers/eventBridge/vault/VaultCreatedController';
import { VaultUpdatedEvent, VaultUpdatedEventDetail } from '../../controllers/eventBridge/vault/VaultUpdatedController';
import { AffiliateConfigurationHelper } from '../../helpers/affiliate/AffiliateConfiguration';
import {
  IRedemptionsRepository,
  RedemptionsRepository,
  UpdateRedemption,
} from '../../repositories/RedemptionsRepository';
import { IVaultsRepository, NewVault, UpdateVault, Vault, VaultsRepository } from '../../repositories/VaultsRepository';

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
          companyId: detail.companyId,
          platform: detail.platform,
        },
      });
      throw new Error(
        `Vault Update - Redemption find one by offer id failed: Redemption not found (offerId=${detail.offerId})`,
      );
    }
    //TODO: refactor logic here so that we are checking vault results are undefined and apply logic from line 151
    let vaultId = 'VAULT_NOT_EXIST';
    const vault = await this.vaultsRepo.findOneByRedemptionId(redemption.id);
    if (vault) {
      vaultId = vault.id;
    }

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const vaultTransaction = this.vaultsRepo.withTransaction(transactionConnection);
      const redemptionTransaction = this.redemptionsRepo.withTransaction(transactionConnection);
      const redemptionData = this.makeRedemptionsData(detail);
      const redemptionUpdate = await redemptionTransaction.updateOneByOfferId(detail.offerId, redemptionData);

      if (!redemptionUpdate) {
        this.logger.error({
          message: 'Vault Update - Redemption update by offer id failed: No redemptions found',
          context: {
            redemptionId: redemption.id,
            offerId: detail.offerId,
            companyId: detail.companyId,
            platform: detail.platform,
          },
        });
        throw new Error(
          `Vault Update - Redemption update by offer id failed: No redemptions found (offerId="${detail.offerId}")`,
        );
      }

      if (vaultId === 'VAULT_NOT_EXIST') {
        //vault does not exist, so may have been data sync issue in the past, so create it now
        const vaultData: NewVault = {
          alertBelow: detail.alertBelow,
          status: detail.vaultStatus ? 'active' : 'in-active',
          maxPerUser: detail.maxPerUser,
          showQR: detail.showQR,
          email: detail.adminEmail,
          redemptionId: redemption.id,
          vaultType: 'legacy',
          ...this.getIntegrationsSettings(detail),
        };
        const vaultInsert = await vaultTransaction.create(vaultData);

        if (!vaultInsert) {
          this.logger.error({
            message: 'Vault Update - Vault create failed: No vaults were created',
            context: {
              offerId: detail.offerId,
              companyId: detail.companyId,
              platform: detail.platform,
            },
          });
          throw new Error('Vault Update - Vault create failed: No vaults were created');
        }
      } else {
        //vault exists, so update it
        const vaultData: UpdateVault = {
          alertBelow: detail.alertBelow,
          status: detail.vaultStatus ? 'active' : 'in-active',
          maxPerUser: detail.maxPerUser,
          showQR: detail.showQR,
          email: detail.adminEmail,
          redemptionId: redemption.id,
          vaultType: 'legacy',
          ...this.getIntegrationsSettings(detail),
        };
        const vaultUpdated = await vaultTransaction.updateOneById(vaultId, vaultData);

        if (!vaultUpdated) {
          this.logger.error({
            message: 'Vault Update - Vault update failed: No vaults were updated',
            context: {
              redemptionId: redemption.id,
              offerId: detail.offerId,
              companyId: detail.companyId,
              platform: detail.platform,
            },
          });
          throw new Error(`Vault Update - Vault create failed: No vaults were updated (redemptionId=${redemption.id})`);
        }
      }
    });
  }

  public async createVault(event: VaultCreatedEvent): Promise<void> {
    const { detail } = event;

    const redemption = await this.redemptionsRepo.findOneByOfferId(detail.offerId);
    if (!redemption) {
      this.logger.error({
        message: 'Vault create - Redemption find one by offer id failed: Redemption not found',
        context: {
          offerId: detail.offerId,
          companyId: detail.companyId,
          platform: detail.platform,
        },
      });
      throw new Error(
        `Vault Create - Redemption find one by offer id failed: No redemptions found (offerId="${detail.offerId}")`,
      );
    }

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const vaultTransaction = this.vaultsRepo.withTransaction(transactionConnection);
      const redemptionTransaction = this.redemptionsRepo.withTransaction(transactionConnection);
      const redemptionData = this.makeRedemptionsData(detail);
      const redemptionUpdate = await redemptionTransaction.updateOneByOfferId(detail.offerId, redemptionData);

      if (!redemptionUpdate) {
        this.logger.error({
          message: 'Vault Create - Redemption update by offer id failed: No redemptions found',
          context: {
            offerId: detail.offerId,
            companyId: detail.companyId,
            platform: detail.platform,
          },
        });
        throw new Error(
          `Vault Create - Redemption update by offer id failed: No redemptions found (offerId="${detail.offerId}")`,
        );
      }

      const vaultData: NewVault = {
        alertBelow: detail.alertBelow,
        status: detail.vaultStatus ? 'active' : 'in-active',
        maxPerUser: detail.maxPerUser,
        showQR: detail.showQR,
        email: detail.adminEmail,
        redemptionId: redemption.id,
        vaultType: 'legacy',
        ...this.getIntegrationsSettings(detail),
      };
      const vaultInsert = await vaultTransaction.create(vaultData);

      if (!vaultInsert) {
        this.logger.error({
          message: 'Vault Create - Vault create failed: No vaults were created',
          context: {
            offerId: detail.offerId,
            companyId: detail.companyId,
            platform: detail.platform,
          },
        });
        throw new Error('Vault Create - Vault create failed: No vaults were created');
      }
    });
  }

  private makeRedemptionsData(detail: VaultCreatedEventDetail | VaultUpdatedEventDetail): UpdateRedemption {
    if (!detail.link) {
      return {
        redemptionType: 'vaultQR',
        connection: 'none',
        affiliate: null,
        url: null,
        offerType: 'in-store',
      };
    }

    const affiliateConfiguration = new AffiliateConfigurationHelper(detail.link).getConfig();
    if (affiliateConfiguration) {
      return {
        redemptionType: 'vault',
        connection: 'affiliate',
        affiliate: affiliateConfiguration.affiliate,
        url: detail.link,
        offerType: 'online',
      };
    }

    return {
      redemptionType: 'vault',
      connection: 'direct',
      affiliate: null,
      url: detail.link,
      offerType: 'online',
    };
  }

  private getIntegrationsSettings(
    detail: VaultCreatedEventDetail | VaultUpdatedEventDetail,
  ): Pick<Vault, 'integration' | 'integrationId'> | undefined {
    if (detail?.eeCampaignId) {
      return {
        integration: 'eagleeye',
        integrationId: detail?.eeCampaignId,
      };
    }

    if (detail?.ucCampaignId) {
      return {
        integration: 'uniqodo',
        integrationId: detail?.ucCampaignId,
      };
    }

    return {
      integration: null,
      integrationId: null,
    };
  }
}
