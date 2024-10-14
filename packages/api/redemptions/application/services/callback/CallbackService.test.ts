import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { eagleEyeModelFactory, uniqodoModelFactory } from '@blc-mono/redemptions/libs/test/factories/callback.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IDwhRepository } from '../../repositories/DwhRepository';

import { CallbackService, ICallbackService } from './CallbackService';

describe('CallbackService', () => {
  function mockDwhRepository(): IDwhRepository {
    return {
      logOfferView: jest.fn(),
      logRedemption: jest.fn(),
      logRedemptionAttempt: jest.fn(),
      logVaultRedemption: jest.fn(),
      logCallbackEagleEyeVaultRedemption: jest.fn(),
      logCallbackUniqodoVaultRedemption: jest.fn(),
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
    const testUniqodoData = uniqodoModelFactory.build();
    const testEagleEyeData = eagleEyeModelFactory.build();

    it('should log callback vault redemption firehose stream and return NoContent kind', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      const mockedDwhRepository = mockDwhRepository();
      mockedDwhRepository.logCallbackEagleEyeVaultRedemption = jest.fn().mockResolvedValue(undefined);
      mockedDwhRepository.logCallbackUniqodoVaultRedemption = jest.fn().mockResolvedValue(undefined);
      const service = createCallbackService(mockedLogger, {
        dwhRepository: mockedDwhRepository,
      });

      // Act
      const result = await service.handle(integrationType === 'uniqodo' ? testUniqodoData : testEagleEyeData);

      // Assert
      expect(result.kind).toEqual('NoContent');
      if (integrationType === 'uniqodo') {
        expect(mockedDwhRepository.logCallbackUniqodoVaultRedemption).toHaveBeenCalledTimes(1);
        expect(mockedDwhRepository.logCallbackUniqodoVaultRedemption).toHaveBeenCalledWith(testUniqodoData);
      }
      if (integrationType === 'eagleeye') {
        expect(mockedDwhRepository.logCallbackEagleEyeVaultRedemption).toHaveBeenCalledTimes(1);
        expect(mockedDwhRepository.logCallbackEagleEyeVaultRedemption).toHaveBeenCalledWith(testEagleEyeData);
      }
    });

    it('Should return Error kind if an error occurs', async () => {
      // Arrange
      const mockedSilentLogger = createSilentLogger();
      const mockedDwhRepository = mockDwhRepository();
      mockedDwhRepository.logCallbackEagleEyeVaultRedemption = jest.fn().mockRejectedValue(new Error('Test error'));
      mockedDwhRepository.logCallbackUniqodoVaultRedemption = jest.fn().mockRejectedValue(new Error('Test error'));
      const service = createCallbackService(mockedSilentLogger, {
        dwhRepository: mockedDwhRepository,
      });

      // Act
      const result = await service.handle(integrationType === 'uniqodo' ? testUniqodoData : testEagleEyeData);

      // Assert
      expect(result.kind).toEqual('Error');
    });
  });
});
