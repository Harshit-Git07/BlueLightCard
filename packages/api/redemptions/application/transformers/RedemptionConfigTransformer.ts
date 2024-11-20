import {
  CREDITCARD,
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  REDEMPTION_TYPES,
  VAULT,
  VAULTQR,
  VERIFY,
} from '@blc-mono/core/constants/redemptions';

import { GenericEntity } from '../repositories/GenericsRepository';
import { RedemptionConfigEntity } from '../repositories/RedemptionConfigRepository';
import { VaultBatchEntity } from '../repositories/VaultBatchesRepository';
import { VaultEntity } from '../repositories/VaultsRepository';

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
  redemptionType: (typeof REDEMPTION_TYPES)[number];
  url?: string | null;
  generic?: RedemptionGenericConfig | null;
  vault?: RedemptionVaultConfig | null;
};

export type RedemptionConfigDto = {
  redemptionConfigEntity: RedemptionConfigEntity;
  genericEntity: GenericEntity | null;
  vaultEntity: VaultEntity | null;
  vaultBatchEntities: VaultBatchEntity[];
};

export class RedemptionConfigTransformer {
  static readonly key = 'RedemptionConfigTransformer';
  static readonly inject = [RedemptionVaultConfigTransformer.key] as const;

  constructor(private readonly redemptionVaultConfigTransformer: RedemptionVaultConfigTransformer) {}

  public transformToRedemptionConfig(redemptionConfigDto: RedemptionConfigDto): RedemptionConfig {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigDto.redemptionConfigEntity;
    const genericEntity: GenericEntity | null = redemptionConfigDto.genericEntity;
    const vaultEntity: VaultEntity | null = redemptionConfigDto.vaultEntity;
    const vaultBatchEntities: VaultBatchEntity[] = redemptionConfigDto.vaultBatchEntities;

    const redemptionType = redemptionConfigEntity.redemptionType;

    const redemptionProperties: RedemptionConfig = {
      id: redemptionConfigEntity.id,
      offerId: String(redemptionConfigEntity.offerId),
      redemptionType: redemptionConfigEntity.redemptionType,
      companyId: String(redemptionConfigEntity.companyId),
    };

    if (redemptionType === GENERIC) {
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

    if (
      redemptionType === PREAPPLIED ||
      redemptionType === GIFTCARD ||
      redemptionType === CREDITCARD ||
      redemptionType === VERIFY
    ) {
      redemptionProperties.url = redemptionConfigDto.redemptionConfigEntity.url;
      redemptionProperties.affiliate = redemptionConfigDto.redemptionConfigEntity.affiliate;
      redemptionProperties.connection = redemptionConfigDto.redemptionConfigEntity.connection;
    }

    if (redemptionType === VAULT || redemptionType === VAULTQR) {
      redemptionProperties.vault = vaultEntity
        ? this.redemptionVaultConfigTransformer.transformToRedemptionVaultConfig(vaultEntity, vaultBatchEntities)
        : null;

      if (redemptionType === VAULT) redemptionProperties.url = redemptionConfigEntity.url;
      redemptionProperties.affiliate = redemptionConfigDto.redemptionConfigEntity.affiliate;
      redemptionProperties.connection = redemptionConfigDto.redemptionConfigEntity.connection;
    }

    return redemptionProperties;
  }
}
