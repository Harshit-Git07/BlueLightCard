import { z } from 'zod';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { ParsedRequest } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import {
  PatchGenericModel,
  PatchPreAppliedModel,
  PatchShowCardModel,
} from '@blc-mono/redemptions/libs/models/patchRedemptionConfig';

import { GenericEntity, GenericsRepository, UpdateGenericEntity } from '../../repositories/GenericsRepository';
import {
  RedemptionConfigEntity,
  RedemptionConfigRepository,
  UpdateRedemptionConfigEntity,
} from '../../repositories/RedemptionConfigRepository';
import { VaultBatchEntity } from '../../repositories/VaultBatchesRepository';
import { VaultEntity } from '../../repositories/VaultsRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

export type UpdateRedemptionConfigError = {
  kind: 'Error' | 'RedemptionNotFound' | 'GenericNotFound';
  data: {
    message: string;
  };
};

export type UpdateRedemptionConfigSuccess = {
  kind: 'Ok';
  data: RedemptionConfig;
};

export type UpdateShowCardRedemptionSchema = z.infer<typeof PatchShowCardModel>;
export type UpdatePreAppliedRedemptionSchema = z.infer<typeof PatchPreAppliedModel>;
export type UpdateGenericRedemptionSchema = z.infer<typeof PatchGenericModel>;

let requestPayload: UpdateShowCardRedemptionSchema | UpdatePreAppliedRedemptionSchema | UpdateGenericRedemptionSchema;

export interface IUpdateRedemptionConfigService {
  updateRedemptionConfig(
    request: ParsedRequest['body'],
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError>;
}

export class UpdateRedemptionConfigService implements IUpdateRedemptionConfigService {
  static readonly key = 'UpdateRedemptionConfigService';
  static readonly inject = [
    Logger.key,
    RedemptionConfigRepository.key,
    GenericsRepository.key,
    RedemptionConfigTransformer.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: RedemptionConfigRepository,
    private readonly genericsRepository: GenericsRepository,
    private readonly redemptionConfigTransformer: RedemptionConfigTransformer,
    private readonly transactionManager: ITransactionManager,
  ) {}

  public async updateRedemptionConfig(
    request: ParsedRequest['body'],
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    requestPayload = request;
    if (!(await this.redemptionConfigRepository.findOneById(request.id))) {
      return this.updateRedemptionConfigError('RedemptionNotFound', request.id, 'redemptionId does not exist');
    }

    return await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };

      const redemptionTransaction = this.redemptionConfigRepository.withTransaction(transactionConnection);
      const genericsTransaction = this.genericsRepository.withTransaction(transactionConnection);
      switch (request.redemptionType) {
        case 'showCard':
          return await this.updateShowCard(request as UpdateShowCardRedemptionSchema, redemptionTransaction);
        case 'preApplied':
          return await this.updatePreApplied(request as UpdatePreAppliedRedemptionSchema, redemptionTransaction);
        case 'generic':
          return await this.updateGeneric(
            request as UpdateGenericRedemptionSchema,
            redemptionTransaction,
            genericsTransaction,
          );
        case 'vault':
        case 'vaultQR':
          return this.updateRedemptionConfigError(
            'Error',
            request.id,
            `${request.redemptionType} offer update is under construction`,
          );
        default:
          return this.updateRedemptionConfigError(
            'Error',
            request.id,
            `${request.redemptionType} is an unrecognised redemptionType`,
          );
      }
    });
  }

  private async updateShowCard(
    request: UpdateShowCardRedemptionSchema,
    redemptionTransaction: RedemptionConfigRepository,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const redemptionPayload: UpdateRedemptionConfigEntity = {
      affiliate: request.affiliate,
      connection: request.connection,
    };

    return await this.updateRedemption(request.id, redemptionPayload, redemptionTransaction, null, null, []);
  }

  private async updatePreApplied(
    request: UpdatePreAppliedRedemptionSchema,
    redemptionTransaction: RedemptionConfigRepository,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const redemptionPayload: UpdateRedemptionConfigEntity = {
      affiliate: request.affiliate,
      connection: request.connection,
      url: request.url,
    };

    return await this.updateRedemption(request.id, redemptionPayload, redemptionTransaction, null, null, []);
  }

  private async updateGeneric(
    request: UpdateGenericRedemptionSchema,
    redemptionTransaction: RedemptionConfigRepository,
    genericsTransaction: GenericsRepository,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const genericRecord = await genericsTransaction.findOneByRedemptionId(request.id);
    if (!genericRecord || genericRecord.id !== request.generic.id) {
      return this.updateRedemptionConfigError(
        'GenericNotFound',
        request.id,
        "generic record does not exist with corresponding id's",
      );
    }

    const genericsPayload: UpdateGenericEntity = {
      code: request.generic.code,
    };

    const genericEntity: GenericEntity | null = await genericsTransaction.updateOneById(
      request.generic.id,
      genericsPayload,
    );

    if (!genericEntity) {
      return this.updateRedemptionConfigError('Error', request.id, 'generics record failed to update');
    }

    const redemptionPayload: UpdateRedemptionConfigEntity = {
      affiliate: request.affiliate,
      connection: request.connection,
      url: request.url,
    };

    return await this.updateRedemption(request.id, redemptionPayload, redemptionTransaction, genericEntity, null, []);
  }

  private async updateRedemption(
    redemptionId: string,
    redemptionPayload: UpdateRedemptionConfigEntity,
    redemptionTransaction: RedemptionConfigRepository,
    genericEntity: GenericEntity | null,
    vaultEntity: VaultEntity | null,
    vaultBatchEntities: VaultBatchEntity[] | [],
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const redemptionConfigEntity: RedemptionConfigEntity | null = await redemptionTransaction.updateOneById(
      redemptionId,
      redemptionPayload,
    );

    if (!redemptionConfigEntity) {
      return this.updateRedemptionConfigError('Error', redemptionId, 'redemption record failed to update');
    }

    return {
      kind: 'Ok',
      data: this.redemptionConfigTransformer.transformToRedemptionConfig({
        redemptionConfigEntity: redemptionConfigEntity,
        genericEntity: genericEntity,
        vaultEntity: vaultEntity,
        vaultBatchEntities: vaultBatchEntities,
      }),
    };
  }

  private updateRedemptionConfigError(
    kind: 'Error' | 'RedemptionNotFound' | 'GenericNotFound',
    redemptionId: string,
    message: string,
  ): UpdateRedemptionConfigError {
    this.logger.error({
      message: message,
      context: {
        redemptionId: redemptionId,
        requestPayload: requestPayload,
      },
    });
    return {
      kind: kind,
      data: {
        message: `Redemption Config Update - ${message}: ${redemptionId}`,
      },
    };
  }
}
