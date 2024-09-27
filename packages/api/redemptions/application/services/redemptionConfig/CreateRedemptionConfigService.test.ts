import { faker } from '@faker-js/faker';
import { ZodError } from 'zod';

import { as } from '@blc-mono/core/utils/testing';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IRedemptionConfigRepository, RedemptionConfigEntity } from '../../repositories/RedemptionConfigRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

import { CreateRedemptionConfigService, SchemaValidationError, ServiceError } from './CreateRedemptionConfigService';

const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
  createRedemption: jest.fn(),
  findOneById: jest.fn(),
  findOneByOfferId: jest.fn(),
};

const mockRedemptionConfigTransformer: Partial<RedemptionConfigTransformer> = {
  transformToRedemptionConfig: jest.fn(),
};

const showCardRequest = {
  companyId: faker.number.int(),
  offerId: faker.number.int(),
  connection: 'none',
  offerType: 'in-store',
  redemptionType: 'showCard',
} as const;

const redemptionConfigEntity: RedemptionConfigEntity = {
  id: 'someId',
  companyId: faker.number.int(),
  offerId: faker.number.int(),
  affiliate: 'awin',
  url: 'https://example.com',
  connection: 'direct',
  offerType: 'online',
  redemptionType: 'showCard',
};

describe('CreateRedemptionConfigService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls transformToRedemptionConfig with correct values', async () => {
    const logger = createTestLogger();

    mockRedemptionsRepository.createRedemption = jest.fn().mockResolvedValue({ id: 'redemption-id' });
    mockRedemptionsRepository.findOneById = jest.fn().mockResolvedValue(redemptionConfigEntity);

    const service = new CreateRedemptionConfigService(
      logger,
      as(mockRedemptionsRepository),
      as(mockRedemptionConfigTransformer),
    );

    await service.createRedemptionConfig(showCardRequest);

    expect(mockRedemptionConfigTransformer.transformToRedemptionConfig).toHaveBeenCalledWith({
      redemptionConfigEntity: redemptionConfigEntity,
      genericEntity: null,
      vaultEntity: null,
      vaultBatchEntities: [],
    });

    expect(mockRedemptionsRepository.createRedemption).toHaveBeenCalledTimes(1);
  });

  it("returns 'kind: OK' for a successful request", async () => {
    const logger = createTestLogger();

    const showCardRedemptionConfig: RedemptionConfig = {
      ...showCardRequest,
      companyId: showCardRequest.companyId.toString(),
      offerId: showCardRequest.offerId.toString(),
      id: 'redemption-id',
    };

    mockRedemptionsRepository.createRedemption = jest.fn().mockResolvedValue({ id: 'redemption-id' });
    mockRedemptionsRepository.findOneById = jest.fn().mockResolvedValue(redemptionConfigEntity);

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(showCardRedemptionConfig);

    const service = new CreateRedemptionConfigService(
      logger,
      as(mockRedemptionsRepository),
      as(mockRedemptionConfigTransformer),
    );

    const result = await service.createRedemptionConfig(showCardRequest);

    expect(result.kind).toEqual('Ok');
    expect(result.data).toStrictEqual(showCardRedemptionConfig);
    expect(mockRedemptionsRepository.createRedemption).toHaveBeenCalledTimes(1);
  });

  it('throws an error when the created redemption config cannot be retrieved', async () => {
    const logger = createSilentLogger();

    mockRedemptionsRepository.createRedemption = jest.fn().mockResolvedValue({ id: 'redemption-id' });
    mockRedemptionsRepository.findOneById = jest.fn().mockResolvedValue(undefined);

    const service = new CreateRedemptionConfigService(
      logger,
      as(mockRedemptionsRepository),
      as(mockRedemptionConfigTransformer),
    );

    await expect(service.createRedemptionConfig(showCardRequest)).rejects.toThrow();

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Unable to fetch newly created redemption',
      context: { offerId: showCardRequest.offerId, redemptionId: 'redemption-id' },
    });
  });

  it('throws an error when an offerId already has a redemption config', async () => {
    const logger = createSilentLogger();

    const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
      findOneByOfferId: jest.fn().mockResolvedValue(true),
    };

    const service = new CreateRedemptionConfigService(
      logger,
      as(mockRedemptionsRepository),
      as(mockRedemptionConfigTransformer),
    );

    try {
      await service.createRedemptionConfig(showCardRequest);
    } catch (e) {
      expect(e).toBeInstanceOf(ServiceError);
      const error = e as ServiceError;
      expect(error.name).toBe('ServiceError');
      expect(error.message).toBe('The offerId already has a redemption config');
    }
  });

  it('throws an error when there is a schema validation failure', async () => {
    const logger = createSilentLogger();

    const showCardRequestWithInvalidCompanyId = {
      companyId: 'invalid-companyId',
      offerId: faker.number.int(),
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'showCard',
    } as const;

    const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
      createRedemption: jest.fn(),
      findOneById: jest.fn(),
      findOneByOfferId: jest.fn(),
    };

    const service = new CreateRedemptionConfigService(
      logger,
      as(mockRedemptionsRepository),
      as(mockRedemptionConfigTransformer),
    );

    try {
      await service.createRedemptionConfig(as(showCardRequestWithInvalidCompanyId));
    } catch (e) {
      expect(e).toBeInstanceOf(SchemaValidationError);
      const error = e as SchemaValidationError;
      expect(error.name).toBe('SchemaValidationError');
      expect(error.message).toBe('Validation Error');
      expect(error.data).toStrictEqual(expect.any(ZodError));
    }
  });

  it('rethrows an error when an error is caught', async () => {
    const logger = createSilentLogger();

    const someError = new Error('some error');

    const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
      createRedemption: jest.fn().mockRejectedValue(someError),
      findOneById: jest.fn(),
      findOneByOfferId: jest.fn(),
    };

    const service = new CreateRedemptionConfigService(
      logger,
      as(mockRedemptionsRepository),
      as(mockRedemptionConfigTransformer),
    );

    await expect(service.createRedemptionConfig(showCardRequest)).rejects.toThrow();

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Error when creating redemption configuration',
      error: someError,
    });
  });
});
