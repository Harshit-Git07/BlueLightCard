import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { as } from '@blc-mono/core/utils/testing';
import {
  memberRedemptionEventFactory,
  memberRedemptionParamsFactory,
} from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';

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
        offerId: faker.string.uuid(),
        companyId: faker.string.uuid(),
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
        offerId: faker.string.uuid(),
        companyId: faker.string.uuid(),
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
        offerId: faker.string.uuid(),
        companyId: faker.string.uuid(),
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
        offerId: faker.string.uuid(),
        companyId: faker.string.uuid(),
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
      const params = new MemberRedemptionParamsDto(memberRedemptionParamsFactory.build());

      // Act
      await service.logMemberRedemption(params);

      // Assert
      expect(repository.logRedemption).toHaveBeenCalledTimes(1);
      expect(repository.logRedemption).toHaveBeenCalledWith(params);
    });

    it.each(['vault', 'vaultQR'] as const)(
      'should call DwhRepository.logVaultRedemption correctly if the redemption type is %s',
      async (redemptionType) => {
        // Arrange
        const repository = {
          logVaultRedemption: jest.fn(),
          logRedemption: jest.fn(),
        };

        const service = new DwhLoggingService(as(repository));
        const params = new MemberRedemptionParamsDto(
          memberRedemptionParamsFactory.build({
            redemptionType,
          }),
        );

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
      },
    );

    it('should not call DwhRepository.logVaultRedemption if the redemption type is not vault', async () => {
      // Arrange
      const repository = {
        logVaultRedemption: jest.fn(),
        logRedemption: jest.fn(),
      };
      const service = new DwhLoggingService(as(repository));
      const params = new MemberRedemptionParamsDto(
        memberRedemptionParamsFactory.build({
          redemptionType: 'generic',
        }),
      );

      // Act
      await service.logMemberRedemption(params);

      // Assert
      expect(repository.logVaultRedemption).not.toHaveBeenCalled();
    });

    it('should bubble errors to the caller', async () => {
      // Arrange
      const repository = {
        logVaultRedemption: jest.fn().mockRejectedValue(new Error('Test error')),
        logRedemption: jest.fn().mockRejectedValue(new Error('Test error')),
      };
      const service = new DwhLoggingService(as(repository));
      const params = new MemberRedemptionParamsDto(memberRedemptionParamsFactory.build());

      // Act
      const act = () => service.logMemberRedemption(params);

      // Assert
      await expect(act).rejects.toThrow('Test error');
    });
  });

  describe('MemberRedemptionParamsDto', () => {
    it.each(['generic', 'preApplied', 'showCard', 'vault'] as const)(
      'allows creation of a DTO from a %s redemption event',
      (redemptionType) => {
        const event = memberRedemptionEventFactory.build({
          detail: {
            redemptionDetails: {
              redemptionType: redemptionType,
            },
          },
        });
        const dto = MemberRedemptionParamsDto.fromMemberRedemptionEvent(event);

        const redemptionDetails = event.detail.redemptionDetails;
        expect(dto.data.redemptionType).toBe(redemptionType);
        expect(dto.data.clientType).toBe(redemptionDetails.clientType);
        expect(dto.data.companyId).toBe(redemptionDetails.companyId);
        expect(dto.data.offerId).toBe(redemptionDetails.offerId);
        expect(dto.data.memberId).toBe(event.detail.memberDetails.memberId);
      },
    );
  });
});
