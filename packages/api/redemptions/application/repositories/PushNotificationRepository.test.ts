import { faker } from '@faker-js/faker';

import {
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  RedemptionTypes,
  SHOWCARD,
  VAULT,
  VAULTQR,
  VERIFY,
} from '@blc-mono/core/constants/redemptions';
import { as } from '@blc-mono/core/utils/testing';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { IBrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { PushNotificationRepository } from './PushNotificationRepository';

beforeEach(() => {
  process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST] = 'https://staging.bluelightcard.co.uk';
  process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_PUSH_NOTIFICATION_CAMPAIGN_ID] = 'vault_env_val';
  process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_QR_PUSH_NOTIFICATION_CAMPAIGN_ID] =
    'vaultQR_env_val';
  process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_PRE_APPLIED_PUSH_NOTIFICATION_CAMPAIGN_ID] =
    'preApplied_env_val';
  process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GENERIC_PUSH_NOTIFICATION_CAMPAIGN_ID] =
    'generic_env_val';
  process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_SHOW_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID] =
    'showCard_env_val';
  process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GIFT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID] =
    'giftCard_env_val';
  process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VERIFY_PUSH_NOTIFICATION_CAMPAIGN_ID] = 'verify_env_val';
});

afterEach(() => {
  delete process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST];
  delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_PUSH_NOTIFICATION_CAMPAIGN_ID];
  delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_QR_PUSH_NOTIFICATION_CAMPAIGN_ID];
  delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_PRE_APPLIED_PUSH_NOTIFICATION_CAMPAIGN_ID];
  delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GENERIC_PUSH_NOTIFICATION_CAMPAIGN_ID];
  delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_SHOW_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID];
  delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GIFT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID];
  delete process.env[RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VERIFY_PUSH_NOTIFICATION_CAMPAIGN_ID];
});

describe('PushNotificationRepository', () => {
  const defaultCompanyName = faker.company.name();
  const defaultBrazeExternalUserId = faker.string.uuid();

  describe('sendRedemptionPushNotification', () => {
    it.each([
      [GENERIC, 'generic_env_val'],
      [VAULT, 'vault_env_val'],
      [VAULTQR, 'vaultQR_env_val'],
      [PREAPPLIED, 'preApplied_env_val'],
      [SHOWCARD, 'showCard_env_val'],
      [GIFTCARD, 'giftCard_env_val'],
      [VERIFY, 'verify_env_val'],
    ])('should send push notification with redemptionType %s', async (redemptionType, campaignEnvVar) => {
      // Arrange
      const logger = createTestLogger();
      const redemptionDetailsUrl = 'https://staging.bluelightcard.co.uk';
      const mockClientProviderImplementation = {
        campaigns: {
          trigger: {
            send: jest.fn().mockResolvedValue({
              message: 'success',
            }),
          },
        },
      };
      const mockClientProvider: IBrazeEmailClientProvider = {
        getClient: () => Promise.resolve(as(mockClientProviderImplementation)),
      };
      const pushNotificationRepository = new PushNotificationRepository(logger, mockClientProvider);

      // Act
      await pushNotificationRepository.sendRedemptionPushNotification(
        defaultCompanyName,
        defaultBrazeExternalUserId,
        redemptionType as RedemptionTypes,
        redemptionDetailsUrl,
      );

      // Assert
      expect(mockClientProviderImplementation.campaigns.trigger.send).toHaveBeenCalled();
      expect(mockClientProviderImplementation.campaigns.trigger.send.mock.lastCall![0].campaign_id).toEqual(
        campaignEnvVar,
      );
      expect(
        mockClientProviderImplementation.campaigns.trigger.send.mock.lastCall![0].recipients[0].external_user_id,
      ).toEqual(defaultBrazeExternalUserId);
      expect(mockClientProviderImplementation.campaigns.trigger.send.mock.lastCall![0].trigger_properties).toEqual({
        companyName: defaultCompanyName,
        url: redemptionDetailsUrl,
      });
    });

    it('should throw an error if the Braze client throws an error', async () => {
      // Arrange
      const logger = createTestLogger();
      const mockClientProviderImplementation = {
        campaigns: {
          trigger: {
            send: jest.fn().mockRejectedValue(new Error('Error sending redemption push notification')),
          },
        },
      };
      const mockClientProvider: IBrazeEmailClientProvider = {
        getClient: () => Promise.resolve(as(mockClientProviderImplementation)),
      };
      const pushNotificationRepository = new PushNotificationRepository(logger, mockClientProvider);

      // Act & Assert
      await expect(
        pushNotificationRepository.sendRedemptionPushNotification(
          defaultCompanyName,
          defaultBrazeExternalUserId,
          'generic' as RedemptionTypes,
        ),
      ).rejects.toThrow('Error sending redemption push notification');
    });
  });
});
