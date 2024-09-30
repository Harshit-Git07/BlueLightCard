import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { IntegrationType } from '@blc-mono/redemptions/libs/models/postCallback';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IDwhRepository } from '../../repositories/DwhRepository';

import { CallbackService, ICallbackService } from './CallbackService';

describe('CallbackService', () => {
  const testOfferId = faker.string.sample(10);
  const testCode = faker.string.sample(10);
  const testOrderValue = faker.string.sample(10);
  const testCurrency = faker.finance.currencyCode();
  const testRedeemedAt = faker.date.recent().toISOString();
  const testMemberId = faker.string.sample(10);

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

  describe.each([['uniqodo'], ['eagleeye']])('Test callback service for %s', (integrationType: string) => {
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
        memberId: testMemberId,
        integrationType: integrationType as IntegrationType,
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
        integrationType,
        testMemberId,
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
        memberId: testMemberId,
        integrationType: integrationType as IntegrationType,
      });

      // Assert
      expect(result.kind).toEqual('Error');
    });
  });
});
