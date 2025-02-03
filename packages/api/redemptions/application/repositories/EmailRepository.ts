import Bottleneck from 'bottleneck';
import { Braze, CampaignsTriggerSendObject, UsersTrackObject } from 'braze-api';
import { v4 as uuidv4 } from 'uuid';

import { GIFTCARD, PREAPPLIED, VERIFY } from '@blc-mono/core/constants/redemptions';
import { OfferData } from '@blc-mono/core/types/offerdata';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
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

export type BallotTransactionalEmailParams = {
  brazeExternalUserId: string;
  memberId: string;
  eventDate: string;
  drawDate: string;
  offerName: string;
  totalTickets: number;
  url: string;
  companyName: string;
  redemptionType: RedemptionType;
};

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
  sendAffiliateTransactionalEmail: (
    payload: PreAppliedTransactionalEmailParams,
    redemptionType: RedemptionType,
  ) => Promise<void>;
  sendShowCardEmail: (payload: ShowCardTransactionalEmailParams) => Promise<void>;
  usersTrackThrottled(usersWithAttributes: UsersTrackObject['attributes']): Promise<void>;
  sendBallotTransactionalEmail: (payload: BallotTransactionalEmailParams) => Promise<void>;
}

export class EmailRepository implements IEmailRepository {
  static key = 'EmailRepository' as const;
  static inject = [Logger.key, BrazeEmailClientProvider.key] as const;

  private emailApiClient: Braze | undefined;
  private readonly usersTrackLimiter = new Bottleneck({
    /**
     * Braze does not seem to enforce a strict concurrency limit. We've chosen a
     * value of 20 as a conservative value.
     */
    maxConcurrent: 20,
    /**
     * {@link https://www.braze.com/docs/api/api_limits}
     *
     * The Braze users.track endpoint has a rate limit of 3,000 requests per 3
     * seconds: 3,000/3 = 1,000/second = 1ms between requests.
     *
     * BUT!!! Node.js timers aren't precise enough for extremely small intervals
     * like 1ms and network latency could introduce unexpected variance, so
     * we've chosen 50ms between requests as a stable and predictable
     * configuration (≈ 20 requests/second).
     *
     * This configuration assumes we will stay well within the rate limit but
     * can only process around 1,360,000 entries before the lambda times out. If
     * this becomes a problem, implement a incremental backoff strategy using
     * bottleneck's advanced features and a lower minTime value.
     */
    minTime: 50,
  });

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

  private getAffiliateCampaignId(redemptionType: RedemptionType) {
    const map: Record<string, string> = {
      [GIFTCARD]: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_GIFT_CARD_EMAIL_CAMPAIGN_ID),
      [PREAPPLIED]: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID),
      [VERIFY]: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VERIFY_EMAIL_CAMPAIGN_ID),
    };

    return map[redemptionType];
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
    offerId,
    companyId,
    companyName,
    offerName,
    url,
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
        message: `redemption type is incorrect for show card email template: ${redemptionType}`,
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
        message: `redemption type is incorrect for vault/generic email template: ${redemptionType}`,
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

  async sendAffiliateTransactionalEmail(
    params: PreAppliedTransactionalEmailParams,
    redemptionType: RedemptionType,
  ): Promise<void> {
    const emailClient = await this.getClient();

    const affiliateConfig = AffiliateHelper.getTrackingUrl(params.memberId, params.url);
    const emailLinkUrl = affiliateConfig.kind === AffiliateResultsKinds.Error ? params.url : affiliateConfig.data.url;

    const campaignId = this.getAffiliateCampaignId(redemptionType);

    if (!campaignId) {
      this.logger.info({
        message: `no campaign identifier for Affiliate email template: ${redemptionType}`,
        context: params,
      });
      throw new Error('RedemptionType error, expects Affiliate');
    }

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
        url: emailLinkUrl,
      },
    };

    const emailServiceResponse = await emailClient.campaigns.trigger.send(emailPayload);

    if (!emailServiceResponse.message.includes('success')) {
      this.logger.info({
        message: `Failed to send ${redemptionType} affiliate redemption email`,
        context: emailServiceResponse,
      });
      throw new Error(`Failed to send ${redemptionType} affiliate redemption email`);
    }

    this.logger.info({
      message: `successfully sent ${redemptionType} affiliate redemption email`,
      context: emailServiceResponse,
    });
  }

  async sendBallotTransactionalEmail(params: BallotTransactionalEmailParams): Promise<void> {
    const emailClient = await this.getClient();

    const { redemptionType, brazeExternalUserId } = params;
    if (redemptionType !== 'ballot') {
      this.logger.info({
        message: `redemption type is incorrect for ballot email template: ${redemptionType}`,
        context: params,
      });
      throw new Error('RedemptionType error, expects ballot');
    }

    //emails require dates/time in format: 31 Jan 2025 at 10:00 pm
    const locales = getBrandFromEnv().includes('AU') ? 'en-AU' : 'en-GB';
    const eventDate = new Date(params.eventDate);
    const drawDate = new Date(params.drawDate);

    const emailPayload: CampaignsTriggerSendObject = {
      campaign_id: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_BALLOT_EMAIL_CAMPAIGN_ID),
      recipients: [
        {
          external_user_id: brazeExternalUserId,
        },
      ],
      trigger_properties: {
        eventDate: this.formatBallotDate(eventDate, locales),
        eventTime: this.formatBallotTime(eventDate, locales),
        drawDate: this.formatBallotDate(drawDate, locales),
        drawTime: this.formatBallotTime(drawDate, locales),
        eventName: params.offerName,
        venueName: params.companyName,
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

  private formatBallotDate(date: Date, locales: string): string {
    //example: 31 Jan 2025
    return date.toLocaleString(locales, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  private formatBallotTime(date: Date, locales: string): string {
    //example: 10:00 pm
    return date.toLocaleString(locales, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  public async usersTrackThrottled(usersWithAttributes: UsersTrackObject['attributes']): Promise<void> {
    const payload: UsersTrackObject = {
      attributes: usersWithAttributes,
    };

    await this.usersTrackLimiter
      .schedule({ id: uuidv4() }, this.usersTrack.bind(this, payload))
      .then(() => {
        this.logger.info({
          message: `Throttled tracked users completed successfully`,
          context: { message: 'usersTrackThrottled' },
        });
      })
      .catch((error) => {
        if (error instanceof Bottleneck.BottleneckError) {
          this.logger.info({
            message: `Error throttling track user calls`,
            context: { message: error },
          });
        }
        throw error;
      });
  }

  private async usersTrack(usersTrackObject: UsersTrackObject): Promise<void> {
    const emailClient = await this.getClient();
    const emailServiceResponse = await emailClient.users.track(usersTrackObject);

    // https://www.braze.com/docs/api/errors/#server-responses
    if (!emailServiceResponse.message.includes('success')) {
      this.logger.info({
        message: `Failed to track user with a fatal error`,
        context: emailServiceResponse,
      });
      throw new Error(`Failed to track user with a fatal error`);
    }

    if (emailServiceResponse.errors) {
      this.logger.info({
        message: `Tracked users successfully but with non-fatal errors`,
        context: emailServiceResponse,
      });
    } else {
      this.logger.info({
        message: `Tracked users successfully`,
        context: emailServiceResponse,
      });
    }
  }
}
