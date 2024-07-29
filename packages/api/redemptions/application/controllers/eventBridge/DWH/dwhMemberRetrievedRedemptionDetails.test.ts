import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '@blc-mono/core/constants/redemptions';
import { as } from '@blc-mono/core/utils/testing';
import { IDwhLoggingService } from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';
import { redemptionTypeEnum } from '@blc-mono/redemptions/libs/database/schema';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { UnknownEventBridgeEvent } from '../EventBridgeController';

import { DwhMemberRetrievedRedemptionController } from './dwhMemberRetrievedRedemptionDetails';
describe('DwhMemberRetrievedRedemptionDetails', () => {
  describe('invoke', () => {
    it('should call the service correctly', async () => {
      // Arrange
      const testLogger = createTestLogger();
      const service = {
        logMemberRetrievedRedemptionDetailsToDwh: jest.fn(),
      } satisfies Partial<IDwhLoggingService>;
      const controller = new DwhMemberRetrievedRedemptionController(testLogger, as(service));
      const mockEvent = {
        'detail-type': RedemptionEventDetailType.MEMBER_RETRIEVED_REDEMPTION_DETAILS,
        source: REDEMPTIONS_EVENT_SOURCE,
        account: faker.string.numeric(),
        detail: {
          memberDetails: {
            memberId: faker.number
              .int({
                min: 1,
                max: 1_000_000,
              })
              .toString(),
          },
          redemptionDetails: {
            redemptionType: faker.helpers.arrayElement(redemptionTypeEnum.enumValues),
            offerId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
            companyId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
            clientType: faker.helpers.arrayElement(['web', 'mobile']),
          },
        },
        id: faker.string.uuid(),
        time: faker.date.recent().toISOString(),
        region: faker.helpers.arrayElement(['eu-west-2', 'ap-southeast-2']),
        resources: [],
        version: faker.string.numeric(),
      } satisfies UnknownEventBridgeEvent;

      // Act
      await controller.invoke(mockEvent);

      // Assert
      expect(service.logMemberRetrievedRedemptionDetailsToDwh).toHaveBeenCalledTimes(1);
      expect(service.logMemberRetrievedRedemptionDetailsToDwh).toHaveBeenCalledWith({
        memberId: mockEvent.detail.memberDetails.memberId,
        offerId: mockEvent.detail.redemptionDetails.offerId,
        companyId: mockEvent.detail.redemptionDetails.companyId,
        clientType: mockEvent.detail.redemptionDetails.clientType,
      });
    });
    it('should return error if request is invalid', async () => {
      // Arrange
      const testLogger = createSilentLogger();
      const service = {
        logMemberRetrievedRedemptionDetailsToDwh: jest.fn(),
      } satisfies Partial<IDwhLoggingService>;
      const controller = new DwhMemberRetrievedRedemptionController(testLogger, as(service));
      const mockEvent = {
        'detail-type': RedemptionEventDetailType.MEMBER_RETRIEVED_REDEMPTION_DETAILS,
        source: REDEMPTIONS_EVENT_SOURCE,
        account: faker.string.numeric(),
        detail: {
          // Member details deliberately omitted for testing
          // memberDetails: {
          //   memberId: faker.number.int({
          //     min: 1,
          //     max: 1_000_000,
          //   }).toString(),
          // },
          redemptionDetails: {
            redemptionType: faker.helpers.arrayElement(redemptionTypeEnum.enumValues),
            offerId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
            companyId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
            clientType: faker.helpers.arrayElement(['web', 'mobile']),
          },
        },
        id: faker.string.uuid(),
        time: faker.date.recent().toISOString(),
        region: faker.helpers.arrayElement(['eu-west-2', 'ap-southeast-2']),
        resources: [],
        version: faker.string.numeric(),
      } satisfies UnknownEventBridgeEvent;

      // Act
      const result = controller.invoke(mockEvent);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });
});
