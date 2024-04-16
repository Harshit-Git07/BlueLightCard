import {
  AffiliateConfiguration,
  AffiliateConfigurationHelper,
} from '@blc-mono/redemptions/application/helpers/affiliateConfiguration';

export enum AffiliateResultsKinds {
  OK = 'OK',
  NotSupportedAffiliate = 'NotSupportedAffiliate',
  Error = 'Error',
}

type NotSupportedAffiliate = {
  kind: AffiliateResultsKinds.NotSupportedAffiliate;
  data: {
    message: string;
    url: string;
  };
};

type OkAffiliate = {
  kind: AffiliateResultsKinds.OK;
  data: {
    url: string;
  };
};
type ErrorAffiliate = {
  kind: AffiliateResultsKinds.Error;
  data: {
    message: string;
  };
};

type AffiliateResults = NotSupportedAffiliate | OkAffiliate | ErrorAffiliate;

export class AffiliateHelper {
  public static getTrackingUrl(memberId: string, affiliateUrl: string): AffiliateResults {
    const affiliateConfig = this.getAffiliateConfig(affiliateUrl);
    const trackingUrl = affiliateConfig?.getTrackingUrl(memberId);

    if (!affiliateConfig) {
      return {
        kind: AffiliateResultsKinds.NotSupportedAffiliate,
        data: {
          message: 'Affiliate not supported',
          url: affiliateUrl,
        },
      };
    }
    if (!trackingUrl) {
      return {
        kind: AffiliateResultsKinds.Error,
        data: {
          message: 'Error while creating tracking URL',
        },
      };
    }
    return {
      kind: AffiliateResultsKinds.OK,
      data: {
        url: trackingUrl,
      },
    };
  }

  public static getAffiliateConfig(affiliateUrl: string): AffiliateConfiguration | null {
    return new AffiliateConfigurationHelper(affiliateUrl).getConfig();
  }
}
