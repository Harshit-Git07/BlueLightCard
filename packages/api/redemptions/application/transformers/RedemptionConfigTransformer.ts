import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';

import { Generic } from '../repositories/GenericsRepository';
import { RedemptionConfigEntity } from '../repositories/RedemptionConfigRepository';
import { VaultBatch } from '../repositories/VaultBatchesRepository';
import { Vault } from '../repositories/VaultsRepository';

import { RedemptionVaultConfig, RedemptionVaultConfigTransformer } from './RedemptionVaultConfigTransformer';

export type RedemptionGenericConfig = {
  id: string;
  code: string;
};

export type RedemptionConfig = {
  affiliate?: string | null;
  companyId: string;
  connection?: string | null;
  id?: string;
  offerId: string;
  offerType?: string;
  redemptionType: (typeof REDEMPTION_TYPES)[number];
  url?: string | null;
  generic?: RedemptionGenericConfig | null;
  vault?: RedemptionVaultConfig | null;
};

export type RedemptionConfigDto = {
  redemptionConfigEntity: RedemptionConfigEntity;
  genericEntity: Generic | null;
  vaultEntity: Vault | null;
  vaultBatchEntities: VaultBatch[];
};

export class RedemptionConfigTransformer {
  static readonly key = 'RedemptionConfigTransformer';
  static readonly inject = [RedemptionVaultConfigTransformer.key] as const;

  constructor(private readonly redemptionVaultConfigTransformer: RedemptionVaultConfigTransformer) {}

  public transformToRedemptionConfig(redemptionConfigDto: RedemptionConfigDto): RedemptionConfig {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigDto.redemptionConfigEntity;
    const genericEntity: Generic | null = redemptionConfigDto.genericEntity;
    const vaultEntity: Vault | null = redemptionConfigDto.vaultEntity;
    const vaultBatchEntities: VaultBatch[] = redemptionConfigDto.vaultBatchEntities;

    const redemptionType = redemptionConfigEntity.redemptionType;

    const redemptionProperties: RedemptionConfig = {
      id: redemptionConfigEntity.id,
      offerId: String(redemptionConfigEntity.offerId),
      redemptionType: redemptionConfigEntity.redemptionType,
      companyId: String(redemptionConfigEntity.companyId),
    };

    if (redemptionType === 'generic') {
      let redemptionGenericConfig: RedemptionGenericConfig | null = null;

      if (genericEntity) {
        redemptionGenericConfig = {
          id: genericEntity.id,
          code: genericEntity.code,
        };
      }

      redemptionProperties.generic = redemptionGenericConfig;

      redemptionProperties.url = redemptionConfigDto.redemptionConfigEntity.url;
      redemptionProperties.affiliate = redemptionConfigDto.redemptionConfigEntity.affiliate;
      redemptionProperties.connection = redemptionConfigDto.redemptionConfigEntity.connection;
    }

    if (redemptionType === 'preApplied') {
      redemptionProperties.url = redemptionConfigDto.redemptionConfigEntity.url;
      redemptionProperties.affiliate = redemptionConfigDto.redemptionConfigEntity.affiliate;
      redemptionProperties.connection = redemptionConfigDto.redemptionConfigEntity.connection;
    }

    if (redemptionType === 'vault' || redemptionType === 'vaultQR') {
      redemptionProperties.vault = vaultEntity
        ? this.redemptionVaultConfigTransformer.transformToRedemptionVaultConfig(vaultEntity, vaultBatchEntities)
        : null;

      redemptionProperties.url = redemptionConfigEntity.url;
      redemptionProperties.affiliate = redemptionConfigDto.redemptionConfigEntity.affiliate;
      redemptionProperties.connection = redemptionConfigDto.redemptionConfigEntity.connection;
    }

    return redemptionProperties;
  }
}
