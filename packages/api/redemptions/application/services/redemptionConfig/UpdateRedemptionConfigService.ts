import {
  BALLOT,
  COMPARE,
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  REDEMPTION_TYPES,
  SHOWCARD,
  VAULT,
  VAULTQR,
  VERIFY,
} from '@blc-mono/core/constants/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { Affiliate, RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import {
  PatchRedemptionConfigBallotModel,
  PatchRedemptionConfigCompareModel,
  PatchRedemptionConfigGenericModel,
  PatchRedemptionConfigGiftCardModel,
  PatchRedemptionConfigModel,
  PatchRedemptionConfigPreAppliedModel,
  PatchRedemptionConfigShowCardModel,
  PatchRedemptionConfigVaultModel,
  PatchRedemptionConfigVaultQRModel,
  PatchRedemptionConfigVerifyModel,
} from '@blc-mono/redemptions/libs/models/patchRedemptionConfig';

import { BallotEntity, BallotsRepository, UpdateBallotEntity } from '../../repositories/BallotsRepository';
import { GenericEntity, GenericsRepository, UpdateGenericEntity } from '../../repositories/GenericsRepository';
import {
  RedemptionConfigEntity,
  RedemptionConfigRepository,
  UpdateRedemptionConfigEntity,
} from '../../repositories/RedemptionConfigRepository';
import { VaultBatchEntity, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { UpdateVaultEntity, VaultEntity, VaultsRepository } from '../../repositories/VaultsRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

export type UpdateRedemptionConfigError = {
  kind:
    | 'Error'
    | 'UrlPayloadOfferIdMismatch'
    | 'RedemptionNotFound'
    | 'RedemptionOfferCompanyIdMismatch'
    | 'RedemptionTypeMismatch'
    | 'GenericNotFound'
    | 'GenericCodeEmpty'
    | 'VaultNotFound'
    | 'MaxPerUserError'
    | 'BallotNotFound';
  data: {
    message: string;
  };
};

export type UpdateRedemptionConfigSuccess = {
  kind: 'Ok';
  data: RedemptionConfig;
};

export interface IUpdateRedemptionConfigService {
  updateRedemptionConfig(
    offerId: string,
    patchRedemptionConfigModel: PatchRedemptionConfigModel,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError>;
}

export class UpdateRedemptionConfigService implements IUpdateRedemptionConfigService {
  static readonly key = 'UpdateRedemptionConfigService';
  static readonly inject = [
    Logger.key,
    RedemptionConfigRepository.key,
    GenericsRepository.key,
    VaultsRepository.key,
    VaultBatchesRepository.key,
    BallotsRepository.key,
    RedemptionConfigTransformer.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: RedemptionConfigRepository,
    private readonly genericsRepository: GenericsRepository,
    private readonly vaultsRepository: VaultsRepository,
    private readonly vaultBatchesRepository: VaultBatchesRepository,
    private readonly ballotsRepository: BallotsRepository,
    private readonly redemptionConfigTransformer: RedemptionConfigTransformer,
    private readonly transactionManager: ITransactionManager,
  ) {}

  public async updateRedemptionConfig(
    offerId: string,
    patchRedemptionConfigModel: PatchRedemptionConfigModel,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    if (offerId !== String(patchRedemptionConfigModel.offerId)) {
      return this.updateRedemptionConfigError(
        'UrlPayloadOfferIdMismatch',
        patchRedemptionConfigModel,
        'offerId in URL and payload do not match',
      );
    }

    const existingRedemptionConfigEntity: RedemptionConfigEntity | null =
      await this.redemptionConfigRepository.findOneById(patchRedemptionConfigModel.id);

    if (!existingRedemptionConfigEntity) {
      return this.updateRedemptionConfigError(
        'RedemptionNotFound',
        patchRedemptionConfigModel,
        'redemptionId does not exist',
      );
    }

    if (
      patchRedemptionConfigModel.offerId !== existingRedemptionConfigEntity.offerId ||
      patchRedemptionConfigModel.companyId !== existingRedemptionConfigEntity.companyId
    ) {
      return this.updateRedemptionConfigError(
        'RedemptionOfferCompanyIdMismatch',
        patchRedemptionConfigModel,
        'offerId/companyId do not match for this redemption',
      );
    }

    if (patchRedemptionConfigModel.redemptionType !== existingRedemptionConfigEntity.redemptionType) {
      return this.updateRedemptionConfigError(
        'RedemptionTypeMismatch',
        patchRedemptionConfigModel,
        'redemption type do not match for this redemption',
      );
    }

    return await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };

      const redemptionTransaction = this.redemptionConfigRepository.withTransaction(transactionConnection);
      const genericsTransaction = this.genericsRepository.withTransaction(transactionConnection);
      const vaultsTransaction = this.vaultsRepository.withTransaction(transactionConnection);
      const ballotsTransaction = this.ballotsRepository.withTransaction(transactionConnection);

      switch (patchRedemptionConfigModel.redemptionType) {
        case SHOWCARD:
          return await this.updateShowCard(patchRedemptionConfigModel, redemptionTransaction);
        case PREAPPLIED:
        case GIFTCARD:
        case COMPARE:
        case VERIFY:
          return await this.updateAffiliateTypes(patchRedemptionConfigModel, redemptionTransaction);
        case GENERIC:
          return await this.updateGeneric(patchRedemptionConfigModel, redemptionTransaction, genericsTransaction);
        case VAULT:
        case VAULTQR:
          return await this.updateVaultOrVaultQR(
            patchRedemptionConfigModel,
            redemptionTransaction,
            vaultsTransaction,
            patchRedemptionConfigModel.redemptionType,
          );
        case BALLOT:
          return await this.updateBallot(patchRedemptionConfigModel, redemptionTransaction, ballotsTransaction);
        default:
          exhaustiveCheck(patchRedemptionConfigModel, 'Unhandled redemptionType');
      }
    });
  }

  private async updateBallot(
    patchRedemptionConfigBallotModel: PatchRedemptionConfigBallotModel,
    redemptionTransaction: RedemptionConfigRepository,
    ballotsTransaction: BallotsRepository,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const existingBallotEntity: BallotEntity | null = await ballotsTransaction.findOneByRedemptionId(
      patchRedemptionConfigBallotModel.id,
    );

    if (existingBallotEntity?.id !== patchRedemptionConfigBallotModel.ballot.id) {
      return this.updateRedemptionConfigError(
        'BallotNotFound',
        patchRedemptionConfigBallotModel,
        "ballot record does not exist with corresponding id's",
      );
    }

    const updateBallotEntity: UpdateBallotEntity = {
      totalTickets: patchRedemptionConfigBallotModel.ballot.totalTickets,
      drawDate: new Date(patchRedemptionConfigBallotModel.ballot.drawDate),
      eventDate: new Date(patchRedemptionConfigBallotModel.ballot.eventDate),
      offerName: patchRedemptionConfigBallotModel.ballot.offerName,
    };

    const ballotId: Partial<Pick<BallotEntity, 'id'>> | undefined = await ballotsTransaction.updateOneById(
      patchRedemptionConfigBallotModel.ballot.id,
      updateBallotEntity,
    );

    if (!ballotId) {
      return this.updateRedemptionConfigError(
        'Error',
        patchRedemptionConfigBallotModel,
        'ballot record failed to update',
      );
    }

    const ballotEntity: BallotEntity | null = await ballotsTransaction.findOneById(
      patchRedemptionConfigBallotModel.ballot.id,
    );

    const updateRedemptionConfigEntity: UpdateRedemptionConfigEntity = {
      affiliate: patchRedemptionConfigBallotModel.affiliate as Affiliate,
      connection: patchRedemptionConfigBallotModel.connection,
      url: patchRedemptionConfigBallotModel.url,
    };

    return await this.updateRedemption(
      patchRedemptionConfigBallotModel,
      updateRedemptionConfigEntity,
      redemptionTransaction,
      null,
      null,
      [],
      ballotEntity,
    );
  }

  private async updateShowCard(
    patchRedemptionConfigShowCardModel: PatchRedemptionConfigShowCardModel,
    redemptionTransaction: RedemptionConfigRepository,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const updateRedemptionConfigEntity: UpdateRedemptionConfigEntity = {
      affiliate: patchRedemptionConfigShowCardModel.affiliate,
      connection: patchRedemptionConfigShowCardModel.connection,
    };

    return await this.updateRedemption(
      patchRedemptionConfigShowCardModel,
      updateRedemptionConfigEntity,
      redemptionTransaction,
      null,
      null,
      [],
      null,
    );
  }

  private async updateAffiliateTypes(
    patchRedemptionConfigAffiliateModel:
      | PatchRedemptionConfigPreAppliedModel
      | PatchRedemptionConfigGiftCardModel
      | PatchRedemptionConfigCompareModel
      | PatchRedemptionConfigVerifyModel,
    redemptionTransaction: RedemptionConfigRepository,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const updateRedemptionConfigEntity: UpdateRedemptionConfigEntity = {
      affiliate: patchRedemptionConfigAffiliateModel.affiliate,
      connection: patchRedemptionConfigAffiliateModel.connection,
      url: patchRedemptionConfigAffiliateModel.url,
    };

    return await this.updateRedemption(
      patchRedemptionConfigAffiliateModel,
      updateRedemptionConfigEntity,
      redemptionTransaction,
      null,
      null,
      [],
      null,
    );
  }

  private async updateGeneric(
    patchRedemptionConfigGenericModel: PatchRedemptionConfigGenericModel,
    redemptionTransaction: RedemptionConfigRepository,
    genericsTransaction: GenericsRepository,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    if (patchRedemptionConfigGenericModel.generic.code === '') {
      return this.updateRedemptionConfigError(
        'GenericCodeEmpty',
        patchRedemptionConfigGenericModel,
        'generic code cannot be blank',
      );
    }

    const existingGenericEntity: GenericEntity | null = await genericsTransaction.findOneByRedemptionId(
      patchRedemptionConfigGenericModel.id,
    );
    if (!existingGenericEntity || existingGenericEntity.id !== patchRedemptionConfigGenericModel.generic.id) {
      return this.updateRedemptionConfigError(
        'GenericNotFound',
        patchRedemptionConfigGenericModel,
        "generic record does not exist with corresponding id's",
      );
    }

    const updateGenericEntity: UpdateGenericEntity = {
      code: patchRedemptionConfigGenericModel.generic.code,
    };

    const genericEntity: GenericEntity | null = await genericsTransaction.updateOneById(
      patchRedemptionConfigGenericModel.generic.id,
      updateGenericEntity,
    );

    if (!genericEntity) {
      return this.updateRedemptionConfigError(
        'Error',
        patchRedemptionConfigGenericModel,
        'generics record failed to update',
      );
    }

    const updateRedemptionConfigEntity: UpdateRedemptionConfigEntity = {
      affiliate: patchRedemptionConfigGenericModel.affiliate,
      connection: patchRedemptionConfigGenericModel.connection,
      url: patchRedemptionConfigGenericModel.url,
    };

    return await this.updateRedemption(
      patchRedemptionConfigGenericModel,
      updateRedemptionConfigEntity,
      redemptionTransaction,
      genericEntity,
      null,
      [],
      null,
    );
  }

  private async updateVaultOrVaultQR(
    patchRedemptionConfigVaultOrVaultQRModel: PatchRedemptionConfigVaultModel | PatchRedemptionConfigVaultQRModel,
    redemptionTransaction: RedemptionConfigRepository,
    vaultsTransaction: VaultsRepository,
    redemptionType: RedemptionType,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const existingVaultEntity: VaultEntity | null = await vaultsTransaction.findOneByRedemptionId(
      patchRedemptionConfigVaultOrVaultQRModel.id,
    );
    if (!existingVaultEntity || existingVaultEntity.id !== patchRedemptionConfigVaultOrVaultQRModel.vault.id) {
      return this.updateRedemptionConfigError(
        'VaultNotFound',
        patchRedemptionConfigVaultOrVaultQRModel,
        "vault record does not exist with corresponding id's",
      );
    }

    if (patchRedemptionConfigVaultOrVaultQRModel.vault.maxPerUser < 1) {
      return this.updateRedemptionConfigError(
        'MaxPerUserError',
        patchRedemptionConfigVaultOrVaultQRModel,
        'max limit per user cannot be less than 1',
      );
    }

    const updateVaultEntity: UpdateVaultEntity = {
      alertBelow: patchRedemptionConfigVaultOrVaultQRModel.vault.alertBelow,
      status: patchRedemptionConfigVaultOrVaultQRModel.vault.status,
      maxPerUser: patchRedemptionConfigVaultOrVaultQRModel.vault.maxPerUser,
      email: patchRedemptionConfigVaultOrVaultQRModel.vault.email,
      integration: patchRedemptionConfigVaultOrVaultQRModel.vault.integration,
      integrationId: patchRedemptionConfigVaultOrVaultQRModel.vault.integrationId,
    };

    const vaultId: Partial<Pick<VaultEntity, 'id'>> | undefined = await vaultsTransaction.updateOneById(
      patchRedemptionConfigVaultOrVaultQRModel.vault.id,
      updateVaultEntity,
    );

    if (!vaultId) {
      return this.updateRedemptionConfigError(
        'Error',
        patchRedemptionConfigVaultOrVaultQRModel,
        'vault record failed to update',
      );
    }

    const vaultBatchEntities: VaultBatchEntity[] = await this.vaultBatchesRepository.findByVaultId(
      patchRedemptionConfigVaultOrVaultQRModel.vault.id,
    );

    const vaultEntity: VaultEntity | null = await vaultsTransaction.findOneById(
      patchRedemptionConfigVaultOrVaultQRModel.vault.id,
    );

    let updateRedemptionConfigEntity: UpdateRedemptionConfigEntity = {
      affiliate: patchRedemptionConfigVaultOrVaultQRModel.affiliate as Affiliate,
      connection: patchRedemptionConfigVaultOrVaultQRModel.connection,
    };

    if (redemptionType !== REDEMPTION_TYPES[2] && 'url' in patchRedemptionConfigVaultOrVaultQRModel) {
      updateRedemptionConfigEntity = {
        ...updateRedemptionConfigEntity,
        url: patchRedemptionConfigVaultOrVaultQRModel.url,
      };
    }

    return await this.updateRedemption(
      patchRedemptionConfigVaultOrVaultQRModel,
      updateRedemptionConfigEntity,
      redemptionTransaction,
      null,
      vaultEntity,
      vaultBatchEntities,
      null,
    );
  }

  private async updateRedemption(
    patchRedemptionConfigModel: PatchRedemptionConfigModel,
    updateRedemptionConfigEntity: UpdateRedemptionConfigEntity,
    redemptionTransaction: RedemptionConfigRepository,
    genericEntity: GenericEntity | null,
    vaultEntity: VaultEntity | null,
    vaultBatchEntities: VaultBatchEntity[] | [],
    ballotEntity: BallotEntity | null,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const redemptionConfigEntity: RedemptionConfigEntity | null = await redemptionTransaction.updateOneById(
      patchRedemptionConfigModel.id,
      updateRedemptionConfigEntity,
    );

    if (!redemptionConfigEntity) {
      return this.updateRedemptionConfigError(
        'Error',
        patchRedemptionConfigModel,
        'redemption record failed to update',
      );
    }

    return {
      kind: 'Ok',
      data: this.redemptionConfigTransformer.transformToRedemptionConfig({
        redemptionConfigEntity: redemptionConfigEntity,
        genericEntity: genericEntity,
        vaultEntity: vaultEntity,
        vaultBatchEntities: vaultBatchEntities,
        ballotEntity: ballotEntity,
      }),
    };
  }

  private updateRedemptionConfigError(
    kind:
      | 'Error'
      | 'UrlPayloadOfferIdMismatch'
      | 'RedemptionNotFound'
      | 'RedemptionOfferCompanyIdMismatch'
      | 'RedemptionTypeMismatch'
      | 'GenericNotFound'
      | 'GenericCodeEmpty'
      | 'VaultNotFound'
      | 'MaxPerUserError'
      | 'BallotNotFound',
    patchRedemptionConfigModel: PatchRedemptionConfigModel,
    message: string,
  ): UpdateRedemptionConfigError {
    this.logger.error({
      message: message,
      context: {
        redemptionId: patchRedemptionConfigModel.id,
        requestPayload: patchRedemptionConfigModel,
      },
    });
    return {
      kind: kind,
      data: {
        message: `Redemption Config Update - ${message}: ${patchRedemptionConfigModel.id}`,
      },
    };
  }
}
