import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { VaultCreatedEvent, VaultCreatedEventDetail } from '../../controllers/eventBridge/vault/VaultCreatedController';
import { VaultUpdatedEvent, VaultUpdatedEventDetail } from '../../controllers/eventBridge/vault/VaultUpdatedController';
import { AffiliateConfigurationHelper } from '../../helpers/affiliate/AffiliateConfiguration';
import {
  IRedemptionConfigRepository,
  RedemptionConfigEntity,
  RedemptionConfigIdEntity,
  RedemptionConfigRepository,
  UpdateRedemptionConfigEntity,
} from '../../repositories/RedemptionConfigRepository';
import {
  IVaultsRepository,
  NewVaultEntity,
  UpdateVaultEntity,
  VaultEntity,
  VaultsRepository,
} from '../../repositories/VaultsRepository';

export interface IVaultService {
  updateVault(event: VaultUpdatedEvent): Promise<void>;
  createVault(event: VaultCreatedEvent): Promise<void>;
}

export class VaultService implements IVaultService {
  static readonly key = 'VaultService';
  static readonly inject = [
    Logger.key,
    RedemptionConfigRepository.key,
    VaultsRepository.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: IRedemptionConfigRepository,
    private readonly vaultsRepo: IVaultsRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  public async updateVault(event: VaultUpdatedEvent): Promise<void> {
    const { detail } = event;

    const redemptionConfigEntity: RedemptionConfigEntity | null =
      await this.redemptionConfigRepository.findOneByOfferId(detail.offerId);

    if (!redemptionConfigEntity) {
      this.logger.error({
        message: 'Vault Update - Redemption find one by offer id failed: Redemption not found',
        context: {
          offerId: detail.offerId,
          companyId: detail.companyId,
        },
      });
      throw new Error(
        `Vault Update - Redemption find one by offer id failed: Redemption not found (offerId=${detail.offerId})`,
      );
    }
    //TODO: refactor logic here so that we are checking vault results are undefined and apply logic from line 151
    let vaultId = 'VAULT_NOT_EXIST';
    const vault = await this.vaultsRepo.findOneByRedemptionId(redemptionConfigEntity.id);
    if (vault) {
      vaultId = vault.id;
    }

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const vaultTransaction = this.vaultsRepo.withTransaction(transactionConnection);
      const redemptionTransaction = this.redemptionConfigRepository.withTransaction(transactionConnection);
      const redemptionData = this.makeRedemptionsData(detail);

      const redemptionIdEntity: RedemptionConfigIdEntity | null = await redemptionTransaction.updateOneByOfferId(
        detail.offerId,
        redemptionData,
      );

      if (!redemptionIdEntity) {
        this.logger.error({
          message: 'Vault Update - Redemption update by offer id failed: No redemptions found',
          context: {
            redemptionId: redemptionConfigEntity.id,
            offerId: detail.offerId,
            companyId: detail.companyId,
          },
        });
        throw new Error(
          `Vault Update - Redemption update by offer id failed: No redemptions found (offerId="${detail.offerId}")`,
        );
      }

      if (vaultId === 'VAULT_NOT_EXIST') {
        //vault does not exist, so may have been data sync issue in the past, so create it now
        const vaultData: NewVaultEntity = {
          alertBelow: detail.alertBelow,
          status: detail.vaultStatus ? 'active' : 'in-active',
          maxPerUser: detail.maxPerUser,
          showQR: detail.showQR,
          email: detail.adminEmail,
          redemptionId: redemptionConfigEntity.id,
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
            },
          });
          throw new Error('Vault Update - Vault create failed: No vaults were created');
        }
      } else {
        //vault exists, so update it
        const vaultData: UpdateVaultEntity = {
          alertBelow: detail.alertBelow,
          status: detail.vaultStatus ? 'active' : 'in-active',
          maxPerUser: detail.maxPerUser,
          showQR: detail.showQR,
          email: detail.adminEmail,
          redemptionId: redemptionConfigEntity.id,
          vaultType: 'legacy',
          ...this.getIntegrationsSettings(detail),
        };
        const vaultUpdated = await vaultTransaction.updateOneById(vaultId, vaultData);

        if (!vaultUpdated) {
          this.logger.error({
            message: 'Vault Update - Vault update failed: No vaults were updated',
            context: {
              redemptionId: redemptionConfigEntity.id,
              offerId: detail.offerId,
              companyId: detail.companyId,
            },
          });
          throw new Error(
            `Vault Update - Vault create failed: No vaults were updated (redemptionId=${redemptionConfigEntity.id})`,
          );
        }
      }
    });
  }

  public async createVault(event: VaultCreatedEvent): Promise<void> {
    const { detail } = event;

    const redemptionConfigEntity: RedemptionConfigEntity | null =
      await this.redemptionConfigRepository.findOneByOfferId(detail.offerId);
    if (!redemptionConfigEntity) {
      this.logger.error({
        message: 'Vault create - Redemption find one by offer id failed: Redemption not found',
        context: {
          offerId: detail.offerId,
          companyId: detail.companyId,
        },
      });
      throw new Error(
        `Vault Create - Redemption find one by offer id failed: No redemptions found (offerId="${detail.offerId}")`,
      );
    }

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const vaultTransaction = this.vaultsRepo.withTransaction(transactionConnection);
      const redemptionTransaction = this.redemptionConfigRepository.withTransaction(transactionConnection);
      const redemptionData = this.makeRedemptionsData(detail);

      const redemptionIdEntity: RedemptionConfigIdEntity | null = await redemptionTransaction.updateOneByOfferId(
        detail.offerId,
        redemptionData,
      );

      if (!redemptionIdEntity) {
        this.logger.error({
          message: 'Vault Create - Redemption update by offer id failed: No redemptions found',
          context: {
            offerId: detail.offerId,
            companyId: detail.companyId,
          },
        });
        throw new Error(
          `Vault Create - Redemption update by offer id failed: No redemptions found (offerId="${detail.offerId}")`,
        );
      }

      const vaultData: NewVaultEntity = {
        alertBelow: detail.alertBelow,
        status: detail.vaultStatus ? 'active' : 'in-active',
        maxPerUser: detail.maxPerUser,
        showQR: detail.showQR,
        email: detail.adminEmail,
        redemptionId: redemptionConfigEntity.id,
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
          },
        });
        throw new Error('Vault Create - Vault create failed: No vaults were created');
      }
    });
  }

  private makeRedemptionsData(detail: VaultCreatedEventDetail | VaultUpdatedEventDetail): UpdateRedemptionConfigEntity {
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
  ): Pick<VaultEntity, 'integration' | 'integrationId'> | undefined {
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
