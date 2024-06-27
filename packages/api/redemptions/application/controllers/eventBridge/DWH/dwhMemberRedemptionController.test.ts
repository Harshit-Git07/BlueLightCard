import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '@blc-mono/core/constants/redemptions';
import { as } from '@blc-mono/core/utils/testing';
import { IDwhLoggingService } from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';
import { redemptionTypeEnum } from '@blc-mono/redemptions/libs/database/schema';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { UnknownEventBridgeEvent } from '../EventBridgeController';

import { DwhMemberRedemptionController } from './dwhMemberRedemptionController';

describe('DwhMemberRedemptionController', () => {
  describe('invoke', () => {
    it('should call the service correctly', async () => {
      // Arrange
      const testLogger = createTestLogger();
      const service = {
        logMemberRedemption: jest.fn(),
      } satisfies Partial<IDwhLoggingService>;
      const controller = new DwhMemberRedemptionController(testLogger, as(service));
      const mockEvent = {
        'detail-type': RedemptionEventDetailType.MEMBER_REDEMPTION,
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
            brazeExternalUserId: faker.string.uuid(),
          },
          redemptionDetails: {
            redemptionId: String(
              faker.number.int({
                min: 1,
                max: 1_000_000,
              }),
            ),
            redemptionType: 'vault',
            companyId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
            companyName: faker.company.name(),
            offerId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
            offerName: faker.commerce.productName(),
            code: faker.string.alphanumeric(10),
            affiliate: faker.company.name(),
            url: faker.internet.url(),
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
      expect(service.logMemberRedemption).toHaveBeenCalledTimes(1);
      expect(service.logMemberRedemption).toHaveBeenCalledWith({
        data: {
          // clientType: mockEvent.detail.redemptionDetails.clientType,
          code: mockEvent.detail.redemptionDetails.code,
          companyId: mockEvent.detail.redemptionDetails.companyId,
          offerId: mockEvent.detail.redemptionDetails.offerId,
          memberId: mockEvent.detail.memberDetails.memberId,
          redemptionType: mockEvent.detail.redemptionDetails.redemptionType,
        },
      });

      expect(service.logMemberRedemption).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            code: mockEvent.detail.redemptionDetails.code,
            companyId: mockEvent.detail.redemptionDetails.companyId,
            offerId: mockEvent.detail.redemptionDetails.offerId,
            memberId: mockEvent.detail.memberDetails.memberId,
            redemptionType: mockEvent.detail.redemptionDetails.redemptionType,
          },
        }),
      );
    });
    it('should return error if request is invalid', async () => {
      // Arrange
      const testLogger = createSilentLogger();
      const service = {
        logMemberRetrievedRedemptionDetailsToDwh: jest.fn(),
      } satisfies Partial<IDwhLoggingService>;
      const controller = new DwhMemberRedemptionController(testLogger, as(service));
      const mockEvent = {
        'detail-type': RedemptionEventDetailType.MEMBER_REDEMPTION,
        source: REDEMPTIONS_EVENT_SOURCE,
        account: faker.string.numeric(),
        detail: {
          // Intentionally omit member details
          // memberDetails: {
          //   memberId: faker.number
          //     .int({
          //       min: 1,
          //       max: 1_000_000,
          //     })
          //     .toString(),
          //   brazeExternalUserId: faker.string.uuid(),
          // },
          redemptionDetails: {
            redemptionType: faker.helpers.arrayElement(redemptionTypeEnum.enumValues),
            companyId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
            companyName: faker.company.name(),
            offerId: faker.number.int({
              min: 1,
              max: 1_000_000,
            }),
            offerName: faker.commerce.productName(),
            code: faker.string.alphanumeric(10),
            affiliate: faker.company.name(),
            url: faker.internet.url(),
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
