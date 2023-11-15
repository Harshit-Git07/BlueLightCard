import _ from 'lodash';

declare module 'lodash' {
  interface LoDashStatic {
    find<T>(collection: List<T> | Dictionary<T>, predicate?: ListIteratee<T>): T;
  }
}

interface Affiliate {
  match: boolean;
  url: () => string;
}

/**
 *  This class configures the tracking URLS for affiliates
 *  @param affiliateUrl - The default affilate URL string
 *  @param memberId - The members ID
 */
export class AffiliateConfiguration {
  url: URL;
  trackingUrl: string;

  constructor(private readonly affiliateUrl: string, private readonly memberId: string) {
    this.url = new URL(this.affiliateUrl);

    const affiliates: Record<string, Affiliate> = {
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

    this.trackingUrl = _.find(affiliates, (affiliate) => affiliate.match).url();
  }

  awin() {
    return {
      match: this.matchHostname('www.awin1.com'),
      url: () => this.addParameter('clickref'),
    };
  }

  affiliateFuture() {
    return {
      match: this.matchHostname('scripts.affiliatefuture.com'),
      url: () => this.addParameter('tracking'),
    };
  }

  rakuten() {
    return {
      match: this.matchHostname('click.linksynergy.com'),
      url: () => this.addParameter('u1'),
    };
  }

  affilinet() {
    return {
      match: this.matchHostname('being.successfultogether.co.uk'),
      url: () => this.addParameter('subid'),
    };
  }

  webgains() {
    return {
      match: this.matchHostname('track.webgains.com'),
      url: () => this.addParameter('clickref'),
    };
  }

  partnerize() {
    return {
      match: this.matchHostname('prf.hn'),
      url: () => {
        this.url.pathname = this.url.pathname.includes('MEMID')
          ? this.url.pathname.replace('MEMID', this.memberId)
          : this.url.pathname.replace('/destination:', `/pubref:${this.memberId}/destination:`);

        return this.url.href;
      },
    };
  }

  impactRadius() {
    return {
      match: this.matchPathname('/c/'),
      url: () => this.addParameter('subId1'),
    };
  }

  adtraction() {
    return {
      match: this.matchHostname('track.adtraction.com'),
      url: () => this.addParameter('epi'),
    };
  }

  affiliateGateway() {
    return {
      match: this.matchHostname('www.tagserve.com'),
      url: () => this.addParameter('SUBID'),
    };
  }

  optimiseMedia() {
    return {
      match: this.matchHostname('clk.omgt1.com'),
      url: () => this.addParameter('UID'),
    };
  }

  commissionJunction() {
    return {
      match: (() => this.commissionJunctionDomains.includes(this.url.hostname))(),
      url: () => this.addParameter('sid'),
    };
  }

  tradedoubler() {
    return {
      match: this.matchHostname('tradedoubler.com'),
      url: () => this.addParameter('epi'),
    };
  }

  commissionJunctionDomains = [
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
  ].toString();

  matchHostname(identifier: string) {
    return this.url.hostname.includes(identifier);
  }

  matchPathname(identifier: string) {
    return this.url.pathname.includes(identifier);
  }

  addParameter(parameter: string) {
    this.url.searchParams.append(parameter, this.memberId);
    return this.url.href;
  }
}
