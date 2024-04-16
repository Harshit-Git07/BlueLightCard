import { Braze, CampaignsTriggerSendObject } from 'braze-api';

import { OfferData } from '@blc-mono/core/types/offerdata';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  AffiliateHelper,
  AffiliateResultsKinds,
} from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import { encodeBase64 } from '@blc-mono/redemptions/application/helpers/encodeBase64';
import { RedemptionEventDetail } from '@blc-mono/redemptions/application/repositories/RedemptionEventsRepository';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import {
  BrazeEmailClientProvider,
  IBrazeEmailClientProvider,
} from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';

export interface IEmailRepository {
  sendVaultRedemptionTransactionalEmail: (payload: RedemptionEventDetail) => Promise<void>;
}

export class EmailRepository implements IEmailRepository {
  static key = 'EmailRepository' as const;
  static inject = [Logger.key, BrazeEmailClientProvider.key] as const;

  private emailApiClient: Braze | undefined;

  constructor(
    private logger: ILogger,
    private emailClientProvider: IBrazeEmailClientProvider,
  ) {}

  private async getClient() {
    if (!this.emailApiClient) {
      this.emailApiClient = await this.emailClientProvider.getClient();
    }
    return this.emailApiClient;
  }

  private buildEmailURL({
    affiliate,
    base64Payload,
    code,
    url,
    userUID,
  }: {
    affiliate: string | null;
    base64Payload: string;
    code: string;
    url: string;
    userUID: string;
  }) {
    if (!base64Payload || !code || !url || !userUID) {
      throw new Error('Invalid parameters');
    }

    const host = getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST);
    const affiliateConfig = AffiliateHelper.getTrackingUrl(userUID, url);

    if (!affiliate) {
      return `${host}/copy-code?code=${code}&redirect=${url}&metaData=${base64Payload}`;
    }

    if (affiliateConfig.kind !== AffiliateResultsKinds.NotSupportedAffiliate) {
      return `${host}/copy-code?code=${code}&redirect=${url}&metaData=${base64Payload}`;
    }

    const trackingUrl = affiliateConfig.data.url;
    return `${host}/copy-code?code=${code}&redirect=${trackingUrl}&metaData=${base64Payload}`;
  }

  private generateEmailUrl({
    memberId: userUID,
    offerId: offerId,
    companyId: companyId,
    companyName: companyName,
    offerName: offerName,
    url: url,
    affiliate,
    code,
  }: {
    memberId: string;
    offerId: string;
    companyId: string;
    companyName: string;
    offerName: string;
    url: string;
    code: string;
    affiliate: string | null;
  }): string {
    const payload: OfferData = {
      userUID,
      offerId,
      companyId,
      companyName,
      offerName,
    };

    const jsonString = JSON.stringify(payload);
    const base64Payload = encodeBase64(jsonString);
    const codeBase64 = encodeBase64(code);

    return this.buildEmailURL({
      affiliate,
      base64Payload,
      code: codeBase64,
      url,
      userUID,
    });
  }

  async sendVaultRedemptionTransactionalEmail(payload: RedemptionEventDetail): Promise<void> {
    const emailClient = await this.getClient();

    const { memberDetails, redemptionDetails } = payload;
    const { offerId, companyId, affiliate, offerName, companyName, url, code } = redemptionDetails;

    const emailUrl = this.generateEmailUrl({
      memberId: memberDetails.memberId,
      offerId: offerId,
      companyId: companyId,
      companyName: companyName,
      offerName: offerName,
      url,
      affiliate,
      code,
    });

    const emailPayload: CampaignsTriggerSendObject = {
      campaign_id: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID),
      recipients: [
        {
          external_user_id: memberDetails.brazeExternalUserId,
        },
      ],
      trigger_properties: {
        companyName: redemptionDetails.companyName,
        offerName: redemptionDetails.offerName,
        url: emailUrl,
      },
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
