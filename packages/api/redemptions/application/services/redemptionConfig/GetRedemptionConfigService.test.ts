import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import { giftCardFactory } from '@blc-mono/redemptions/libs/test/factories/affilate.factory';
import {
  affiliateFactory,
  affiliateRedemptionTypeFactory,
} from '@blc-mono/redemptions/libs/test/factories/affiliate.factory';
import { ballotEntityFactory } from '@blc-mono/redemptions/libs/test/factories/ballotEntity.factory';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { BallotEntity, IBallotsRepository } from '../../repositories/BallotsRepository';
import { GenericEntity, IGenericsRepository } from '../../repositories/GenericsRepository';
import { IRedemptionConfigRepository, RedemptionConfigEntity } from '../../repositories/RedemptionConfigRepository';
import { IVaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository, VaultEntity } from '../../repositories/VaultsRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

import { GetRedemptionConfigService, RedemptionConfigResult } from './GetRedemptionConfigService';

const mockLogger = createTestLogger();
const mockRedemptionConfigRepository: Partial<IRedemptionConfigRepository> = {
  findOneById: jest.fn(),
  findOneByOfferId: jest.fn(),
  updateManyByOfferId: jest.fn(),
  updateOneByOfferId: jest.fn(),
  createRedemption: jest.fn(),
  withTransaction: jest.fn(),
  updateOneById: jest.fn(),
};

const mockGenericsRepository: Partial<IGenericsRepository> = {
  findOneByRedemptionId: jest.fn(),
  createGeneric: jest.fn(),
  updateByRedemptionId: jest.fn(),
  updateOneById: jest.fn(),
  deleteByRedemptionId: jest.fn(),
  withTransaction: jest.fn(),
};

const mockVaultsRepository: Partial<IVaultsRepository> = {
  findOneByRedemptionId: jest.fn(),
  findOneById: jest.fn(),
  updateOneById: jest.fn(),
  createMany: jest.fn(),
  create: jest.fn(),
  withTransaction: jest.fn(),
};

const mockVaultBatchesRepository: Partial<IVaultBatchesRepository> = {
  create: jest.fn(),
  findByVaultId: jest.fn(),
  getCodesRemaining: jest.fn(),
  deleteById: jest.fn(),
  withTransaction: jest.fn(),
  updateOneById: jest.fn(),
};

const mockBallotsRepository: Partial<IBallotsRepository> = {
  findOneByRedemptionId: jest.fn(),
  withTransaction: jest.fn(),
};

const mockRedemptionConfigTransformer: Partial<RedemptionConfigTransformer> = {
  transformToRedemptionConfig: jest.fn(),
};

const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build();

const redemptionConfig: RedemptionConfig = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'none',
  redemptionType: 'showCard',
  id: 'redemption-id',
};

const getRedemptionConfigService = new GetRedemptionConfigService(
  mockLogger,
  as(mockRedemptionConfigRepository),
  as(mockGenericsRepository),
  as(mockVaultsRepository),
  as(mockVaultBatchesRepository),
  as(mockRedemptionConfigTransformer),
  as(mockBallotsRepository),
);

const offerId = faker.string.sample(10);

describe('GetRedemptionConfigService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return error if findOneByOfferId throws exception', async () => {
    const offerId = faker.string.sample(10);

    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockRejectedValue(new Error('error'));

    const result = await getRedemptionConfigService.getRedemptionConfig(offerId);

    expect(result).toEqual({
      kind: 'Error',
      data: { message: 'Something when wrong getting redemption' },
    });
  });

  it('should return RedemptionNotFound if findOneByOfferId returns null', async () => {
    const offerId = faker.string.sample(10);

    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);

    const result = await getRedemptionConfigService.getRedemptionConfig(offerId);

    expect(result).toEqual({
      kind: 'RedemptionNotFound',
      data: { message: `Could not find redemption with offerid=[${offerId}]` },
    });
  });

  it('should call getRedemptionConfig with offerId', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemptionConfigEntity);

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(redemptionConfig);

    await getRedemptionConfigService.getRedemptionConfig(offerId);

    expect(mockRedemptionConfigRepository.findOneByOfferId).toHaveBeenCalledWith(offerId);
    expect(mockRedemptionConfigRepository.findOneByOfferId).toHaveBeenCalledTimes(1);
  });

  it('should call transformToRedemptionConfig with genericEntity when redemptionType is generic', async () => {
    const genericEntity: GenericEntity = genericEntityFactory.build();

    const genericRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });

    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(genericRedemptionConfigEntity);
    mockGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(genericEntity);
    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(redemptionConfig);

    await getRedemptionConfigService.getRedemptionConfig(offerId);

    expect(mockGenericsRepository.findOneByRedemptionId).toHaveBeenCalledWith(genericRedemptionConfigEntity.id);
    expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
      redemptionConfigEntity: genericRedemptionConfigEntity,
      genericEntity: genericEntity,
      vaultEntity: null,
      vaultBatchEntities: [],
      ballotEntity: null,
    });
  });

  it('should call transformToRedemptionConfig when redemptionType is giftCard', async () => {
    const giftCardPayloadFactory = giftCardFactory.build();

    const giftCardRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'giftCard',
    });

    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(giftCardRedemptionConfigEntity);
    mockGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(giftCardPayloadFactory);
    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(redemptionConfig);

    await getRedemptionConfigService.getRedemptionConfig(giftCardRedemptionConfigEntity.offerId);

    expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
      redemptionConfigEntity: giftCardRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
      ballotEntity: null,
    });
  });

  it('should call transformToRedemptionConfig with vaultEntity and vaultBatchEntities when redemptionType is vault', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build();
    const vaultBatchEntities = vaultBatchEntityFactory.buildList(3);

    const vaultRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vault',
    });

    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(vaultRedemptionConfigEntity);
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
    mockVaultBatchesRepository.findByVaultId = jest.fn().mockResolvedValue(vaultBatchEntities);

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(redemptionConfig);

    await getRedemptionConfigService.getRedemptionConfig(offerId);

    expect(mockVaultsRepository.findOneByRedemptionId).toHaveBeenCalledWith(vaultRedemptionConfigEntity.id);
    expect(mockVaultBatchesRepository.findByVaultId).toHaveBeenCalledWith(vaultEntity.id);
    expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
      redemptionConfigEntity: vaultRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: vaultEntity,
      vaultBatchEntities: vaultBatchEntities,
      ballotEntity: null,
    });
  });

  it('should return RedemptionConfigResult from transformToRedemptionConfig', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemptionConfigEntity);

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(redemptionConfig);

    const actulRedemptionConfigResult: RedemptionConfigResult =
      await getRedemptionConfigService.getRedemptionConfig(offerId);

    expect(actulRedemptionConfigResult).toEqual({
      kind: 'Ok',
      data: redemptionConfig,
    });
  });

  it('should call transformToRedemptionConfig when redemptionType is compare', async () => {
    const comparePayloadFactory: affiliateRedemptionTypeFactory = affiliateFactory.build({
      redemptionType: 'compare',
    });

    const compareRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'compare',
    });

    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(compareRedemptionConfigEntity);
    mockGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(comparePayloadFactory);
    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(redemptionConfig);

    await getRedemptionConfigService.getRedemptionConfig(compareRedemptionConfigEntity.offerId);

    expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
      redemptionConfigEntity: compareRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
      ballotEntity: null,
    });
  });

  it('should call transformToRedemptionConfig with ballotEntity when redemptionType is ballot', async () => {
    const ballotEntity: BallotEntity = ballotEntityFactory.build();

    const ballottRedemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'ballot',
    });

    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValue(ballottRedemptionConfigEntity);
    mockBallotsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(ballotEntity);

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(redemptionConfig);

    await getRedemptionConfigService.getRedemptionConfig(offerId);

    expect(mockBallotsRepository.findOneByRedemptionId).toHaveBeenCalledWith(ballottRedemptionConfigEntity.id);
    expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
      redemptionConfigEntity: ballottRedemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
      ballotEntity: ballotEntity,
    });
  });
});
