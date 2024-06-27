import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { as } from '@blc-mono/core/utils/testing';

import {
  DwhLoggingService,
  MemberRedeemIntentParams,
  MemberRedemptionParamsDto,
  MemberRetrievedRedemptionDetailsParams,
} from './dwhLoggingService';

describe('DwhLoggingService', () => {
  describe('logMemberRetrievedRedemptionDetailsToDwh', () => {
    it('should call DwhRepository.logOfferView correctly', async () => {
      // Arrange
      const repository = {
        logOfferView: jest.fn(),
      };
      const service = new DwhLoggingService(as(repository));
      const params: MemberRetrievedRedemptionDetailsParams = {
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        clientType: faker.helpers.arrayElement(['web', 'mobile']),
      };

      // Act
      await service.logMemberRetrievedRedemptionDetailsToDwh(params);

      // Assert
      expect(repository.logOfferView).toHaveBeenCalledTimes(1);
      expect(repository.logOfferView).toHaveBeenCalledWith(
        params.offerId,
        params.companyId,
        params.memberId,
        params.clientType,
      );
    });

    it('should bubble errors to the caller', async () => {
      // Arrange
      const repository = {
        logOfferView: jest.fn().mockRejectedValue(new Error('Test error')),
      };
      const service = new DwhLoggingService(as(repository));
      const params: MemberRetrievedRedemptionDetailsParams = {
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        clientType: faker.helpers.arrayElement(['web', 'mobile']),
      };

      // Act
      const act = () => service.logMemberRetrievedRedemptionDetailsToDwh(params);

      // Assert
      await expect(act).rejects.toThrow('Test error');
    });
  });

  describe('logMemberRedemptionIntentToDwh', () => {
    it('should call DwhRepository.logRedemptionAttempt correctly', async () => {
      // Arrange
      const repository = {
        logRedemptionAttempt: jest.fn(),
      };
      const service = new DwhLoggingService(as(repository));
      const params: MemberRedeemIntentParams = {
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
        clientType: faker.helpers.arrayElement(['web', 'mobile']),
      };

      // Act
      await service.logMemberRedemptionIntentToDwh(params);

      // Assert
      expect(repository.logRedemptionAttempt).toHaveBeenCalledTimes(1);
      expect(repository.logRedemptionAttempt).toHaveBeenCalledWith(
        params.offerId,
        params.companyId,
        params.memberId,
        params.clientType,
      );
    });

    it('should bubble errors to the caller', async () => {
      // Arrange
      const repository = {
        logRedemptionAttempt: jest.fn().mockRejectedValue(new Error('Test error')),
      };
      const service = new DwhLoggingService(as(repository));
      const params: MemberRedeemIntentParams = {
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
        clientType: faker.helpers.arrayElement(['web', 'mobile']),
      };

      // Act
      const act = () => service.logMemberRedemptionIntentToDwh(params);

      // Assert
      await expect(act).rejects.toThrow('Test error');
    });
  });

  describe('logMemberRedemption', () => {
    it('logs all redemptions to the data warehouse', async () => {
      // Arrange
      const repository = {
        logVaultRedemption: jest.fn(),
        logRedemption: jest.fn(),
      };
      const service = new DwhLoggingService(as(repository));
      const params = new MemberRedemptionParamsDto({
        clientType: 'web',
        redemptionType: 'generic',
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
        code: faker.string.alphanumeric(),
      });

      // Act
      await service.logMemberRedemption(params);

      // Assert
      expect(repository.logRedemption).toHaveBeenCalledTimes(1);
      expect(repository.logRedemption).toHaveBeenCalledWith(params);
    });

    it('should call DwhRepository.logVaultRedemption correctly if the redemption type is vault', async () => {
      // Arrange
      const repository = {
        logVaultRedemption: jest.fn(),
        logRedemption: jest.fn(),
      };
      const service = new DwhLoggingService(as(repository));
      const params = new MemberRedemptionParamsDto({
        clientType: 'web',
        redemptionType: 'vault',
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
        code: faker.string.alphanumeric(),
      });

      // Act
      await service.logMemberRedemption(params);

      // Assert
      expect(repository.logVaultRedemption).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = params.data as any;
      expect(repository.logVaultRedemption).toHaveBeenCalledWith(
        data.offerId,
        data.companyId,
        data.memberId,
        data.code,
      );
    });

    it('should not call DwhRepository.logVaultRedemption if the redemption type is not vault', async () => {
      // Arrange
      const repository = {
        logVaultRedemption: jest.fn(),
        logRedemption: jest.fn(),
      };
      const service = new DwhLoggingService(as(repository));
      const params = new MemberRedemptionParamsDto({
        clientType: 'web',
        redemptionType: 'generic',
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
        code: faker.string.alphanumeric(),
      });

      // Act
      await service.logMemberRedemption(params);

      // Assert
      expect(repository.logVaultRedemption).not.toHaveBeenCalled();
    });

    it('should bubble errors to the caller', async () => {
      // Arrange
      const repository = {
        logVaultRedemption: jest.fn().mockRejectedValue(new Error('Test error')),
        logRedemption: jest.fn(),
      };
      const service = new DwhLoggingService(as(repository));
      const params = new MemberRedemptionParamsDto({
        clientType: 'mobile',
        redemptionType: 'vault',
        offerId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
        code: faker.string.alphanumeric(),
      });

      // Act
      const act = () => service.logMemberRedemption(params);

      // Assert
      await expect(act).rejects.toThrow('Test error');
    });
  });
});
