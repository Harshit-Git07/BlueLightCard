import { faker } from '@faker-js/faker';
import { describe, expect } from '@jest/globals';

import { AffiliateConfigurationHelper } from './AffiliateConfiguration';

describe('AffiliateConfigurationHelper', () => {
  const memberId = faker.string.numeric(4);

  it('should return null if the affiliate is not supported', () => {
    // Arrange
    const affiliateUrl = 'https://www.example.com/a/b?c=d';

    // Act
    const result = new AffiliateConfigurationHelper(affiliateUrl).getConfig();

    // Assert
    expect(result).toBeNull();
  });

  it.each([
    ['https://www.awin1.com/a/b?c=d', `https://www.awin1.com/a/b?c=d&clickref=${memberId}`],
    ['https://scripts.affiliatefuture.com/a/b?c=d', `https://scripts.affiliatefuture.com/a/b?c=d&tracking=${memberId}`],
    ['https://click.linksynergy.com/a/b?c=d', `https://click.linksynergy.com/a/b?c=d&u1=${memberId}`],
    [
      'https://being.successfultogether.co.uk/a/b?c=d',
      `https://being.successfultogether.co.uk/a/b?c=d&subid=${memberId}`,
    ],
    ['https://track.webgains.com/a/b?c=d', `https://track.webgains.com/a/b?c=d&clickref=${memberId}`],
    ['https://prf.hn/a/b?c=d', 'https://prf.hn/a/b?c=d'],
    ['https://prf.hn/a/MEMID/b?c=d', `https://prf.hn/a/${memberId}/b?c=d`],
    ['https://prf.hn/a/destination:/b?c=d', `https://prf.hn/a/pubref:${memberId}/destination:/b?c=d`],
    ['https://prf.hn/a/camref:/b?c=d', `https://prf.hn/a/pubref:${memberId}/camref:/b?c=d`],
    ['https://www.example.com/c/?c=d', `https://www.example.com/c/?c=d&subId1=${memberId}`],
    ['https://track.adtraction.com/a/b?c=d', `https://track.adtraction.com/a/b?c=d&epi=${memberId}`],
    ['https://www.tagserve.com/a/b?c=d', `https://www.tagserve.com/a/b?c=d&SUBID=${memberId}`],
    ['https://clk.omgt1.com/a/b?c=d', `https://clk.omgt1.com/a/b?c=d&UID=${memberId}`],
    ['https://www.anrdoezrs.net/a/b?c=d', `https://www.anrdoezrs.net/a/b?c=d&sid=${memberId}`],
    ['https://www.apmebf.com/a/b?c=d', `https://www.apmebf.com/a/b?c=d&sid=${memberId}`],
    ['https://www.awltovhc.com/a/b?c=d', `https://www.awltovhc.com/a/b?c=d&sid=${memberId}`],
    ['https://www.dpbolvw.net/a/b?c=d', `https://www.dpbolvw.net/a/b?c=d&sid=${memberId}`],
    ['https://www.emjcd.com/a/b?c=d', `https://www.emjcd.com/a/b?c=d&sid=${memberId}`],
    ['https://www.ftjcfx.com/a/b?c=d', `https://www.ftjcfx.com/a/b?c=d&sid=${memberId}`],
    ['https://www.jdoqocy.com/a/b?c=d', `https://www.jdoqocy.com/a/b?c=d&sid=${memberId}`],
    ['https://www.kqzyfj.com/a/b?c=d', `https://www.kqzyfj.com/a/b?c=d&sid=${memberId}`],
    ['https://www.lduhtrp.net/a/b?c=d', `https://www.lduhtrp.net/a/b?c=d&sid=${memberId}`],
    ['https://www.mjbpab.com/a/b?c=d', `https://www.mjbpab.com/a/b?c=d&sid=${memberId}`],
    ['https://www.qksrv.net/a/b?c=d', `https://www.qksrv.net/a/b?c=d&sid=${memberId}`],
    ['https://www.qksz.net/a/b?c=d', `https://www.qksz.net/a/b?c=d&sid=${memberId}`],
    ['https://www.tkqlhce.com/a/b?c=d', `https://www.tkqlhce.com/a/b?c=d&sid=${memberId}`],
    ['https://www.tqlkg.com/a/b?c=d', `https://www.tqlkg.com/a/b?c=d&sid=${memberId}`],
    ['https://anrdoezrs.net/a/b?c=d', `https://anrdoezrs.net/a/b?c=d&sid=${memberId}`],
    ['https://apmebf.com/a/b?c=d', `https://apmebf.com/a/b?c=d&sid=${memberId}`],
    ['https://awltovhc.com/a/b?c=d', `https://awltovhc.com/a/b?c=d&sid=${memberId}`],
    ['https://dpbolvw.net/a/b?c=d', `https://dpbolvw.net/a/b?c=d&sid=${memberId}`],
    ['https://emjcd.com/a/b?c=d', `https://emjcd.com/a/b?c=d&sid=${memberId}`],
    ['https://ftjcfx.com/a/b?c=d', `https://ftjcfx.com/a/b?c=d&sid=${memberId}`],
    ['https://jdoqocy.com/a/b?c=d', `https://jdoqocy.com/a/b?c=d&sid=${memberId}`],
    ['https://kqzyfj.com/a/b?c=d', `https://kqzyfj.com/a/b?c=d&sid=${memberId}`],
    ['https://lduhtrp.net/a/b?c=d', `https://lduhtrp.net/a/b?c=d&sid=${memberId}`],
    ['https://mjbpab.com/a/b?c=d', `https://mjbpab.com/a/b?c=d&sid=${memberId}`],
    ['https://qksrv.net/a/b?c=d', `https://qksrv.net/a/b?c=d&sid=${memberId}`],
    ['https://qksz.net/a/b?c=d', `https://qksz.net/a/b?c=d&sid=${memberId}`],
    ['https://tkqlhce.com/a/b?c=d', `https://tkqlhce.com/a/b?c=d&sid=${memberId}`],
    ['https://tqlkg.com/a/b?c=d', `https://tqlkg.com/a/b?c=d&sid=${memberId}`],
    ['https://tradedoubler.com/a/b?c=d', `https://tradedoubler.com/a/b?c=d&epi=${memberId}`],
  ])('should generate the correct tracking URL for %s', (affiliateUrl, trackingUrl) => {
    // Arrange
    const affiliateConfiguration = new AffiliateConfigurationHelper(affiliateUrl).getConfig();

    // Act
    const result = affiliateConfiguration!.getTrackingUrl(memberId);

    // Assert
    expect(result).toEqual(trackingUrl);
  });

  it.each([
    ['https://www.awin1.com/a/b?c=d', 'awin'],
    ['https://scripts.affiliatefuture.com/a/b?c=d', 'affiliateFuture'],
    ['https://click.linksynergy.com/a/b?c=d', 'rakuten'],
    ['https://being.successfultogether.co.uk/a/b?c=d', 'affilinet'],
    ['https://track.webgains.com/a/b?c=d', 'webgains'],
    ['https://prf.hn/a/b?c=d', 'partnerize'],
    ['https://prf.hn/a/MEMID/b?c=d', 'partnerize'],
    ['https://prf.hn/a/destination:/b?c=d', 'partnerize'],
    ['https://prf.hn/a/camref:/b?c=d', 'partnerize'],
    ['https://www.example.com/c/?c=d', 'impactRadius'],
    ['https://track.adtraction.com/a/b?c=d', 'adtraction'],
    ['https://www.tagserve.com/a/b?c=d', 'affiliateGateway'],
    ['https://clk.omgt1.com/a/b?c=d', 'optimiseMedia'],
    ['https://www.anrdoezrs.net/a/b?c=d', 'commissionJunction'],
    ['https://www.apmebf.com/a/b?c=d', 'commissionJunction'],
    ['https://www.awltovhc.com/a/b?c=d', 'commissionJunction'],
    ['https://www.dpbolvw.net/a/b?c=d', 'commissionJunction'],
    ['https://www.emjcd.com/a/b?c=d', 'commissionJunction'],
    ['https://www.ftjcfx.com/a/b?c=d', 'commissionJunction'],
    ['https://www.jdoqocy.com/a/b?c=d', 'commissionJunction'],
    ['https://www.kqzyfj.com/a/b?c=d', 'commissionJunction'],
    ['https://www.lduhtrp.net/a/b?c=d', 'commissionJunction'],
    ['https://www.mjbpab.com/a/b?c=d', 'commissionJunction'],
    ['https://www.qksrv.net/a/b?c=d', 'commissionJunction'],
    ['https://www.qksz.net/a/b?c=d', 'commissionJunction'],
    ['https://www.tkqlhce.com/a/b?c=d', 'commissionJunction'],
    ['https://www.tqlkg.com/a/b?c=d', 'commissionJunction'],
    ['https://anrdoezrs.net/a/b?c=d', 'commissionJunction'],
    ['https://apmebf.com/a/b?c=d', 'commissionJunction'],
    ['https://awltovhc.com/a/b?c=d', 'commissionJunction'],
    ['https://dpbolvw.net/a/b?c=d', 'commissionJunction'],
    ['https://emjcd.com/a/b?c=d', 'commissionJunction'],
    ['https://ftjcfx.com/a/b?c=d', 'commissionJunction'],
    ['https://jdoqocy.com/a/b?c=d', 'commissionJunction'],
    ['https://kqzyfj.com/a/b?c=d', 'commissionJunction'],
    ['https://lduhtrp.net/a/b?c=d', 'commissionJunction'],
    ['https://mjbpab.com/a/b?c=d', 'commissionJunction'],
    ['https://qksrv.net/a/b?c=d', 'commissionJunction'],
    ['https://qksz.net/a/b?c=d', 'commissionJunction'],
    ['https://tkqlhce.com/a/b?c=d', 'commissionJunction'],
    ['https://tqlkg.com/a/b?c=d', 'commissionJunction'],
    ['https://tradedoubler.com/a/b?c=d', 'tradedoubler'],
  ])('should generate the correct affiliate for %s', (affiliateUrl, affiliate) => {
    // Arrange
    const affiliateConfiguration = new AffiliateConfigurationHelper(affiliateUrl).getConfig()!;

    // Act
    const result = affiliateConfiguration.affiliate;

    // Assert
    expect(result).toEqual(affiliate);
  });
});
