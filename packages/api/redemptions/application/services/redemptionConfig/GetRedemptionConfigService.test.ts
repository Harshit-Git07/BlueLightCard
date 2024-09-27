import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { GenericEntity, IGenericsRepository } from '../../repositories/GenericsRepository';
import { IRedemptionConfigRepository, RedemptionConfigEntity } from '../../repositories/RedemptionConfigRepository';
import { IVaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository, VaultEntity } from '../../repositories/VaultsRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

import { GetRedemptionConfigService, RedemptionConfigResult } from './GetRedemptionConfigService';

const mockLogger = createTestLogger();
const mockRedemptionConfigRepository: IRedemptionConfigRepository = {
  findOneById: jest.fn(),
  findOneByOfferId: jest.fn(),
  updateManyByOfferId: jest.fn(),
  updateOneByOfferId: jest.fn(),
  createRedemption: jest.fn(),
  withTransaction: jest.fn(),
} satisfies IRedemptionConfigRepository;

const mockGenericsRepository: IGenericsRepository = {
  findOneByRedemptionId: jest.fn(),
  createGeneric: jest.fn(),
  updateByRedemptionId: jest.fn(),
  deleteByRedemptionId: jest.fn(),
  withTransaction: jest.fn(),
} satisfies IGenericsRepository;

const mockVaultsRepository: IVaultsRepository = {
  findOneByRedemptionId: jest.fn(),
  findOneById: jest.fn(),
  updateOneById: jest.fn(),
  createMany: jest.fn(),
  create: jest.fn(),
  withTransaction: jest.fn(),
} satisfies IVaultsRepository;

const mockVaultBatchesRepository: IVaultBatchesRepository = {
  create: jest.fn(),
  findByVaultId: jest.fn(),
  getCodesRemaining: jest.fn(),
  deleteById: jest.fn(),
  withTransaction: jest.fn(),
  updateOneById: jest.fn(),
  findOneById: jest.fn(),
} satisfies IVaultBatchesRepository;

const mockRedemptionConfigTransformer: Partial<RedemptionConfigTransformer> = {
  transformToRedemptionConfig: jest.fn(),
};

const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build();

const redemptionConfig: RedemptionConfig = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'none',
  offerType: 'in-store',
  redemptionType: 'showCard',
  id: 'redemption-id',
};

const getRedemptionConfigService = new GetRedemptionConfigService(
  mockLogger,
  mockRedemptionConfigRepository,
  mockGenericsRepository,
  mockVaultsRepository,
  mockVaultBatchesRepository,
  as(mockRedemptionConfigTransformer),
);

const offerId = faker.number.int();

describe('GetRedemptionConfigService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return error if findOneByOfferId throws exception', async () => {
    const offerId = faker.number.int();

    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockRejectedValue(new Error('error'));

    const result = await getRedemptionConfigService.getRedemptionConfig(offerId);

    expect(result).toEqual({
      kind: 'Error',
      data: { message: 'Something when wrong getting redemption' },
    });
  });

  it('should return RedemptionNotFound if findOneByOfferId returns null', async () => {
    const offerId = faker.number.int();

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
});
