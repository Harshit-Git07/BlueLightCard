import { faker } from '@faker-js/faker';
import { ZodError } from 'zod';

import { as } from '@blc-mono/core/utils/testing';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IRedemptionConfigRepository } from '../../repositories/RedemptionConfigRepository';

import { CreateRedemptionConfigService, SchemaValidationError, ServiceError } from './CreateRedemptionConfigService';

describe('CreateRedemptionConfigService', () => {
  it("returns 'kind: OK' for a successful request", async () => {
    const logger = createTestLogger();

    const showCardRequest = {
      companyId: faker.number.int(),
      offerId: faker.number.int(),
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'showCard',
    } as const;

    const showCardResponse = {
      ...showCardRequest,
      companyId: showCardRequest.companyId.toString(),
      offerId: showCardRequest.offerId.toString(),
      id: 'redemption-id',
    };

    const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
      createRedemption: jest.fn().mockResolvedValue({ id: 'redemption-id' }),
      findOneById: jest.fn().mockResolvedValue(showCardResponse),
      findOneByOfferId: jest.fn().mockResolvedValue(null),
    };

    const service = new CreateRedemptionConfigService(logger, as(mockRedemptionsRepository));

    const result = await service.createRedemptionConfig(showCardRequest);

    expect(result.kind).toEqual('Ok');
    expect(result.data).toStrictEqual(showCardResponse);
    expect(mockRedemptionsRepository.createRedemption).toHaveBeenCalledTimes(1);
  });

  it('rethrows an error when an error is caught', async () => {
    const logger = createSilentLogger();

    const showCardRequest = {
      companyId: faker.number.int(),
      offerId: faker.number.int(),
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'showCard',
    } as const;

    const someError = new Error('some error');

    const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
      createRedemption: jest.fn().mockRejectedValue(someError),
      findOneById: jest.fn(),
      findOneByOfferId: jest.fn(),
    };
    const service = new CreateRedemptionConfigService(logger, as(mockRedemptionsRepository));

    await expect(service.createRedemptionConfig(showCardRequest)).rejects.toThrow();

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Error when creating redemption configuration',
      error: someError,
    });
  });

  it('throws an error when there is a schema validation failure', async () => {
    const logger = createSilentLogger();

    const showCardRequest = {
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

    const service = new CreateRedemptionConfigService(logger, as(mockRedemptionsRepository));

    try {
      await service.createRedemptionConfig(as(showCardRequest));
    } catch (e) {
      expect(e).toBeInstanceOf(SchemaValidationError);
      const error = e as SchemaValidationError;
      expect(error.name).toBe('SchemaValidationError');
      expect(error.message).toBe('Validation Error');
      expect(error.data).toStrictEqual(expect.any(ZodError));
    }
  });

  it('throws an error when an offerId already has a redemption config', async () => {
    const logger = createSilentLogger();

    const showCardRequest = {
      companyId: faker.number.int(),
      offerId: faker.number.int(),
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'showCard',
    } as const;

    const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
      findOneByOfferId: jest.fn().mockResolvedValue(true),
    };
    const service = new CreateRedemptionConfigService(logger, as(mockRedemptionsRepository));

    try {
      await service.createRedemptionConfig(showCardRequest);
    } catch (e) {
      expect(e).toBeInstanceOf(ServiceError);
      const error = e as ServiceError;
      expect(error.name).toBe('ServiceError');
      expect(error.message).toBe('The offerId already has a redemption config');
    }
  });

  it('throws an error when the created redemption config cannot be retrieved', async () => {
    const logger = createSilentLogger();

    const showCardRequest = {
      companyId: faker.number.int(),
      offerId: faker.number.int(),
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'showCard',
    } as const;

    const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {
      createRedemption: jest.fn().mockResolvedValue({ id: 'redemption-id' }),
      findOneById: jest.fn().mockResolvedValue(undefined),
      findOneByOfferId: jest.fn().mockResolvedValue(null),
    };
    const service = new CreateRedemptionConfigService(logger, as(mockRedemptionsRepository));

    await expect(service.createRedemptionConfig(showCardRequest)).rejects.toThrow();

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Unable to fetch newly created redemption',
      context: { offerId: showCardRequest.offerId, redemptionId: 'redemption-id' },
    });
  });
});
