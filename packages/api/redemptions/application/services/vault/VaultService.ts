import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { VaultCreatedEvent } from '../../controllers/eventBridge/vault/VaultCreatedController';
import { VaultEventDetail } from '../../controllers/eventBridge/vault/VaultEventDetail';
import { VaultUpdatedEvent } from '../../controllers/eventBridge/vault/VaultUpdatedController';
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

import { UpdateRedemptionConfigEntityBuilder } from './builders/UpdateRedemptionConfigEntityBuilder';
import { VaultEntityBuilder } from './builders/VaultEntityBuilder';

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
    UpdateRedemptionConfigEntityBuilder.key,
    VaultEntityBuilder.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: IRedemptionConfigRepository,
    private readonly vaultsRepo: IVaultsRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly updateRedemptionConfigEntityBuilder: UpdateRedemptionConfigEntityBuilder,
    private readonly vaultEntityBuilder: VaultEntityBuilder,
  ) {}

  public async createVault(vaultCreatedEvent: VaultCreatedEvent): Promise<void> {
    const vaultEventDetail: VaultEventDetail = vaultCreatedEvent.detail;
    const offerId = vaultEventDetail.offerId;

    this.logger.info({
      message: 'create vault for redemption',
      context: {
        offerId,
        companyId: vaultEventDetail.companyId,
        vaultEventDetail,
      },
    });

    const redemptionConfigEntity: RedemptionConfigEntity = await this.loadRedemptionConfigByOfferId(offerId);

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const vaultTransaction = this.vaultsRepo.withTransaction(transactionConnection);
      const redemptionTransaction = this.redemptionConfigRepository.withTransaction(transactionConnection);

      const updateRedemptionConfigEntity: UpdateRedemptionConfigEntity =
        this.updateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity(vaultEventDetail.link);

      await this.updateRedemptionConfigByOfferId(redemptionTransaction, updateRedemptionConfigEntity, offerId);

      const newVaultEntity: NewVaultEntity = this.vaultEntityBuilder.buildNewVaultEntity(
        vaultEventDetail,
        redemptionConfigEntity.id,
      );
      await this.createNewVault(vaultTransaction, newVaultEntity, offerId);
    });
  }

  public async updateVault(vaultUpdatedEvent: VaultUpdatedEvent): Promise<void> {
    const vaultEventDetail: VaultEventDetail = vaultUpdatedEvent.detail;
    const offerId = vaultEventDetail.offerId;

    this.logger.info({
      message: 'update vault for redemption',
      context: {
        offerId,
        companyId: vaultEventDetail.companyId,
        vaultEventDetail,
      },
    });

    const redemptionConfigEntity: RedemptionConfigEntity = await this.loadRedemptionConfigByOfferId(offerId);

    const redemptionId = redemptionConfigEntity.id;

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const vaultTransaction = this.vaultsRepo.withTransaction(transactionConnection);
      const redemptionTransaction = this.redemptionConfigRepository.withTransaction(transactionConnection);
      const updateRedemptionConfigEntity: UpdateRedemptionConfigEntity =
        this.updateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity(vaultEventDetail.link);

      await this.updateRedemptionConfigByOfferId(redemptionTransaction, updateRedemptionConfigEntity, offerId);

      const vault = await this.vaultsRepo.findOneByRedemptionId(redemptionId);

      if (!vault) {
        //vault does not exist, so may have been data sync issue in the past, so create it now
        const newVaultEntity: NewVaultEntity = this.vaultEntityBuilder.buildNewVaultEntity(
          vaultEventDetail,
          redemptionId,
        );

        await this.createNewVault(vaultTransaction, newVaultEntity, offerId);
      } else {
        //vault exists, so update it
        const updateVaultEntity: UpdateVaultEntity = this.vaultEntityBuilder.buildUpdateVaultEntity(
          vaultEventDetail,
          redemptionId,
        );
        await this.updateVaultByVaultId(vaultTransaction, vault.id, updateVaultEntity, offerId);
      }
    });
  }

  private async updateRedemptionConfigByOfferId(
    redemptionTransaction: IRedemptionConfigRepository,
    updateRedemptionConfigEntity: UpdateRedemptionConfigEntity,
    offerId: string,
  ) {
    const redemptionIdEntity: RedemptionConfigIdEntity | null = await redemptionTransaction.updateOneByOfferId(
      offerId,
      updateRedemptionConfigEntity,
    );

    if (!redemptionIdEntity) {
      this.logger.error({
        message: 'Redemption update by offer id failed: No redemptions found',
        context: {
          offerId,
          updateRedemptionConfigEntity,
        },
      });
      throw new Error(`Redemption update by offer id failed: No redemptions found (offerId="${offerId}")`);
    }
  }

  private async loadRedemptionConfigByOfferId(offerId: string) {
    const redemptionConfigEntity: RedemptionConfigEntity | null =
      await this.redemptionConfigRepository.findOneByOfferId(offerId);

    if (!redemptionConfigEntity) {
      this.logger.error({
        message: 'Redemption find one by offer id failed: Redemption not found',
        context: {
          offerId,
        },
      });
      throw new Error(`Redemption find one by offer id failed: No redemptions found (offerId="${offerId}")`);
    }
    return redemptionConfigEntity;
  }

  private async createNewVault(vaultTransaction: VaultsRepository, newVaultEntity: NewVaultEntity, offerId: string) {
    const vaultInsert: VaultEntity = await vaultTransaction.create(newVaultEntity);

    if (!vaultInsert) {
      this.logger.error({
        message: 'Vault create failed: No vaults were created',
        context: {
          offerId,
          newVaultEntity,
        },
      });
      throw new Error(`Vault create failed: No vaults were created (offerId="${offerId}")`);
    }
  }

  private async updateVaultByVaultId(
    vaultTransaction: VaultsRepository,
    vaultId: string,
    updateVaultEntity: UpdateVaultEntity,
    offerId: string,
  ) {
    const vaultUpdated = await vaultTransaction.updateOneById(vaultId, updateVaultEntity);

    if (!vaultUpdated) {
      this.logger.error({
        message: 'Vault update failed: No vaults were updated',
        context: {
          offerId,
          updateVaultEntity,
        },
      });
      throw new Error(`Vault update failed: No vaults were updated (offerId="${offerId}")`);
    }
  }
}
