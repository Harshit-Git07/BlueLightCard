import { z } from 'zod';

import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { ParsedRequest } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import {
  Affiliate,
  Integration,
  integrationEnum,
  RedemptionType,
  Status,
} from '@blc-mono/redemptions/libs/database/schema';
import {
  PatchGenericModel,
  PatchPreAppliedModel,
  PatchShowCardModel,
  PatchVaultOrVaultQRModel,
} from '@blc-mono/redemptions/libs/models/patchRedemptionConfig';

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
    | 'GenericNotFound'
    | 'GenericCodeEmpty'
    | 'VaultNotFound';
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
export type UpdateVaultRedemptionSchema = z.infer<typeof PatchVaultOrVaultQRModel>;

let requestPayload:
  | UpdateShowCardRedemptionSchema
  | UpdatePreAppliedRedemptionSchema
  | UpdateGenericRedemptionSchema
  | UpdateVaultRedemptionSchema;

export interface IUpdateRedemptionConfigService {
  updateRedemptionConfig(
    offerId: string,
    request: ParsedRequest['body'],
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
    RedemptionConfigTransformer.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: RedemptionConfigRepository,
    private readonly genericsRepository: GenericsRepository,
    private readonly vaultsRepository: VaultsRepository,
    private readonly vaultBatchesRepository: VaultBatchesRepository,
    private readonly redemptionConfigTransformer: RedemptionConfigTransformer,
    private readonly transactionManager: ITransactionManager,
  ) {}

  public async updateRedemptionConfig(
    offerId: string,
    request: ParsedRequest['body'],
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    requestPayload = request;

    if (offerId !== String(request.offerId)) {
      return this.updateRedemptionConfigError(
        'UrlPayloadOfferIdMismatch',
        request.id,
        'offerId in URL and payload do not match',
      );
    }

    const redemptionConfigEntity = await this.redemptionConfigRepository.findOneById(request.id);

    if (!redemptionConfigEntity) {
      return this.updateRedemptionConfigError('RedemptionNotFound', request.id, 'redemptionId does not exist');
    }

    if (request.offerId !== redemptionConfigEntity.offerId || request.companyId !== redemptionConfigEntity.companyId) {
      return this.updateRedemptionConfigError(
        'RedemptionOfferCompanyIdMismatch',
        request.id,
        'offerId/companyId do not match for this redemption',
      );
    }

    return await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };

      const redemptionTransaction = this.redemptionConfigRepository.withTransaction(transactionConnection);
      const genericsTransaction = this.genericsRepository.withTransaction(transactionConnection);
      const vaultsTransaction = this.vaultsRepository.withTransaction(transactionConnection);
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
          return await this.updateVaultOrVaultQR(
            request as UpdateVaultRedemptionSchema,
            redemptionTransaction,
            vaultsTransaction,
            request.redemptionType,
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
    if (request.generic.code === '') {
      return this.updateRedemptionConfigError('GenericCodeEmpty', request.id, 'generic code cannot be blank');
    }

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

  private async updateVaultOrVaultQR(
    request: UpdateVaultRedemptionSchema,
    redemptionTransaction: RedemptionConfigRepository,
    vaultsTransaction: VaultsRepository,
    redemptionType: RedemptionType,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const vaultRecord = await vaultsTransaction.findOneByRedemptionId(request.id);
    if (!vaultRecord || vaultRecord.id !== request.vault.id) {
      return this.updateRedemptionConfigError(
        'VaultNotFound',
        request.id,
        "vault record does not exist with corresponding id's",
      );
    }

    const vaultPayload: UpdateVaultEntity = {
      alertBelow: request.vault.alertBelow,
      status: request.vault.status as Status,
      maxPerUser: request.vault.maxPerUser,
      email: request.vault.email,
      integration: this.isValidIntegrationType(request.vault.integration)
        ? (request.vault.integration as Integration)
        : null,
      integrationId: this.isValidIntegrationType(request.vault.integration)
        ? Number(request.vault.integrationId)
        : null,
    };

    const vaultId: Partial<Pick<VaultEntity, 'id'>> | undefined = await vaultsTransaction.updateOneById(
      request.vault.id,
      vaultPayload,
    );

    if (!vaultId) {
      return this.updateRedemptionConfigError('Error', request.id, 'vault record failed to update');
    }

    const vaultBatchEntities: VaultBatchEntity[] | [] = await this.vaultBatchesRepository.findByVaultId(
      request.vault.id,
    );

    const vaultEntity: VaultEntity | null = await vaultsTransaction.findOneById(request.vault.id);

    let redemptionPayload: UpdateRedemptionConfigEntity = {
      affiliate: request.affiliate as Affiliate,
      connection: request.connection,
    };

    if (redemptionType !== REDEMPTION_TYPES[2] && 'url' in request) {
      redemptionPayload = { ...redemptionPayload, url: request.url };
    }

    return await this.updateRedemption(
      request.id,
      redemptionPayload,
      redemptionTransaction,
      null,
      vaultEntity,
      vaultBatchEntities,
    );
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
    kind:
      | 'Error'
      | 'UrlPayloadOfferIdMismatch'
      | 'RedemptionNotFound'
      | 'RedemptionOfferCompanyIdMismatch'
      | 'GenericNotFound'
      | 'GenericCodeEmpty'
      | 'VaultNotFound',
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

  private isValidIntegrationType(integration: string | null): boolean {
    if (!integration) {
      return false;
    }
    if (Object.values(integrationEnum.enumValues).includes(integration)) {
      return true;
    }

    return false;
  }
}
