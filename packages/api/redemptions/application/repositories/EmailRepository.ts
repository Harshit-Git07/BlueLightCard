import { Braze, CampaignsTriggerSendObject } from 'braze-api';

import { OfferData } from '@blc-mono/core/types/offerdata';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  AffiliateHelper,
  AffiliateResultsKinds,
} from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import { encodeBase64 } from '@blc-mono/redemptions/application/helpers/encodeBase64';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import {
  BrazeEmailClientProvider,
  IBrazeEmailClientProvider,
} from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';

export type VaultOrGenericTransactionalEmailParams = {
  brazeExternalUserId: string;
  memberId: string;
  offerId: string;
  companyId: string;
  companyName: string;
  offerName: string;
  url: string;
  affiliate: string | null;
  code: string;
};

export type PreAppliedTransactionalEmailParams = {
  brazeExternalUserId: string;
  memberId: string;
  companyName: string;
  offerName: string;
  url: string;
};

export type ShowCardTransactionalEmailParams = {
  brazeExternalUserId: string;
  companyName: string;
  redemptionType: RedemptionType;
};

export interface IEmailRepository {
  sendVaultOrGenericTransactionalEmail: (
    payload: VaultOrGenericTransactionalEmailParams,
    redemptionType: RedemptionType,
  ) => Promise<void>;
  sendPreAppliedTransactionalEmail: (payload: PreAppliedTransactionalEmailParams) => Promise<void>;
  sendShowCardEmail: (payload: ShowCardTransactionalEmailParams) => Promise<void>;
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
    const urlEncoded = encodeBase64(url);

    if (!affiliate) {
      return `${host}/copy-code?code=${code}&redirect=${urlEncoded}&metaData=${base64Payload}`;
    }

    if (affiliateConfig.kind !== AffiliateResultsKinds.NotSupportedAffiliate) {
      return `${host}/copy-code?code=${code}&redirect=${urlEncoded}&metaData=${base64Payload}`;
    }

    const trackingUrl = encodeBase64(affiliateConfig.data.url);
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
    redemptionType,
  }: {
    memberId: string;
    offerId: string;
    companyId: string;
    companyName: string;
    offerName: string;
    url: string;
    code: string;
    affiliate: string | null;
    redemptionType: RedemptionType;
  }): string | undefined {
    const payload: OfferData = {
      userUID,
      offerId,
      companyId,
      companyName,
      offerName,
    };
    if (redemptionType === 'vaultQR') {
      return;
    }

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

  async sendShowCardEmail(params: ShowCardTransactionalEmailParams): Promise<void> {
    const emailClient = await this.getClient();

    const { brazeExternalUserId, companyName, redemptionType } = params;
    if (redemptionType !== 'showCard') {
      this.logger.info({
        message: `redemption type is incorrect for this email template: ${redemptionType}`,
        context: params,
      });
      throw new Error('RedemptionType error, expects showCard');
    }

    const emailPayload: CampaignsTriggerSendObject = {
      campaign_id: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID),
      recipients: [
        {
          external_user_id: brazeExternalUserId,
        },
      ],
      trigger_properties: {
        companyName: companyName,
      },
    };

    const emailServiceResponse = await emailClient.campaigns.trigger.send(emailPayload);

    if (!emailServiceResponse.message.includes('success')) {
      this.logger.info({
        message: `Failed to send ${redemptionType} email`,
        context: emailServiceResponse,
      });
      throw new Error(`Failed to send ${redemptionType} email`);
    }

    this.logger.info({
      message: `successfully sent ${redemptionType} email`,
      context: emailServiceResponse,
    });
  }

  async sendVaultOrGenericTransactionalEmail(
    params: VaultOrGenericTransactionalEmailParams,
    redemptionType: RedemptionType,
  ): Promise<void> {
    /**
     * check redemptionType to set the Braze campaign ID
     * currently the vault and generic email templates are identical, with exactly the same parameters
     * so, instead of creating 2 functions with exactly the same code (apart from the Braze campaign ID)
     * we use this 1 function
     * this may require breaking out to separate functions if the Braze email template parameters are differed
     * in the future
     */
    let campaignId = null;
    if (redemptionType === 'vault') {
      campaignId = getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID);
    }
    if (redemptionType === 'generic') {
      campaignId = getEnv(RedemptionsStackEnvironmentKeys.BRAZE_GENERIC_EMAIL_CAMPAIGN_ID);
    }
    if (redemptionType === 'vaultQR') {
      campaignId = getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID);
    }

    if (!campaignId) {
      this.logger.info({
        message: `redemption type is incorrect for this email template: ${redemptionType}`,
        context: params,
      });
      throw new Error('RedemptionType error, expects vault/generic');
    }

    const emailClient = await this.getClient();

    const emailUrl = this.generateEmailUrl({
      memberId: params.memberId,
      offerId: params.offerId,
      companyId: params.companyId,
      companyName: params.companyName,
      offerName: params.offerName,
      url: params.url,
      affiliate: params.affiliate,
      code: params.code,
      redemptionType,
    });

    const emailPayload: CampaignsTriggerSendObject = {
      campaign_id: campaignId,
      recipients: [
        {
          external_user_id: params.brazeExternalUserId,
        },
      ],
      trigger_properties: {
        companyName: params.companyName,
        offerName: params.offerName,
        url: emailUrl,
        code: params.code,
      },
    };

    const emailServiceResponse = await emailClient.campaigns.trigger.send(emailPayload);

    if (!emailServiceResponse.message.includes('success')) {
      this.logger.info({
        message: `Failed to send ${redemptionType} email`,
        context: emailServiceResponse,
      });
      throw new Error(`Failed to send ${redemptionType} email`);
    }

    this.logger.info({
      message: `successfully sent ${redemptionType} email`,
      context: emailServiceResponse,
    });
  }

  async sendPreAppliedTransactionalEmail(params: PreAppliedTransactionalEmailParams): Promise<void> {
    const emailClient = await this.getClient();

    const affiliateConfig = AffiliateHelper.getTrackingUrl(params.memberId, params.url);
    const emailLinkUrl = affiliateConfig.kind === AffiliateResultsKinds.Error ? params.url : affiliateConfig.data.url;

    const emailPayload: CampaignsTriggerSendObject = {
      campaign_id: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID),
      recipients: [
        {
          external_user_id: params.brazeExternalUserId,
        },
      ],
      trigger_properties: {
        companyName: params.companyName,
        offerName: params.offerName,
        url: emailLinkUrl,
      },
    };

    const emailServiceResponse = await emailClient.campaigns.trigger.send(emailPayload);

    if (!emailServiceResponse.message.includes('success')) {
      this.logger.info({
        message: 'Failed to send preApplied email',
        context: emailServiceResponse,
      });
      throw new Error('Failed to send preApplied email');
    }

    this.logger.info({
      message: 'successfully sent preApplied email',
      context: emailServiceResponse,
    });
  }
}
