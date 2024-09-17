import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { memberRedemptionEventDetailFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IAdminEmailRepository } from '../../repositories/AdminEmailRepository';
import { IVaultCodesRepository } from '../../repositories/VaultCodesRepository';

import { VaultThresholdService } from './VaultThresholdService';

jest.mock('@blc-mono/core/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === 'REDEMPTIONS_EMAIL_FROM') {
      return 'noreply@bluelightcard.co.uk';
    }
  }),
}));

describe('AdminEmailService', () => {
  function mockAdminEmailRepo(): IAdminEmailRepository {
    return {
      sendVaultBatchCreatedEmail: jest.fn(),
      sendVaultThresholdEmail: jest.fn(),
    };
  }

  function mockVaultCodesRepo(): IVaultCodesRepository {
    return {
      checkIfMemberReachedMaxCodeClaimed: jest.fn(),
      checkVaultCodesRemaining: jest.fn(),
      claimVaultCode: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      findManyByBatchId: jest.fn(),
      updateManyByBatchId: jest.fn(),
      withTransaction: jest.fn(),
      deleteUnclaimedCodesByBatchId: jest.fn(),
      findClaimedCodesByBatchId: jest.fn(),
      findUnclaimedCodesByBatchId: jest.fn(),
    };
  }

  function getVaultThresholdService(
    logger: ILogger,
    override: {
      vaultCodesRepo?: IVaultCodesRepository;
      adminEmailRepo?: IAdminEmailRepository;
    },
  ) {
    const mockedAdminEmailRepo = override.adminEmailRepo ?? mockAdminEmailRepo();
    const mockedVaultCodesRepo = override.vaultCodesRepo ?? mockVaultCodesRepo();
    return new VaultThresholdService(logger, mockedVaultCodesRepo, mockedAdminEmailRepo);
  }

  describe('checkIfVaultThresholdHit', () => {
    const randomInteger = faker.number.int({
      min: 1,
      max: 1_000_000,
    });

    it.each([
      // unclaimed, alert below, expected
      // Success cases - 75% 50% 25% 0
      [10000, 10000, 100],
      [7500, 10000, 75],
      [5000, 10000, 50],
      [2500, 10000, 25],
      [0, 10000, 0],
      [33333, 33333, 100],
      [24999, 33333, 75],
      [16666, 33333, 50],
      [8333, 33333, 25],
      [0, 33333, 0],
      [randomInteger, randomInteger, 100],
      [Math.floor(randomInteger * 0.75), randomInteger, 75],
      [Math.floor(randomInteger * 0.5), randomInteger, 50],
      [Math.floor(randomInteger * 0.25), randomInteger, 25],
      [0, randomInteger, 0],
      // Fail cases - 76%/74% 51%/49% 26%/25% 1
      [10001, 10000, false],
      [9999, 10000, false],
      [7501, 10000, false],
      [7499, 10000, false],
      [5001, 10000, false],
      [4999, 10000, false],
      [2501, 10000, false],
      [2499, 10000, false],
      [9999, 10000, false],
      [1, 10000, false],
      [33334, 33333, false],
      [33332, 33333, false],
      [24998, 33333, false],
      [25000, 33333, false],
      [16665, 33333, false],
      [16667, 33333, false],
      [8332, 33333, false],
      [8334, 33333, false],
      [1, 33333, false],
      [Math.floor(randomInteger * 0.75) + 1, randomInteger, false],
      [Math.floor(randomInteger * 0.75) - 1, randomInteger, false],
      [Math.floor(randomInteger * 0.5) + 1, randomInteger, false],
      [Math.floor(randomInteger * 0.5) - 1, randomInteger, false],
      [Math.floor(randomInteger * 0.25) + 1, randomInteger, false],
      [Math.floor(randomInteger * 0.25) - 1, randomInteger, false],
      [1, randomInteger, false],
    ])(
      'if remaining %d codes with %d of alert below, expected threshold check response to be %s',
      (unclaimed, total, expected) => {
        // Arrange
        const mockedLogger = createTestLogger();
        const mockedVaultCodesRepo = mockVaultCodesRepo();
        mockedVaultCodesRepo.checkVaultCodesRemaining = jest.fn().mockResolvedValue({
          totalCodes: total,
          unclaimedCodes: unclaimed,
        });
        const service = getVaultThresholdService(mockedLogger, {
          vaultCodesRepo: mockedVaultCodesRepo,
        });

        // Act
        const vaultThreshold = service.checkIfVaultThresholdHit(total, unclaimed);

        // Assert
        expect(vaultThreshold).toBe(expected);
      },
    );
  });

  describe('handleVaultThresholdEmail', () => {
    it('should send email successfully if decision is true', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      const eventDetail = memberRedemptionEventDetailFactory.build({
        redemptionDetails: {
          vaultDetails: {
            vaultType: 'standard',
            alertBelow: 100,
          },
        },
      });
      const mockedAdminEmailRepo = mockAdminEmailRepo();
      mockedAdminEmailRepo.sendVaultThresholdEmail = jest.fn().mockResolvedValue(undefined);
      const mockedVaultCodesRepo = mockVaultCodesRepo();
      mockedVaultCodesRepo.checkVaultCodesRemaining = jest.fn().mockResolvedValue(50);
      const service = getVaultThresholdService(mockedLogger, {
        vaultCodesRepo: mockedVaultCodesRepo,
        adminEmailRepo: mockedAdminEmailRepo,
      });
      // Act
      const result = await service.handleVaultThresholdEmail(eventDetail);

      // Assert
      expect(result).toBeUndefined();
      expect(mockedVaultCodesRepo.checkVaultCodesRemaining).toHaveBeenCalled();
      expect(mockedAdminEmailRepo.sendVaultThresholdEmail).toHaveBeenCalledWith({
        alertBelow: eventDetail.redemptionDetails.vaultDetails?.alertBelow,
        companyName: eventDetail.redemptionDetails.companyName,
        offerId: eventDetail.redemptionDetails.offerId,
        offerName: eventDetail.redemptionDetails.offerName,
        remainingCodes: 50,
        thresholdPercentage: 50,
        recipient: eventDetail.redemptionDetails.vaultDetails?.email,
      });
      expect(mockedLogger.info).toHaveBeenCalledWith({
        message: 'Vault Threshold Email - Thresholds',
        context: { thresholds: { 0: 0, 25: 25, 50: 50, 75: 75, 100: 100 }, unclaimedCodes: 50 },
      });
    });

    it('should not send email if decision is false', async () => {
      // Arrange
      const mockedSilentLogger = createSilentLogger();
      const eventDetail = memberRedemptionEventDetailFactory.build({
        redemptionDetails: {
          vaultDetails: {
            vaultType: 'standard',
            alertBelow: 101,
          },
        },
      });
      const mockedAdminEmailRepo = mockAdminEmailRepo();
      mockedAdminEmailRepo.sendVaultThresholdEmail = jest.fn().mockResolvedValue(undefined);
      const mockedVaultCodesRepo = mockVaultCodesRepo();
      mockedVaultCodesRepo.checkVaultCodesRemaining = jest.fn().mockResolvedValue(51);

      const service = getVaultThresholdService(mockedSilentLogger, {
        vaultCodesRepo: mockedVaultCodesRepo,
        adminEmailRepo: mockedAdminEmailRepo,
      });
      // Act
      const result = await service.handleVaultThresholdEmail(eventDetail);

      // Assert
      expect(result).toBeUndefined();
      expect(mockedVaultCodesRepo.checkVaultCodesRemaining).toHaveBeenCalled();
      expect(mockedAdminEmailRepo.sendVaultThresholdEmail).not.toHaveBeenCalled();
      expect(mockedSilentLogger.info).toHaveBeenCalledWith({
        message: 'Vault Threshold Email - Thresholds',
        context: { thresholds: { 0: 0, 25: 25, 50: 50, 75: 75, 101: 100 }, unclaimedCodes: 51 },
      });
      expect(mockedSilentLogger.error).toHaveBeenCalledWith({
        message: 'Vault Threshold Email Standard - Email was not sent',
        context: {
          redemptionDetails: eventDetail.redemptionDetails,
          vaultDetails: eventDetail.redemptionDetails.vaultDetails,
          thresholdPercentage: false,
        },
      });
    });

    it('should not send email if vaultType is legacy', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      const eventDetail = memberRedemptionEventDetailFactory.build({
        redemptionDetails: {
          vaultDetails: {
            vaultType: 'legacy',
            alertBelow: 101,
          },
        },
      });
      const mockedAdminEmailRepo = mockAdminEmailRepo();
      const mockedVaultCodesRepo = mockVaultCodesRepo();
      const service = getVaultThresholdService(mockedLogger, {
        vaultCodesRepo: mockedVaultCodesRepo,
        adminEmailRepo: mockedAdminEmailRepo,
      });

      // Act
      const result = await service.handleVaultThresholdEmail(eventDetail);

      // Assert
      expect(result).toBeUndefined();
      expect(mockedVaultCodesRepo.checkVaultCodesRemaining).not.toHaveBeenCalled();
      expect(mockedAdminEmailRepo.sendVaultThresholdEmail).not.toHaveBeenCalled();
    });
  });
});
