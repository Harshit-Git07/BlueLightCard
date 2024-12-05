import { as } from '@blc-mono/core/utils/testing';
import { singleBallotEntityFactory } from '@blc-mono/redemptions/libs/test/factories/ballotEntity.factory';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionBallotConfigFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionBallotConfig.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { redemptionVaultConfigFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionVaultConfig.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';

import { BallotEntity } from '../repositories/BallotsRepository';
import { GenericEntity } from '../repositories/GenericsRepository';
import { RedemptionConfigEntity } from '../repositories/RedemptionConfigRepository';
import { VaultEntity } from '../repositories/VaultsRepository';

import { RedemptionBallotConfig, RedemptionBallotConfigTransformer } from './RedemptionBallotConfigTransformer';
import { RedemptionConfigTransformer } from './RedemptionConfigTransformer';
import { RedemptionVaultConfig, RedemptionVaultConfigTransformer } from './RedemptionVaultConfigTransformer';

const mockRedemptionVaultConfigTransformer: Partial<RedemptionVaultConfigTransformer> = {
  transformToRedemptionVaultConfig: jest.fn(),
};

const mockRedemptionBallotConfigTransformer: Partial<RedemptionBallotConfigTransformer> = {
  transformToRedemptionBallotConfig: jest.fn(),
};

const redemptionConfigTransformer: RedemptionConfigTransformer = new RedemptionConfigTransformer(
  as(mockRedemptionVaultConfigTransformer),
  as(mockRedemptionBallotConfigTransformer),
);

const vaultEntity: VaultEntity = vaultEntityFactory.build();
const vaultBatchEntities = vaultBatchEntityFactory.buildList(3);
const genericEntity: GenericEntity = genericEntityFactory.build();
const ballotEntity: BallotEntity = singleBallotEntityFactory.build();

const redemptionVaultConfig: RedemptionVaultConfig = redemptionVaultConfigFactory.build();

const redemptionBallotConfig: RedemptionBallotConfig = redemptionBallotConfigFactory.build();

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
        ballotEntity: null,
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
        ballotEntity: null,
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
      ballotEntity: null,
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

  it('returns formatted RedemptionConfig when redemptionType is showCard', () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'showCard',
    });

    const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
      redemptionConfigEntity: redemptionConfigEntity,
      genericEntity,
      vaultEntity: null,
      vaultBatchEntities: [],
      ballotEntity: null,
    });

    const expectedRedemptionConfig = {
      id: redemptionConfigEntity.id,
      offerId: redemptionConfigEntity.offerId.toString(),
      redemptionType: redemptionConfigEntity.redemptionType,
      companyId: redemptionConfigEntity.companyId.toString(),
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
      ballotEntity: null,
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

  it.each(['verify', 'preApplied', 'giftCard', 'compare'] as const)(
    'returns formatted RedemptionConfig when redemptionType is [%s]',
    (redemptionType) => {
      const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
        redemptionType,
      });

      const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
        redemptionConfigEntity: redemptionConfigEntity,
        genericEntity: null,
        vaultEntity: null,
        vaultBatchEntities: [],
        ballotEntity: null,
      });

      const expectedRedemptionConfig = {
        id: redemptionConfigEntity.id,
        offerId: redemptionConfigEntity.offerId.toString(),
        redemptionType: redemptionConfigEntity.redemptionType,
        connection: redemptionConfigEntity.connection,
        companyId: redemptionConfigEntity.companyId.toString(),
        affiliate: redemptionConfigEntity.affiliate,
        url: redemptionConfigEntity.url,
      };

      expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);
    },
  );

  it('returns formatted RedemptionConfig when redemptionType is ballot and no ballot entity', () => {
    const ballotRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'ballot',
    });
    const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
      redemptionConfigEntity: ballotRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
      ballotEntity: null,
    });

    const expectedRedemptionConfig = {
      id: ballotRedemptionConfigEntity.id,
      offerId: ballotRedemptionConfigEntity.offerId.toString(),
      redemptionType: ballotRedemptionConfigEntity.redemptionType,
      connection: ballotRedemptionConfigEntity.connection,
      companyId: ballotRedemptionConfigEntity.companyId.toString(),
      affiliate: ballotRedemptionConfigEntity.affiliate,
      url: ballotRedemptionConfigEntity.url,
      ballot: null,
    };

    expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);

    expect(mockRedemptionBallotConfigTransformer.transformToRedemptionBallotConfig).not.toHaveBeenCalled();
  });

  it('returns formatted RedemptionConfig when redemptionType is ballot', () => {
    const ballotRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'ballot',
    });
    mockRedemptionBallotConfigTransformer.transformToRedemptionBallotConfig = jest
      .fn()
      .mockReturnValue(redemptionBallotConfig);

    const actualRedemptionConfig = redemptionConfigTransformer.transformToRedemptionConfig({
      redemptionConfigEntity: ballotRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
      ballotEntity,
    });

    const expectedRedemptionConfig = {
      id: ballotRedemptionConfigEntity.id,
      offerId: ballotRedemptionConfigEntity.offerId.toString(),
      redemptionType: ballotRedemptionConfigEntity.redemptionType,
      connection: ballotRedemptionConfigEntity.connection,
      companyId: ballotRedemptionConfigEntity.companyId.toString(),
      affiliate: ballotRedemptionConfigEntity.affiliate,
      url: ballotRedemptionConfigEntity.url,
      ballot: redemptionBallotConfig,
    };

    // console.log({ expectedRedemptionConfig })
    // console.log({ actualRedemptionConfig })

    expect(actualRedemptionConfig).toStrictEqual(expectedRedemptionConfig);
    expect(mockRedemptionBallotConfigTransformer.transformToRedemptionBallotConfig).toHaveBeenCalledWith(ballotEntity);
  });
});
