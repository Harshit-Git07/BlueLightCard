import { faker } from '@faker-js/faker';
import { ZodError } from 'zod';

import { as } from '@blc-mono/core/utils/testing';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IRedemptionsRepository } from '../../repositories/RedemptionsRepository';

import { CreateRedemptionConfigService } from './CreateRedemptionConfigService';

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

    const mockRedemptionsRepository: Partial<IRedemptionsRepository> = {
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

  it("returns 'kind: ValidationError' for a validation error request", async () => {
    const logger = createSilentLogger();

    const mockRedemptionsRepository: Partial<IRedemptionsRepository> = {
      createRedemption: jest.fn(),
      findOneById: jest.fn(),
      findOneByOfferId: jest.fn().mockResolvedValue(null),
    };
    const service = new CreateRedemptionConfigService(logger, as(mockRedemptionsRepository));

    const result = await service.createRedemptionConfig(as({ bad: 'request' }));

    expect(result.kind).toStrictEqual('ValidationError');
    expect(result.data).toStrictEqual(expect.any(ZodError));
  });

  it("returns 'kind: Error' when an error is caught", async () => {
    const logger = createSilentLogger();

    const showCardRequest = {
      companyId: faker.number.int(),
      offerId: faker.number.int(),
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'showCard',
    } as const;

    const mockRedemptionsRepository: Partial<IRedemptionsRepository> = {
      createRedemption: jest.fn().mockResolvedValue({ id: 'redemption-id' }),
      findOneById: jest.fn().mockResolvedValue(undefined),
      findOneByOfferId: jest.fn().mockResolvedValue(null),
    };
    const service = new CreateRedemptionConfigService(logger, as(mockRedemptionsRepository));

    const result = await service.createRedemptionConfig(showCardRequest);

    expect(result.kind).toStrictEqual('Error');
    expect(logger.error).toHaveBeenCalledWith({
      context: { offerId: showCardRequest.offerId, redemptionId: 'redemption-id' },
      message: 'Unable to fetch newly created redemption',
    });
  });

  it("returns 'kind: DuplicationError' when an offerId already has a redemption config", async () => {
    const logger = createSilentLogger();

    const showCardRequest = {
      companyId: faker.number.int(),
      offerId: faker.number.int(),
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'showCard',
    } as const;

    const mockRedemptionsRepository: Partial<IRedemptionsRepository> = {
      findOneByOfferId: jest.fn().mockResolvedValue(true),
    };
    const service = new CreateRedemptionConfigService(logger, as(mockRedemptionsRepository));

    const result = await service.createRedemptionConfig(showCardRequest);

    expect(result.kind).toStrictEqual('DuplicationError');
  });
});
