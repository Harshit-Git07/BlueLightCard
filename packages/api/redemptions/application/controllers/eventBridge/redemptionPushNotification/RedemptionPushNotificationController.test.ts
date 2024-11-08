import {
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  RedemptionTypes,
  SHOWCARD,
  VAULT,
  VAULTQR,
} from '@blc-mono/core/constants/redemptions';
import { IPushNotificationService } from '@blc-mono/redemptions/application/services/pushNotification/PushNotificationService';
import { memberRedemptionEventFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedemptionPushNotificationController } from './RedemptionPushNotificationController';

describe('RedemptionPushNotificationController', () => {
  it.each([VAULT, VAULTQR, GENERIC, PREAPPLIED, SHOWCARD, GIFTCARD])(
    `should send push notification for redemption type %s`,
    async (redemptionType) => {
      // Arrange
      const logger = createTestLogger();
      const defaultUrl = redemptionType !== 'showCard' ? 'https://example.com' : undefined;
      const mockPushNotificationService = {
        sendRedemptionPushNotification: jest.fn(),
      } satisfies IPushNotificationService;
      const controller = new RedemptionPushNotificationController(logger, mockPushNotificationService);
      const event = memberRedemptionEventFactory.build({
        detail: {
          redemptionDetails: {
            redemptionType: redemptionType as RedemptionTypes,
            url: defaultUrl,
            clientType: 'mobile',
          },
        },
      });
      const { memberDetails, redemptionDetails } = event.detail;

      // Act
      await controller.handle(event);

      // Assert
      expect(mockPushNotificationService.sendRedemptionPushNotification).toHaveBeenCalledWith(
        redemptionDetails.companyName,
        memberDetails.brazeExternalUserId,
        redemptionDetails.redemptionType,
        defaultUrl,
      );
    },
  );

  it('shouldnt send push notification if client type is web', async () => {
    // Arrange
    const logger = createTestLogger();
    const mockPushNotificationService = {
      sendRedemptionPushNotification: jest.fn(),
    } satisfies IPushNotificationService;
    const controller = new RedemptionPushNotificationController(logger, mockPushNotificationService);
    const event = memberRedemptionEventFactory.build({
      detail: {
        redemptionDetails: {
          clientType: 'web',
        },
      },
    });

    // Act
    await controller.handle(event);

    // Assert
    expect(mockPushNotificationService.sendRedemptionPushNotification).not.toHaveBeenCalled();
  });
});
