import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { GenericEntity, GenericsRepository, IGenericsRepository } from '../../repositories/GenericsRepository';
import {
  IRedemptionConfigRepository,
  RedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../../repositories/RedemptionConfigRepository';
import {
  IVaultBatchesRepository,
  VaultBatchEntity,
  VaultBatchesRepository,
} from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository, VaultEntity, VaultsRepository } from '../../repositories/VaultsRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

export type RedemptionConfigResult =
  | {
      kind: 'Ok';
      data: RedemptionConfig;
    }
  | {
      kind: 'RedemptionNotFound';
    }
  | {
      kind: 'Error';
      data: { message: string };
    };

export interface IGetRedemptionConfigService {
  getRedemptionConfig(offerId: number): Promise<RedemptionConfigResult>;
}

export class GetRedemptionConfigService implements IGetRedemptionConfigService {
  static readonly key = 'GetRedemptionConfigService';
  static readonly inject = [
    Logger.key,
    RedemptionConfigRepository.key,
    GenericsRepository.key,
    VaultsRepository.key,
    VaultBatchesRepository.key,
    RedemptionConfigTransformer.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: IRedemptionConfigRepository,
    private readonly genericsRepository: IGenericsRepository,
    private readonly vaultsRepository: IVaultsRepository,
    private readonly vaultBatchesRepository: IVaultBatchesRepository,
    private readonly redemptionConfigTransformer: RedemptionConfigTransformer,
  ) {}

  public async getRedemptionConfig(offerId: number): Promise<RedemptionConfigResult> {
    this.logger.info({
      message: 'offerId',
      context: {
        offerId,
      },
    });

    let redemptionConfigEntity: RedemptionConfigEntity | null;
    let genericEntity: GenericEntity | null = null;
    let vaultEntity: VaultEntity | null = null;
    let vaultBatchEntities: VaultBatchEntity[] = [];

    try {
      redemptionConfigEntity = await this.redemptionConfigRepository.findOneByOfferId(offerId);
    } catch (error) {
      this.logger.error({
        message: 'Error when getting redemption configuration',
        context: { offerId, error },
      });
      return Promise.resolve({
        kind: 'Error',
        data: { message: 'Something when wrong getting redemption' },
      });
    }

    if (!redemptionConfigEntity) {
      return Promise.resolve({
        kind: 'RedemptionNotFound',
        data: { message: `Could not find redemption with offerid=[${offerId}]` },
      });
    }

    const redemptionType = redemptionConfigEntity.redemptionType;

    if (redemptionType === 'generic') {
      genericEntity = await this.genericsRepository.findOneByRedemptionId(redemptionConfigEntity.id);
    }

    if (redemptionType === 'vault' || redemptionType === 'vaultQR') {
      vaultEntity = await this.vaultsRepository.findOneByRedemptionId(redemptionConfigEntity.id);
      if (vaultEntity) {
        vaultBatchEntities = await this.vaultBatchesRepository.findByVaultId(vaultEntity.id);
      }
    }

    return Promise.resolve({
      kind: 'Ok',
      data: this.redemptionConfigTransformer.transformToRedemptionConfig({
        redemptionConfigEntity: redemptionConfigEntity,
        genericEntity: genericEntity,
        vaultEntity: vaultEntity,
        vaultBatchEntities: vaultBatchEntities,
      }),
    });
  }
}
