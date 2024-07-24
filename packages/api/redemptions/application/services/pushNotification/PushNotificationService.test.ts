import { PushNotificationService } from '@blc-mono/redemptions/application/services/pushNotification/PushNotificationService';
import { memberRedemptionEventFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IPushNotificationRepository } from '../../repositories/PushNotificationRepository';

describe('PushNotificationService', () => {
  it.each(['vault', 'vaultQR', 'generic', 'preApplied', 'showCard'])(
    'should send redemption push notification with redemption type %s',
    async (redemptionType) => {
      // Arrange
      const logger = createTestLogger();
      const defaultUrl = redemptionType !== 'showCard' ? 'https://example.com' : undefined;
      const mockPushNotificationRepository = {
        sendRedemptionPushNotification: jest.fn(),
      } satisfies IPushNotificationRepository;
      const event = memberRedemptionEventFactory.build();
      const { memberDetails, redemptionDetails } = event.detail;
      const service = new PushNotificationService(logger, mockPushNotificationRepository);

      // Act
      const result = await service.sendRedemptionPushNotification(
        redemptionDetails.companyName,
        memberDetails.brazeExternalUserId,
        redemptionDetails.redemptionType,
        defaultUrl,
      );

      // Assert
      expect(mockPushNotificationRepository.sendRedemptionPushNotification).toHaveBeenCalledWith(
        redemptionDetails.companyName,
        memberDetails.brazeExternalUserId,
        redemptionDetails.redemptionType,
        defaultUrl,
      );
      expect(result).toBeUndefined();
    },
  );

  it('should throw an error if sending the push notification fails', async () => {
    // Arrange
    const logger = createTestLogger();
    const mockPushNotificationRepository = {
      sendRedemptionPushNotification: jest
        .fn()
        .mockRejectedValue(new Error('Error sending redemption push notification')),
    } satisfies IPushNotificationRepository;
    const event = memberRedemptionEventFactory.build();
    const { memberDetails, redemptionDetails } = event.detail;
    const redemptionDetailsUrl = redemptionDetails.redemptionType !== 'showCard' ? redemptionDetails.url : undefined;
    const service = new PushNotificationService(logger, mockPushNotificationRepository);

    // Act & Assert
    await expect(
      service.sendRedemptionPushNotification(
        redemptionDetails.companyName,
        memberDetails.brazeExternalUserId,
        redemptionDetails.redemptionType,
        redemptionDetailsUrl,
      ),
    ).rejects.toThrow('Error sending redemption push notification');
  });
});
