import { faker } from '@faker-js/faker';

import { memberRedemptionEventDetailFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IAdminEmailRepository } from '../../repositories/AdminEmailRepository';
import { ILegacyVaultApiRepository } from '../../repositories/LegacyVaultApiRepository';
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
  function getVaultThresholdService(override: {
    vaultCodesRepo?: IVaultCodesRepository;
    legacyVaultApiRepo?: ILegacyVaultApiRepository;
    adminEmailRepo?: IAdminEmailRepository;
  }) {
    const mockAdminEmailRepo = override.adminEmailRepo ?? {
      sendVaultThresholdEmail: jest.fn(),
    };
    const mockLegacyVaultApiRepo = override.legacyVaultApiRepo ?? {
      assignCodeToMember: jest.fn(),
      findVaultsRelatingToLinkId: jest.fn(),
      getCodesRedeemed: jest.fn(),
      getNumberOfCodesIssued: jest.fn(),
      checkVaultStock: jest.fn(),
      viewVaultBatches: jest.fn(),
    };
    const mockVaultCodesRepo = override.vaultCodesRepo ?? {
      checkIfMemberReachedMaxCodeClaimed: jest.fn(),
      checkVaultCodesRemaining: jest.fn(),
      createVaultCode: jest.fn(),
      findOneByCode: jest.fn(),
      findOneByOfferId: jest.fn(),
      claimVaultCode: jest.fn(),
      updateOneByCode: jest.fn(),
      withTransaction: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      findManyByBatchId: jest.fn(),
      updateManyByBatchId: jest.fn(),
    };
    const logger = createTestLogger();
    return new VaultThresholdService(logger, mockLegacyVaultApiRepo, mockVaultCodesRepo, mockAdminEmailRepo);
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
        const mockVaultCodesRepository: IVaultCodesRepository = {
          checkVaultCodesRemaining: jest.fn().mockResolvedValue({
            totalCodes: total,
            unclaimedCodes: unclaimed,
          }),
          checkIfMemberReachedMaxCodeClaimed: jest.fn(),
          claimVaultCode: jest.fn(),
          withTransaction: jest.fn(),
          create: jest.fn(),
          createMany: jest.fn(),
          findManyByBatchId: jest.fn(),
          updateManyByBatchId: jest.fn(),
        };
        jest.spyOn(mockVaultCodesRepository, 'checkVaultCodesRemaining');
        const service = getVaultThresholdService({
          vaultCodesRepo: mockVaultCodesRepository,
        });

        // Act
        const vaultThreshold = service.checkIfVaultThresholdHit(total, unclaimed);

        // Assert
        expect(vaultThreshold).toBe(expected);
      },
    );
  });

  describe('handleVaultThresholdEmail', () => {
    describe.each(['legacy', 'standard'])('vault type %s', (vaultType) => {
      it('should send email successfully if decision is true', async () => {
        // Arrange
        const eventDetail = memberRedemptionEventDetailFactory.build({
          redemptionDetails: {
            vaultDetails: {
              vaultType: vaultType as 'legacy' | 'standard',
              alertBelow: 100,
            },
          },
        });
        const mockAdminEmailRepo: IAdminEmailRepository = {
          sendVaultThresholdEmail: jest.fn().mockResolvedValue(undefined),
        };
        const mockVaultCodesRepo: IVaultCodesRepository = {
          checkVaultCodesRemaining: jest.fn().mockResolvedValue(50),
          checkIfMemberReachedMaxCodeClaimed: jest.fn(),
          claimVaultCode: jest.fn(),
          withTransaction: jest.fn(),
          create: jest.fn(),
          createMany: jest.fn(),
          findManyByBatchId: jest.fn(),
          updateManyByBatchId: jest.fn(),
        };
        const mockLegacyVaultApiRepo: ILegacyVaultApiRepository = {
          viewVaultBatches: jest.fn().mockResolvedValue({
            [faker.string.uuid()]: {
              expires: '2050-01-01 23:59:59',
              dateAdded: '2050-01-01 23:59:59',
              filename: 'something1.csv',
            },
            [faker.string.uuid()]: {
              expires: '2050-01-01 23:59:59',
              dateAdded: '2050-01-01 23:59:59',
              filename: 'something2.csv',
            },
          }),
          checkVaultStock: jest.fn().mockResolvedValue(25),
          assignCodeToMember: jest.fn(),
          findVaultsRelatingToLinkId: jest.fn(),
          getCodesRedeemed: jest.fn(),
          getNumberOfCodesIssued: jest.fn(),
        };
        const service = getVaultThresholdService({
          legacyVaultApiRepo: mockLegacyVaultApiRepo,
          vaultCodesRepo: mockVaultCodesRepo,
          adminEmailRepo: mockAdminEmailRepo,
        });
        // Act
        const result = await service.handleVaultThresholdEmail(eventDetail);

        // Assert
        expect(result).toBeUndefined();
        if (vaultType === 'legacy') {
          expect(mockLegacyVaultApiRepo.viewVaultBatches).toHaveBeenCalled();
          expect(mockLegacyVaultApiRepo.checkVaultStock).toHaveBeenCalledTimes(2);
        }
        if (vaultType === 'standard') {
          expect(mockVaultCodesRepo.checkVaultCodesRemaining).toHaveBeenCalled();
        }
        expect(mockAdminEmailRepo.sendVaultThresholdEmail).toHaveBeenCalled();
      });

      it('should not send email if decision is false', async () => {
        // Arrange
        const eventDetail = memberRedemptionEventDetailFactory.build({
          redemptionDetails: {
            vaultDetails: {
              vaultType: vaultType as 'legacy' | 'standard',
              alertBelow: 101,
            },
          },
        });
        const mockAdminEmailRepo: IAdminEmailRepository = {
          sendVaultThresholdEmail: jest.fn().mockResolvedValue(undefined),
        };
        const mockVaultCodesRepo: IVaultCodesRepository = {
          checkVaultCodesRemaining: jest.fn().mockResolvedValue(51),
          checkIfMemberReachedMaxCodeClaimed: jest.fn(),
          claimVaultCode: jest.fn(),
          withTransaction: jest.fn(),
          create: jest.fn(),
          createMany: jest.fn(),
          findManyByBatchId: jest.fn(),
          updateManyByBatchId: jest.fn(),
        };
        const mockLegacyVaultApiRepo: ILegacyVaultApiRepository = {
          viewVaultBatches: jest.fn().mockResolvedValue({
            [faker.string.uuid()]: {
              expires: '2050-01-01 23:59:59',
              dateAdded: '2050-01-01 23:59:59',
              filename: 'something1.csv',
            },
            [faker.string.uuid()]: {
              expires: '1999-01-01 23:59:59',
              dateAdded: '1999-01-01 23:59:59',
              filename: 'something2.csv',
            },
          }),
          checkVaultStock: jest.fn().mockResolvedValue(1),
          assignCodeToMember: jest.fn(),
          findVaultsRelatingToLinkId: jest.fn(),
          getCodesRedeemed: jest.fn(),
          getNumberOfCodesIssued: jest.fn(),
        };
        const service = getVaultThresholdService({
          legacyVaultApiRepo: mockLegacyVaultApiRepo,
          vaultCodesRepo: mockVaultCodesRepo,
          adminEmailRepo: mockAdminEmailRepo,
        });
        // Act
        const result = await service.handleVaultThresholdEmail(eventDetail);

        // Assert
        expect(result).toBeUndefined();
        if (vaultType === 'legacy') {
          expect(mockLegacyVaultApiRepo.viewVaultBatches).toHaveBeenCalled();
          expect(mockLegacyVaultApiRepo.checkVaultStock).toHaveBeenCalledTimes(1);
        }
        if (vaultType === 'standard') {
          expect(mockVaultCodesRepo.checkVaultCodesRemaining).toHaveBeenCalled();
        }
        expect(mockAdminEmailRepo.sendVaultThresholdEmail).not.toHaveBeenCalled();
      });
    });
  });
});
