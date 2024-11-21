import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { NewRedemptionConfigEntityTransformer } from '@blc-mono/redemptions/application/transformers/NewRedemptionConfigEntityTransformer';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import {
  BallotModel,
  PostRedemptionConfigModel,
  VaultModel,
} from '@blc-mono/redemptions/libs/models/postRedemptionConfig';

import { BallotEntity, BallotsRepository, NewBallotEntity } from '../../repositories/BallotsRepository';
import { GenericEntity, GenericsRepository, NewGenericEntity } from '../../repositories/GenericsRepository';
import {
  NewRedemptionConfigEntity,
  RedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../../repositories/RedemptionConfigRepository';
import { NewVaultEntity, VaultEntity, VaultsRepository } from '../../repositories/VaultsRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

type CreateRedemptionConfigResponse = {
  kind: 'Ok';
  data: RedemptionConfig;
};

export class FailedToCreateError extends Error {
  public name = 'FailedToCreateError';

  constructor(
    public readonly type: string,
    public readonly message: string,
  ) {
    super(message);
  }
}

export class DuplicateError extends Error {
  public name = 'DuplicateError';

  constructor(
    public readonly offerId: string,
    public readonly message: string,
  ) {
    super(message);
  }
}

export interface ICreateRedemptionConfigService {
  createRedemptionConfig(postRedemptionConfigModel: PostRedemptionConfigModel): Promise<CreateRedemptionConfigResponse>;
}

export class CreateRedemptionConfigService implements ICreateRedemptionConfigService {
  static readonly key = 'CreateRedemptionConfigService';
  static readonly inject = [
    Logger.key,
    RedemptionConfigRepository.key,
    GenericsRepository.key,
    VaultsRepository.key,
    RedemptionConfigTransformer.key,
    NewRedemptionConfigEntityTransformer.key,
    BallotsRepository.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: RedemptionConfigRepository,
    private readonly genericsRepository: GenericsRepository,
    private readonly vaultsRepository: VaultsRepository,
    private readonly redemptionConfigTransformer: RedemptionConfigTransformer,
    private readonly newRedemptionConfigEntityTransformer: NewRedemptionConfigEntityTransformer,
    private readonly ballotsRepository: BallotsRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  public async createRedemptionConfig(
    postRedemptionConfigModel: PostRedemptionConfigModel,
  ): Promise<CreateRedemptionConfigResponse> {
    const { redemptionType } = postRedemptionConfigModel;
    let genericEntity: GenericEntity | null = null;
    let vaultEntity: VaultEntity | null = null;
    let ballotEntity: BallotEntity | null = null;

    if (await this.redemptionConfigRepository.findOneByOfferId(postRedemptionConfigModel.offerId))
      throw new DuplicateError(
        postRedemptionConfigModel.offerId.toString(),
        'RedemptionConfig already exists for this offerId',
      );

    return await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const transactionalRedemptionConfigRepository =
        this.redemptionConfigRepository.withTransaction(transactionConnection);
      const transactionalGenericsRepository = this.genericsRepository.withTransaction(transactionConnection);
      const transactionalVaultsRepository = this.vaultsRepository.withTransaction(transactionConnection);
      const transactionalBallotsRepository = this.ballotsRepository.withTransaction(transactionConnection);
      const redemptionConfigEntity: RedemptionConfigEntity = await this.createRedemptionConfigEntity(
        postRedemptionConfigModel,
        postRedemptionConfigModel.offerId,
        transactionalRedemptionConfigRepository,
      );

      switch (redemptionType) {
        case REDEMPTION_TYPES[3]: //showcard
        case REDEMPTION_TYPES[4]: //preapplied
        case REDEMPTION_TYPES[6]: //giftcard
        case REDEMPTION_TYPES[7]: //creditCard
        case REDEMPTION_TYPES[8]: //verify
          break;
        case REDEMPTION_TYPES[0]: //generic
          genericEntity = await this.createGenericEntity(
            postRedemptionConfigModel.generic.code,
            redemptionConfigEntity.id,
            transactionalGenericsRepository,
          );
          break;
        case REDEMPTION_TYPES[1]: //vault
        case REDEMPTION_TYPES[2]: //vaultqr
          vaultEntity = await this.createVaultEntity(
            postRedemptionConfigModel.redemptionType,
            postRedemptionConfigModel.vault,
            redemptionConfigEntity.id,
            transactionalVaultsRepository,
          );
          break;
        case REDEMPTION_TYPES[5]: //ballot
          ballotEntity = await this.createBallotEntity(
            postRedemptionConfigModel.ballot,
            redemptionConfigEntity.id,
            transactionalBallotsRepository,
          );
          break;
        default:
          exhaustiveCheck(redemptionType, 'Unsupported redemption type');
      }

      return {
        kind: 'Ok',
        data: this.redemptionConfigTransformer.transformToRedemptionConfig({
          redemptionConfigEntity: redemptionConfigEntity,
          genericEntity: genericEntity,
          vaultEntity: vaultEntity,
          vaultBatchEntities: [],
          ballotEntity: ballotEntity,
        }),
      };
    });
  }

  private async createRedemptionConfigEntity(
    postRedemptionConfigModel: PostRedemptionConfigModel,
    offerId: string,
    transactionalRedemptionConfigRepository: RedemptionConfigRepository,
  ) {
    const redemptionConfigEntity: NewRedemptionConfigEntity =
      this.newRedemptionConfigEntityTransformer.transformToNewRedemptionConfigEntity(postRedemptionConfigModel);

    try {
      return await transactionalRedemptionConfigRepository.createRedemption(redemptionConfigEntity);
    } catch (e) {
      this.logger.error({
        message: 'Failed to create redemption with given offerId',
        context: {
          offerId: offerId,
        },
      });
      throw new FailedToCreateError('createRedemptionConfigEntity', 'Failed to create redemption with given offerId');
    }
  }

  public async createGenericEntity(
    genericCode: string,
    redemptionId: string,
    transactionalGenericsRepository: GenericsRepository,
  ) {
    const genericEntity: NewGenericEntity = {
      code: genericCode,
      redemptionId: redemptionId,
    };
    try {
      return await transactionalGenericsRepository.createGeneric(genericEntity);
    } catch (e) {
      throw new FailedToCreateError('createGenericEntity', 'Failed to create generic');
    }
  }

  public async createVaultEntity(
    redemptionType: 'vault' | 'vaultQR',
    vault: VaultModel,
    redemptionId: string,
    transactionalVaultsRepository: VaultsRepository,
  ) {
    const vaultEntity: NewVaultEntity = {
      redemptionId: redemptionId,
      alertBelow: vault.alertBelow,
      email: vault.email,
      integration: vault.integration,
      integrationId: vault.integrationId,
      maxPerUser: vault.maxPerUser,
      showQR: redemptionType === 'vaultQR',
      status: vault.status,
      vaultType: 'standard',
    };

    try {
      return await transactionalVaultsRepository.create(vaultEntity);
    } catch (e) {
      throw new FailedToCreateError('createVaultEntity', 'Failed to create vault');
    }
  }

  public async createBallotEntity(
    ballot: BallotModel,
    redemptionId: string,
    transactionalBallotsRepository: BallotsRepository,
  ) {
    const ballotEntity: NewBallotEntity = {
      redemptionId: redemptionId,
      drawDate: new Date(ballot.drawDate),
      eventDate: new Date(ballot.eventDate),
      offerName: ballot.offerName,
      totalTickets: ballot.totalTickets,
    };

    try {
      return await transactionalBallotsRepository.create(ballotEntity);
    } catch (e) {
      throw new FailedToCreateError('createBallotEntity', 'Failed to create ballot');
    }
  }
}
