import { Braze, CampaignsTriggerSendObject } from 'braze-api';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { OrdersStackEnvironmentKeys } from '@blc-mono/orders/infrastructure/constants/environment';

import { BrazeEmailClientProvider, IBrazeEmailClientProvider } from './BrazeEmailClientProvider';

export type PaymentResultEmailParams = {
  member: {
    id: string;
    brazeExternalId: string;
    name?: string;
  };
  amount: number;
};

export interface IEmailRepository {
  sendPaymentSucceededEmail: (payload: PaymentResultEmailParams) => Promise<void>;
}

export class EmailRepository implements IEmailRepository {
  static key = 'BrazeEmailRepository' as const;
  static inject = [Logger.key, BrazeEmailClientProvider.key] as const;

  private brazeApiUrl = getEnv(OrdersStackEnvironmentKeys.BRAZE_API_URL);

  private emailApiClient: Braze | undefined;

  constructor(
    private logger: ILogger,
    private brazeClientProvider: IBrazeEmailClientProvider,
  ) {}

  private async getClient() {
    if (!this.emailApiClient) {
      this.emailApiClient = await this.brazeClientProvider.getClient();
    }

    return this.emailApiClient;
  }

  async sendPaymentSucceededEmail(params: PaymentResultEmailParams): Promise<void> {
    const emailClient = await this.getClient();

    const emailPayload: CampaignsTriggerSendObject = {
      campaign_id: getEnv(OrdersStackEnvironmentKeys.BRAZE_PAYMENT_SUCCEEDED_EMAIL_CAMPAIGN_ID),
      recipients: [
        {
          external_user_id: params.member.brazeExternalId,
        },
      ],
      trigger_properties: {
        amount: `${parseFloat((params.amount / 100).toFixed(2))}`,
        currency_symbol: getEnv(OrdersStackEnvironmentKeys.CURRENCY_CODE).toLowerCase() === 'gbp' ? '£' : '$',
      },
    };

    const emailServiceResponse = await emailClient.campaigns.trigger.send(emailPayload);

    if (!emailServiceResponse.message.includes('success')) {
      this.logger.info({
        message: 'Failed to send Payment Succeeded email',
        context: emailServiceResponse,
      });
      throw new Error('Failed to Payment Succeeded email');
    }

    this.logger.info({
      message: 'successfully sent Payment Succeeded email',
      context: emailServiceResponse,
    });
  }
}
