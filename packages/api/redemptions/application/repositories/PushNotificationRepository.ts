import { Braze } from 'braze-api';

import { RedemptionTypes } from '@blc-mono/core/constants/redemptions';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import {
  BrazeEmailClientProvider,
  IBrazeEmailClientProvider,
} from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';

export interface IPushNotificationRepository {
  sendRedemptionPushNotification(
    companyName: string,
    brazeExternalUserId: string,
    redemptionType: RedemptionTypes,
    url?: string,
  ): Promise<void>;
}

export class PushNotificationRepository implements IPushNotificationRepository {
  static readonly key = 'PushNotificationRepository' as const;
  static readonly inject = [Logger.key, BrazeEmailClientProvider.key] as const;

  private brazeApiClient: Braze | undefined;
  private readonly config = {
    vault: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_PUSH_NOTIFICATION_CAMPAIGN_ID),
    vaultQR: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_QR_PUSH_NOTIFICATION_CAMPAIGN_ID),
    preApplied: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_PRE_APPLIED_PUSH_NOTIFICATION_CAMPAIGN_ID),
    generic: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GENERIC_PUSH_NOTIFICATION_CAMPAIGN_ID),
    showCard: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_SHOW_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID),
    ballot: '',
    giftCard: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GIFT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID),
    creditCard: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_CREDIT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID),
  };

  constructor(
    private readonly logger: ILogger,
    private readonly clientProvider: IBrazeEmailClientProvider,
  ) {}

  private async getClient() {
    if (!this.brazeApiClient) {
      this.brazeApiClient = await this.clientProvider.getClient();
    }
    return this.brazeApiClient;
  }

  public async sendRedemptionPushNotification(
    companyName: string,
    brazeExternalUserId: string,
    redemptionType: RedemptionTypes,
    url?: string,
  ): Promise<void> {
    const client = await this.getClient();
    const result = await client.campaigns.trigger.send({
      campaign_id: this.config[redemptionType],
      trigger_properties: {
        companyName,
        url,
      },
      recipients: [
        {
          external_user_id: brazeExternalUserId,
        },
      ],
    });

    if (!result.message.includes('success')) {
      this.logger.error({
        message: 'Failed to send redemption push notification',
        context: {
          companyName,
          brazeExternalUserId,
          redemptionType,
          url,
        },
      });
      throw new Error('Failed to send redemption push notification');
    }

    this.logger.info({
      message: 'Redemption push notification sent',
      context: {
        companyName,
        brazeExternalUserId,
        redemptionType,
        url,
      },
    });
  }
}
