import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IDwhRepository } from '../../repositories/DwhRepository';

import { CallbackService, ICallbackService } from './CallbackService';

describe('CallbackService', () => {
  // These test fields are just assumptions, the actual fields types are not known. We're just forwarding them directly to Firehose
  const testOfferId = faker.number.int({
    min: 0,
    max: 1000000,
  });
  const testCode = faker.string.sample(10);
  const testOrderValue = faker.number.int({
    min: 0,
    max: 1000000,
  });
  const testCurrency = faker.finance.currencyCode();
  const testRedeemedAt = faker.date.recent().toISOString();

  function mockDwhRepository(): IDwhRepository {
    return {
      logCallbackVaultRedemption: jest.fn(),
      logOfferView: jest.fn(),
      logRedemption: jest.fn(),
      logRedemptionAttempt: jest.fn(),
      logVaultRedemption: jest.fn(),
    };
  }

  function createCallbackService(
    logger: ILogger,
    override: {
      dwhRepository: IDwhRepository;
    },
  ): ICallbackService {
    const dwhRepository = override.dwhRepository ?? mockDwhRepository();
    const callbackService = new CallbackService(logger, dwhRepository);

    return callbackService;
  }

  it('should log callback vault redemption firehose stream and return NoContent kind', async () => {
    // Arrange
    const mockedLogger = createTestLogger();
    const mockedDwhRepository = mockDwhRepository();
    mockedDwhRepository.logCallbackVaultRedemption = jest.fn().mockResolvedValue(undefined);
    const service = await createCallbackService(mockedLogger, {
      dwhRepository: mockedDwhRepository,
    });

    // Act
    const result = await service.handle({
      code: testCode,
      currency: testCurrency,
      offerId: testOfferId,
      orderValue: testOrderValue,
      redeemedAt: testRedeemedAt,
    });

    // Assert
    expect(result.kind).toEqual('NoContent');
    expect(mockedDwhRepository.logCallbackVaultRedemption).toHaveBeenCalledTimes(1);
    expect(mockedDwhRepository.logCallbackVaultRedemption).toHaveBeenCalledWith(
      testOfferId,
      testCode,
      testOrderValue,
      testCurrency,
      testRedeemedAt,
    );
  });

  it('Should return Error kind if an error occurs', async () => {
    // Arrange
    const mockedSilentLogger = createSilentLogger();
    const mockedDwhRepository = mockDwhRepository();
    mockedDwhRepository.logCallbackVaultRedemption = jest.fn().mockRejectedValue(new Error('Test error'));
    const service = await createCallbackService(mockedSilentLogger, {
      dwhRepository: mockedDwhRepository,
    });

    // Act
    const result = await service.handle({
      code: testCode,
      currency: testCurrency,
      offerId: testOfferId,
      orderValue: testOrderValue,
      redeemedAt: testRedeemedAt,
    });

    // Assert
    expect(result.kind).toEqual('Error');
  });
});
