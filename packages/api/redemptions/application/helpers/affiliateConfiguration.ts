import _ from 'lodash';

import { Affiliate } from '@blc-mono/redemptions/libs/database/schema';

declare module 'lodash' {
  interface LoDashStatic {
    find<T>(collection: List<T> | Dictionary<T>, predicate?: ListIteratee<T>): T;
  }
}

export type AffiliateConfiguration = {
  /**
   * The identifier for the affiliate (e.g. `awin`).
   */
  affiliate: Affiliate;
  /**
   * Generates the tracking URL for the affiliate.
   *
   * @param memberId The member ID to add to the tracking URL.
   * @returns The tracking URL for the affiliate.
   */
  getTrackingUrl(memberId: string): string;
};

type AffiliateConfigurationMatch = AffiliateConfiguration & {
  /**
   * `true` if the affiliate URL is a match for this affiliate config.
   */
  match: boolean;
};

/**
 *  This class configures the tracking URLS for affiliates
 *
 *  @param affiliateUrl - The default affilate URL string
 *
 *  @example
 *  ```ts
 *  const affiliateConfig = new AffiliateConfigurationHelper(affiliateUrl).getConfig();
 *
 *  if (affiliateConfig === null) {
 *    throw new Error('Unrecognized affiliate URL');
 *  }
 *
 *  const trackingUrl: string = affiliateConfig.getTrackingUrl(memberId);
 *  const affiliate: string = affiliateConfig.affiliate;
 *  ```
 */
export class AffiliateConfigurationHelper {
  private affiliateConfig: AffiliateConfiguration | null;

  /**
   * Gets the affiliate configuration object.
   *
   * @returns The affiliate configuration object or `null` if the affiliate URL provided to the constructor does not match any affiliate.
   */
  getConfig(): AffiliateConfiguration | null {
    return this.affiliateConfig;
  }

  constructor(private readonly affiliateUrl: string) {
    const affiliates: Record<Affiliate, AffiliateConfigurationMatch> = {
      awin: this.awin(),
      affiliateFuture: this.affiliateFuture(),
      rakuten: this.rakuten(),
      affilinet: this.affilinet(),
      webgains: this.webgains(),
      partnerize: this.partnerize(),
      impactRadius: this.impactRadius(),
      adtraction: this.adtraction(),
      affiliateGateway: this.affiliateGateway(),
      optimiseMedia: this.optimiseMedia(),
      commissionJunction: this.commissionJunction(),
      tradedoubler: this.tradedoubler(),
    };

    this.affiliateConfig = _.find(affiliates, (affiliate) => affiliate.match) || null;
  }

  // #region Affiliate Configuration - The methods below are used to generate the the affiliate configuration object for each affiliate.

  private awin(): AffiliateConfigurationMatch {
    return {
      affiliate: 'awin',
      match: this.matchHostname('www.awin1.com'),
      getTrackingUrl: (memberId: string) => this.addParameter('clickref', memberId),
    };
  }

  private affiliateFuture(): AffiliateConfigurationMatch {
    return {
      affiliate: 'affiliateFuture',
      match: this.matchHostname('scripts.affiliatefuture.com'),
      getTrackingUrl: (memberId: string) => this.addParameter('tracking', memberId),
    };
  }

  private rakuten(): AffiliateConfigurationMatch {
    return {
      affiliate: 'rakuten',
      match: this.matchHostname('click.linksynergy.com'),
      getTrackingUrl: (memberId: string) => this.addParameter('u1', memberId),
    };
  }

  private affilinet(): AffiliateConfigurationMatch {
    return {
      affiliate: 'affilinet',
      match: this.matchHostname('being.successfultogether.co.uk'),
      getTrackingUrl: (memberId: string) => this.addParameter('subid', memberId),
    };
  }

  private webgains(): AffiliateConfigurationMatch {
    return {
      affiliate: 'webgains',
      match: this.matchHostname('track.webgains.com'),
      getTrackingUrl: (memberId: string) => this.addParameter('clickref', memberId),
    };
  }

  private partnerize(): AffiliateConfigurationMatch {
    return {
      affiliate: 'partnerize',
      match: this.matchHostname('prf.hn'),
      getTrackingUrl: (memberId: string) => {
        const url = new URL(this.affiliateUrl);
        url.pathname = url.pathname.includes('MEMID')
          ? url.pathname.replace('MEMID', memberId)
          : url.pathname.includes('/destination:')
          ? url.pathname.replace('/destination:', `/pubref:${memberId}/destination:`)
          : url.pathname.replace('/camref:', `/pubref:${memberId}/camref:`);
        return url.href;
      },
    };
  }

  private impactRadius(): AffiliateConfigurationMatch {
    return {
      affiliate: 'impactRadius',
      match: this.matchPathname('/c/'),
      getTrackingUrl: (memberId: string) => this.addParameter('subId1', memberId),
    };
  }

  private adtraction(): AffiliateConfigurationMatch {
    return {
      affiliate: 'adtraction',
      match: this.matchHostname('track.adtraction.com'),
      getTrackingUrl: (memberId: string) => this.addParameter('epi', memberId),
    };
  }

  private affiliateGateway(): AffiliateConfigurationMatch {
    return {
      affiliate: 'affiliateGateway',
      match: this.matchHostname('www.tagserve.com'),
      getTrackingUrl: (memberId: string) => this.addParameter('SUBID', memberId),
    };
  }

  private optimiseMedia(): AffiliateConfigurationMatch {
    return {
      affiliate: 'optimiseMedia',
      match: this.matchHostname('clk.omgt1.com'),
      getTrackingUrl: (memberId: string) => this.addParameter('UID', memberId),
    };
  }

  private commissionJunction(): AffiliateConfigurationMatch {
    return {
      affiliate: 'commissionJunction',
      match: (() => this.commissionJunctionDomains.includes(new URL(this.affiliateUrl).hostname))(),
      getTrackingUrl: (memberId: string) => this.addParameter('sid', memberId),
    };
  }

  private tradedoubler(): AffiliateConfigurationMatch {
    return {
      affiliate: 'tradedoubler',
      match: this.matchHostname('tradedoubler.com'),
      getTrackingUrl: (memberId: string) => this.addParameter('epi', memberId),
    };
  }

  // #endregion Affiliate Configuration

  /**
   * List of Commission Junction domains.
   */
  private commissionJunctionDomains = [
    'www.anrdoezrs.net',
    'www.apmebf.com',
    'www.awltovhc.com',
    'www.dpbolvw.net',
    'www.emjcd.com',
    'www.ftjcfx.com',
    'www.jdoqocy.com',
    'www.kqzyfj.com',
    'www.lduhtrp.net',
    'www.mjbpab.com',
    'www.qksrv.net',
    'www.qksz.net',
    'www.tkqlhce.com',
    'www.tqlkg.com',
    'anrdoezrs.net',
    'apmebf.com',
    'awltovhc.com',
    'dpbolvw.net',
    'emjcd.com',
    'ftjcfx.com',
    'jdoqocy.com',
    'kqzyfj.com',
    'lduhtrp.net',
    'mjbpab.com',
    'qksrv.net',
    'qksz.net',
    'tkqlhce.com',
    'tqlkg.com',
  ];

  /**
   * Checks if the hostname includes the identifier.
   *
   * @param identifier String to match against the hostname.
   * @returns `true` if the hostname includes the identifier.
   */
  private matchHostname(identifier: string) {
    return new URL(this.affiliateUrl).hostname.includes(identifier);
  }

  /**
   * Checks if the pathname includes the identifier.
   *
   * @param identifier String to match against the pathname.
   * @returns `true` if the pathname includes the identifier.
   */
  private matchPathname(identifier: string) {
    return new URL(this.affiliateUrl).pathname.includes(identifier);
  }

  /**
   * Adds a search parameter to the affiliate URL.
   *
   * @param parameter Name of the search parameter to add.
   * @param value Value of the search parameter to add.
   * @returns The affiliate URL with the search parameter added.
   */
  private addParameter(parameter: string, value: string) {
    const url = new URL(this.affiliateUrl);
    url.searchParams.append(parameter, value);
    return url.href;
  }
}
