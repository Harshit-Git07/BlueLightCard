import { afterAll, describe, expect, jest, test } from '@jest/globals';

import { AffiliateHelper } from './AffiliateHelper';

describe('Create Affiliate Tracking URL', () => {
  const memberId = '1234';

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should correctly configure Awin tracking URL', async () => {
    const url = 'https://www.awin1.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: 'https://www.awin1.com/?clickref=1234' }, kind: 'OK' });
  });

  test('should correctly configure Affiliate Future tracking URL', async () => {
    const url = 'https://scripts.affiliatefuture.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({
      data: { url: `https://scripts.affiliatefuture.com/?tracking=${memberId}` },
      kind: 'OK',
    });
  });

  test('should correctly configure Rakuten tracking URL', async () => {
    const url = 'https://click.linksynergy.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://click.linksynergy.com/?u1=${memberId}` }, kind: 'OK' });
  });

  test('should correctly configure Affilinet tracking URL', async () => {
    const url = 'https://being.successfultogether.co.uk/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({
      data: { url: `https://being.successfultogether.co.uk/?subid=${memberId}` },
      kind: 'OK',
    });
  });

  test('should correctly configure Webgains tracking URL', async () => {
    const url = 'https://track.webgains.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://track.webgains.com/?clickref=${memberId}` }, kind: 'OK' });
  });

  test('should correctly configure Partnerize tracking URL with MEMID', async () => {
    const url = 'https://prf.hn/MEMID/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://prf.hn/${memberId}/` }, kind: 'OK' });
  });

  test('should correctly configure Partnerize tracking URL with /destination:', async () => {
    const url = 'https://prf.hn/destination:https://example.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({
      data: { url: `https://prf.hn/pubref:${memberId}/destination:https://example.com/` },
      kind: 'OK',
    });
  });

  test('should correctly configure Impact Radius tracking URL', async () => {
    const url = 'https://impact.example.com/c/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://impact.example.com/c/?subId1=${memberId}` }, kind: 'OK' });
  });

  test('should correctly configure Adtraction tracking URL', async () => {
    const url = 'https://track.adtraction.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://track.adtraction.com/?epi=${memberId}` }, kind: 'OK' });
  });

  test('should correctly configure Affiliate Gateway tracking URL', async () => {
    const url = 'https://www.tagserve.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://www.tagserve.com/?SUBID=${memberId}` }, kind: 'OK' });
  });

  test('should correctly configure Optimise Media tracking URL', async () => {
    const url = 'https://clk.omgt1.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://clk.omgt1.com/?UID=${memberId}` }, kind: 'OK' });
  });

  test.each([
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
  ])('should correctly configure Commission Junction tracking URL: %s', async (domain) => {
    const url = `https://${domain}/`;
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://${domain}/?sid=${memberId}` }, kind: 'OK' });
  });

  test('should correctly configure Tradedoubler tracking URL', async () => {
    const url = 'https://tradedoubler.com/';
    const trackingUrlData = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(trackingUrlData).toEqual({ data: { url: `https://tradedoubler.com/?epi=${memberId}` }, kind: 'OK' });
  });

  test('should return a 500 error if the url does not exist', async () => {
    const url = 'https://non-existant.com/';
    const res = AffiliateHelper.getTrackingUrl(memberId, url);
    expect(res).toEqual({ data: { url, message: 'Affiliate not supported' }, kind: 'NotSupportedAffiliate' });
  });
});
