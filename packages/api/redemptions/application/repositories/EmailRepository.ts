import { Braze, CampaignsTriggerSendObject } from 'braze-api';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { BrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';

export type RedemptionTransactionalEmailPayload = {
  memberDetails: {
    memberId: string;
    brazeExternalUserId: string;
  };
  redemptionDetails: {
    code: string;
    redemptionType: string;
    companyId: string;
    companyName: string;
    offerId: string;
    offerName: string;
    url: string;
  };
};

export interface IEmailRepository {
  sendVaultRedemptionTransactionalEmail: (payload: RedemptionTransactionalEmailPayload) => Promise<void>;
}

export class EmailRepository implements IEmailRepository {
  static key = 'EmailRepository' as const;
  static inject = [Logger.key, BrazeEmailClientProvider.key] as const;

  private emailApiClient: Braze | undefined;

  constructor(
    private logger: ILogger,
    private emailClient: BrazeEmailClientProvider,
  ) {}

  private async getClient() {
    if (!this.emailApiClient) {
      this.emailApiClient = await this.emailClient.init();
    }
    return this.emailApiClient;
  }

  async sendVaultRedemptionTransactionalEmail(payload: RedemptionTransactionalEmailPayload): Promise<void> {
    const emailClient = await this.getClient();

    const { memberDetails, redemptionDetails } = payload;

    const emailPayload: CampaignsTriggerSendObject = {
      campaign_id: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID),
      recipients: [
        {
          external_user_id: memberDetails.brazeExternalUserId,
        },
      ],
      trigger_properties: redemptionDetails,
    };

    const emailServiceResponse = await emailClient.campaigns.trigger.send(emailPayload);

    if (!emailServiceResponse.message.includes('success')) {
      this.logger.info({
        message: 'Failed to send email',
        context: emailServiceResponse,
      });
      throw new Error('Failed to send email');
    }

    this.logger.info({
      message: 'successfully sent email',
      context: emailServiceResponse,
    });
  }
}
