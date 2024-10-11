import { as } from '@blc-mono/core/utils/testing';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { redemptionVaultConfigFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionVaultConfig.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';

import { GenericEntity } from '../repositories/GenericsRepository';
import { RedemptionConfigEntity } from '../repositories/RedemptionConfigRepository';
import { VaultEntity } from '../repositories/VaultsRepository';

import { RedemptionConfigTransformer } from './RedemptionConfigTransformer';
import { RedemptionVaultConfig, RedemptionVaultConfigTransformer } from './RedemptionVaultConfigTransformer';

const mockRedemptionVaultConfigTransformer: Partial<RedemptionVaultConfigTransformer> = {
  transformToRedemptionVaultConfig: jest.fn(),
};

const redemptionConfigTransformer: RedemptionConfigTransformer = new RedemptionConfigTransformer(
  as(mockRedemptionVaultConfigTransformer),
);

const vaultEntity: VaultEntity = vaultEntityFactory.build();
const vaultBatchEntities = vaultBatchEntityFactory.buildList(3);
const genericEntity: GenericEntity = genericEntityFactory.build();

const redemptionVaultConfig: RedemptionVaultConfig = redemptionVaultConfigFactory.build();

describe('transformToRedemptionConfig', () => {
  it.each(['vault', 'vaultQR'] as const)(
    "returns formatted RedemptionConfig when redemptionType is '%s' and no vault entity",
    (redemptionType) => {
      const vaultRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
        redemptionType,
      });
      const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
        redemptionConfigEntity: vaultRedemptionConfigEntity,
        genericEntity: null,
        vaultEntity: null,
        vaultBatchEntities: [],
      });

      const expectedRedemptionConfig = {
        id: vaultRedemptionConfigEntity.id,
        offerId: vaultRedemptionConfigEntity.offerId.toString(),
        redemptionType: vaultRedemptionConfigEntity.redemptionType,
        connection: vaultRedemptionConfigEntity.connection,
        companyId: vaultRedemptionConfigEntity.companyId.toString(),
        affiliate: vaultRedemptionConfigEntity.affiliate,
        ...(redemptionType === 'vault' && { url: vaultRedemptionConfigEntity.url }),
        vault: null,
      };

      expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);

      expect(mockRedemptionVaultConfigTransformer.transformToRedemptionVaultConfig).not.toHaveBeenCalled();
    },
  );

  it.each(['vault', 'vaultQR'] as const)(
    "returns formatted RedemptionConfig when redemptionType is '%s'",
    (redemptionType) => {
      const vaultRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
        redemptionType,
      });
      mockRedemptionVaultConfigTransformer.transformToRedemptionVaultConfig = jest
        .fn()
        .mockReturnValue(redemptionVaultConfig);

      const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
        redemptionConfigEntity: vaultRedemptionConfigEntity,
        genericEntity: null,
        vaultEntity,
        vaultBatchEntities,
      });

      const expectedRedemptionConfig = {
        id: vaultRedemptionConfigEntity.id,
        offerId: vaultRedemptionConfigEntity.offerId.toString(),
        redemptionType: vaultRedemptionConfigEntity.redemptionType,
        connection: vaultRedemptionConfigEntity.connection,
        companyId: vaultRedemptionConfigEntity.companyId.toString(),
        affiliate: vaultRedemptionConfigEntity.affiliate,
        ...(redemptionType === 'vault' && { url: vaultRedemptionConfigEntity.url }),
        vault: redemptionVaultConfig,
      };

      expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);
      expect(mockRedemptionVaultConfigTransformer.transformToRedemptionVaultConfig).toHaveBeenCalledWith(
        vaultEntity,
        vaultBatchEntities,
      );
    },
  );

  it('returns formatted RedemptionConfig when redemptionType is generic and no generic entity', () => {
    const genericRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });

    const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
      redemptionConfigEntity: genericRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
    });

    const expectedRedemptionConfig = {
      id: genericRedemptionConfigEntity.id,
      offerId: genericRedemptionConfigEntity.offerId.toString(),
      redemptionType: genericRedemptionConfigEntity.redemptionType,
      connection: genericRedemptionConfigEntity.connection,
      companyId: genericRedemptionConfigEntity.companyId.toString(),
      affiliate: genericRedemptionConfigEntity.affiliate,
      url: genericRedemptionConfigEntity.url,
      generic: null,
    };

    expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);
  });

  it('returns formatted RedemptionConfig when redemptionType is generic', () => {
    const genericRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });

    const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
      redemptionConfigEntity: genericRedemptionConfigEntity,
      genericEntity,
      vaultEntity: null,
      vaultBatchEntities: [],
    });

    const expectedRedemptionConfig = {
      id: genericRedemptionConfigEntity.id,
      offerId: genericRedemptionConfigEntity.offerId.toString(),
      redemptionType: genericRedemptionConfigEntity.redemptionType,
      connection: genericRedemptionConfigEntity.connection,
      companyId: genericRedemptionConfigEntity.companyId.toString(),
      affiliate: genericRedemptionConfigEntity.affiliate,
      url: genericRedemptionConfigEntity.url,
      generic: {
        id: genericEntity.id,
        code: genericEntity.code,
      },
    };

    expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);
  });

  it('returns formatted RedemptionConfig when redemptionType is preApplied', () => {
    const preAppliedRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'preApplied',
    });

    const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
      redemptionConfigEntity: preAppliedRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
    });

    const expectedRedemptionConfig = {
      id: preAppliedRedemptionConfigEntity.id,
      offerId: preAppliedRedemptionConfigEntity.offerId.toString(),
      redemptionType: preAppliedRedemptionConfigEntity.redemptionType,
      connection: preAppliedRedemptionConfigEntity.connection,
      companyId: preAppliedRedemptionConfigEntity.companyId.toString(),
      affiliate: preAppliedRedemptionConfigEntity.affiliate,
      url: preAppliedRedemptionConfigEntity.url,
    };

    expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);
  });

  it('returns formatted RedemptionConfig when redemptionType is showCard', () => {
    const preAppliedRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'showCard',
    });

    const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
      redemptionConfigEntity: preAppliedRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
    });

    const expectedRedemptionConfig = {
      id: preAppliedRedemptionConfigEntity.id,
      offerId: preAppliedRedemptionConfigEntity.offerId.toString(),
      redemptionType: preAppliedRedemptionConfigEntity.redemptionType,
      companyId: preAppliedRedemptionConfigEntity.companyId.toString(),
    };

    expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);
  });
});
