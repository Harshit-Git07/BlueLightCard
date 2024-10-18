import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import {
  DatabaseTransactionOperator,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import {
  genericRedemptionConfigFactory,
  redemptionConfigFactory,
  vaultRedemptionConfigFactory,
} from '@blc-mono/redemptions/libs/test/factories/redemptionConfig.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IGenericsRepository } from '../../repositories/GenericsRepository';
import {
  IRedemptionConfigRepository,
  NewRedemptionConfigEntity,
  RedemptionConfigEntity,
} from '../../repositories/RedemptionConfigRepository';
import { IVaultsRepository } from '../../repositories/VaultsRepository';
import { NewRedemptionConfigEntityTransformer } from '../../transformers/NewRedemptionConfigEntityTransformer';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

import { CreateRedemptionConfigSchema, CreateRedemptionConfigService } from './CreateRedemptionConfigService';

const mockRedemptionsTransactionRepository: Partial<IRedemptionConfigRepository> = {};
const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {};

const mockGenericsTransactionRepository: Partial<IGenericsRepository> = {};
const mockGenericsRepository: Partial<IGenericsRepository> = {};

const mockVaultsTransactionRepository: Partial<IVaultsRepository> = {};
const mockVaultsRepository: Partial<IVaultsRepository> = {};

const mockRedemptionConfigTransformer: Partial<RedemptionConfigTransformer> = {
  transformToRedemptionConfig: jest.fn(),
};

const mockNewRedemptionConfigEntityTransformer: Partial<NewRedemptionConfigEntityTransformer> = {
  transformToNewRedemptionConfigEntity: jest.fn(),
};

const mockTransactionManager: Partial<TransactionManager> = {
  withTransaction: jest.fn(),
};

const stubTransactionManager: Partial<TransactionManager> = {
  withTransaction(callback) {
    return callback(as(mockDatabaseTransactionOperator));
  },
};

const mockDatabaseTransactionOperator: Partial<DatabaseTransactionOperator> = {};

const mockLogger: Partial<ILogger> = createTestLogger();

const validRedemptionConfigRequest: CreateRedemptionConfigSchema = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  connection: 'none',
  redemptionType: 'preApplied',
  url: 'https://example.com',
  affiliate: 'awin',
} as const;

const validRedemptionConfigResponse = {
  ...validRedemptionConfigRequest,
  companyId: validRedemptionConfigRequest.companyId.toString(),
  offerId: validRedemptionConfigRequest.offerId.toString(),
  redemptionId: 'redemption-id',
} as const;

const redemptionConfigEntity: RedemptionConfigEntity = {
  id: 'someId',
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  affiliate: 'awin',
  url: 'https://example.com',
  connection: 'direct',
  redemptionType: 'showCard',
  offerType: 'in-store',
};

const newRedemptionConfigEntity: NewRedemptionConfigEntity = {
  companyId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  affiliate: 'awin',
  url: 'https://example.com',
  connection: 'direct',
  redemptionType: 'showCard',
  offerType: 'in-store',
};

const redemptionConfig: RedemptionConfig = redemptionConfigFactory.build();

const service = new CreateRedemptionConfigService(
  as(mockLogger),
  as(mockRedemptionsRepository),
  as(mockGenericsRepository),
  as(mockVaultsRepository),
  as(mockRedemptionConfigTransformer),
  as(mockNewRedemptionConfigEntityTransformer),
  as(stubTransactionManager),
);

describe('CreateRedemptionConfigService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockRedemptionsRepository.withTransaction = jest.fn().mockReturnValue(mockRedemptionsTransactionRepository);
    mockGenericsRepository.withTransaction = jest.fn().mockReturnValue(mockGenericsTransactionRepository);
    mockVaultsRepository.withTransaction = jest.fn().mockReturnValue(mockVaultsTransactionRepository);
  });

  it('throws an error when an unsupported redemptionType is supplied', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: undefined,
    });

    const undefinedRedemptionRequestBody: CreateRedemptionConfigSchema = {
      companyId: faker.string.uuid(),
      offerId: faker.string.uuid(),
      connection: 'none',
      redemptionType: as(undefined),
      url: 'example.url.com',
      affiliate: 'awin',
      generic: {
        code: 'generic-code',
      },
    } as CreateRedemptionConfigSchema;

    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
    mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

    await expect(service.createRedemptionConfig(undefinedRedemptionRequestBody)).rejects.toThrow(
      'Unsupported redemption type: undefined',
    );
  });

  it('returns response from transformToRedemptionConfig', async () => {
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
    mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(validRedemptionConfigResponse);

    const result = await service.createRedemptionConfig(validRedemptionConfigRequest);

    expect(result.kind).toEqual('Ok');
    expect(result.data).toStrictEqual(validRedemptionConfigResponse);
  });

  it.each(['showCard', 'preApplied'] as const)(
    'calls transformToRedemptionConfig with correct values for %s redemption type',
    async (redemptionType) => {
      const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
        redemptionType,
      });

      const showCardRedemptionRequestBody: CreateRedemptionConfigSchema = {
        companyId: faker.string.uuid(),
        offerId: faker.string.uuid(),
        connection: 'none',
        redemptionType,
        url: 'example.url.com',
        affiliate: 'awin',
      } as const;

      mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
      mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

      mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(redemptionConfig);

      await service.createRedemptionConfig(showCardRedemptionRequestBody);

      expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledTimes(1);
      expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
        redemptionConfigEntity: redemptionConfigEntity,
        genericEntity: null,
        vaultEntity: null,
        vaultBatchEntities: [],
      });
    },
  );

  it.each(['vault', 'vaultQR'] as const)(
    'throws an error when createVault fails with %s redemption type',
    async (redemptionType) => {
      const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
        redemptionType,
      });

      const vaultRedemptionRequestBody: CreateRedemptionConfigSchema = {
        companyId: faker.string.uuid(),
        offerId: faker.string.uuid(),
        connection: 'none',
        redemptionType,
        url: 'example.url.com',
        affiliate: 'awin',
        vault: {
          alertBelow: 1000,
          status: 'active',
          maxPerUser: 1,
          integrationId: 1234,
          email: 'some@email.com',
          integration: 'eagleeye',
        },
      } as const;

      mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
      mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

      mockVaultsTransactionRepository.create = jest.fn().mockRejectedValue(new Error());

      await expect(service.createRedemptionConfig(vaultRedemptionRequestBody)).rejects.toThrow(
        'Failed to create vault',
      );
    },
  );

  it.each(['vault', 'vaultQR'] as const)(
    'calls transformToRedemptionConfig with correct values for %s redemption type',
    async (redemptionType) => {
      const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
        redemptionType,
      });

      const vaultRedemptionRequestBody: CreateRedemptionConfigSchema = {
        companyId: faker.string.uuid(),
        offerId: faker.string.uuid(),
        connection: 'none',
        redemptionType,
        url: 'example.url.com',
        affiliate: 'awin',
        vault: {
          alertBelow: 1000,
          status: 'active',
          maxPerUser: 1,
          integrationId: 1234,
          email: 'some@email.com',
          integration: 'eagleeye',
        },
      } as const;

      const vaultEntity = vaultEntityFactory.build();

      const vaultRedemptionConfigResponse = vaultRedemptionConfigFactory.build();

      mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
      mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

      mockVaultsTransactionRepository.create = jest.fn().mockResolvedValue(vaultEntity);

      mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
        .fn()
        .mockReturnValue(vaultRedemptionConfigResponse);

      await service.createRedemptionConfig(vaultRedemptionRequestBody);

      expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledTimes(1);
      expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
        redemptionConfigEntity: redemptionConfigEntity,
        genericEntity: null,
        vaultEntity: vaultEntity,
        vaultBatchEntities: [],
      });
    },
  );

  it('throws an error when createGeneric fails', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });

    const genericRedemptionRequestBody: CreateRedemptionConfigSchema = {
      companyId: faker.string.uuid(),
      offerId: faker.string.uuid(),
      connection: 'none',
      redemptionType: 'generic',
      url: 'example.url.com',
      affiliate: 'awin',
      generic: {
        code: 'generic-code',
      },
    } as const;

    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
    mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

    mockGenericsTransactionRepository.createGeneric = jest.fn().mockRejectedValue(new Error());

    await expect(service.createRedemptionConfig(genericRedemptionRequestBody)).rejects.toThrow(
      'Failed to create generic',
    );
  });

  it('calls transformToRedemptionConfig with correct values for Generic Redemption type', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });

    const genericRedemptionRequestBody: CreateRedemptionConfigSchema = {
      companyId: faker.string.uuid(),
      offerId: faker.string.uuid(),
      connection: 'none',
      redemptionType: 'generic',
      url: 'example.url.com',
      affiliate: 'awin',
      generic: {
        code: 'generic-code',
      },
    } as const;

    const genericRedemptionConfigResponse: RedemptionConfig = genericRedemptionConfigFactory.build();

    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
    mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

    mockGenericsTransactionRepository.createGeneric = jest.fn().mockResolvedValue({
      id: 'generic-id',
      code: 'generic-code',
      redemptionId: 'redemption-id',
    });

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(genericRedemptionConfigResponse);

    await service.createRedemptionConfig(genericRedemptionRequestBody);

    expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledTimes(1);
    expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
      redemptionConfigEntity: redemptionConfigEntity,
      genericEntity: {
        id: 'generic-id',
        code: 'generic-code',
        redemptionId: 'redemption-id',
      },
      vaultEntity: null,
      vaultBatchEntities: [],
    });
  });

  it('throws an error when the Redemption Config has failed to be created', async () => {
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
    mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockRejectedValue(new Error());

    await expect(service.createRedemptionConfig(validRedemptionConfigRequest)).rejects.toThrow(
      'Failed to create redemption with given offerId',
    );
  });

  it('calls transformToNewRedemptionConfigEntity', async () => {
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);

    mockNewRedemptionConfigEntityTransformer.transformToNewRedemptionConfigEntity = jest
      .fn()
      .mockReturnValue(newRedemptionConfigEntity);

    mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(validRedemptionConfigResponse);

    await service.createRedemptionConfig(validRedemptionConfigRequest);

    expect(mockNewRedemptionConfigEntityTransformer.transformToNewRedemptionConfigEntity).toHaveBeenCalledTimes(1);
    expect(mockNewRedemptionConfigEntityTransformer.transformToNewRedemptionConfigEntity).toHaveBeenCalledWith(
      validRedemptionConfigRequest,
    );
  });

  it('calls createRedemption', async () => {
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);

    mockNewRedemptionConfigEntityTransformer.transformToNewRedemptionConfigEntity = jest
      .fn()
      .mockReturnValue(newRedemptionConfigEntity);

    mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(validRedemptionConfigResponse);

    await service.createRedemptionConfig(validRedemptionConfigRequest);

    const expectedNewRedemptionConfigEntity: NewRedemptionConfigEntity = {
      companyId: newRedemptionConfigEntity.companyId,
      connection: newRedemptionConfigEntity.connection,
      offerId: newRedemptionConfigEntity.offerId,
      offerType: newRedemptionConfigEntity.offerType,
      redemptionType: newRedemptionConfigEntity.redemptionType,
      url: newRedemptionConfigEntity.url,
      affiliate: newRedemptionConfigEntity.affiliate,
    };

    expect(mockRedemptionsTransactionRepository.createRedemption).toHaveBeenCalledTimes(1);
    expect(mockRedemptionsTransactionRepository.createRedemption).toHaveBeenCalledWith(
      expectedNewRedemptionConfigEntity,
    );
  });

  it('gets transactional versions of repositories', async () => {
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);
    mockRedemptionsTransactionRepository.createRedemption = jest.fn().mockResolvedValue(redemptionConfigEntity);

    await service.createRedemptionConfig(validRedemptionConfigRequest);

    expect(mockRedemptionsRepository.withTransaction).toHaveBeenCalledTimes(1);
    expect(mockGenericsRepository.withTransaction).toHaveBeenCalledTimes(1);
    expect(mockVaultsRepository.withTransaction).toHaveBeenCalledTimes(1);
  });

  it('calls withTransaction on transactionManager', async () => {
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);

    const createRedemptionConfigServiceWithMockTransactionManager = new CreateRedemptionConfigService(
      as(mockLogger),
      as(mockRedemptionsRepository),
      as(mockGenericsRepository),
      as(mockVaultsRepository),
      as(mockRedemptionConfigTransformer),
      as(mockNewRedemptionConfigEntityTransformer),
      as(mockTransactionManager),
    );

    await createRedemptionConfigServiceWithMockTransactionManager.createRedemptionConfig(validRedemptionConfigRequest);

    expect(mockTransactionManager.withTransaction).toHaveBeenCalledTimes(1);
  });

  it('calls findOneByOfferId with given offerId', async () => {
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemptionConfigEntity);

    await expect(service.createRedemptionConfig(validRedemptionConfigRequest)).rejects.toThrow();

    expect(mockRedemptionsRepository.findOneByOfferId).toHaveBeenCalledTimes(1);
    expect(mockRedemptionsRepository.findOneByOfferId).toHaveBeenCalledWith(validRedemptionConfigRequest.offerId);
  });

  it('throws an error when a redemption already exists in db for given offerId', async () => {
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemptionConfigEntity);

    const createRedemptionConfigServiceWithMockTransactionManager = new CreateRedemptionConfigService(
      as(mockLogger),
      as(mockRedemptionsRepository),
      as(mockGenericsRepository),
      as(mockVaultsRepository),
      as(mockRedemptionConfigTransformer),
      as(mockNewRedemptionConfigEntityTransformer),
      as(mockTransactionManager),
    );

    await expect(
      createRedemptionConfigServiceWithMockTransactionManager.createRedemptionConfig(validRedemptionConfigRequest),
    ).rejects.toThrow('RedemptionConfig already exists for this offerId');

    expect(mockTransactionManager.withTransaction).not.toHaveBeenCalled();
  });
});
