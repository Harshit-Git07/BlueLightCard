import { IPushNotificationService } from '@blc-mono/redemptions/application/services/pushNotification/PushNotificationService';
import { memberRedemptionEventFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedemptionPushNotificationController } from './RedemptionPushNotificationController';

describe('RedemptionPushNotificationController', () => {
  it.each(['vault', 'vaultQR', 'generic', 'preApplied', 'showCard'])(
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
            redemptionType: redemptionType as 'vault' | 'vaultQR' | 'generic' | 'preApplied' | 'showCard',
            url: defaultUrl,
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
});
