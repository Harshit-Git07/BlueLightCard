import { afterAll, describe, expect, jest, test } from '@jest/globals';

import { Logger } from '@blc-mono/core/src/utils/logger/logger';

import { Response } from '../../../../core/src/utils/restResponse/response';

import { handler } from './postAffiliate';

describe('Create Affiliate Tracking URL', () => {
  const memberId = '1234';

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should correctly configure Awin tracking URL', async () => {
    const url = 'https://www.awin1.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?clickref=${memberId}` } }));
  });

  test('should correctly configure Affiliate Future tracking URL', async () => {
    const url = 'https://scripts.affiliatefuture.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?tracking=${memberId}` } }));
  });

  test('should correctly configure Rakuten tracking URL', async () => {
    const url = 'https://click.linksynergy.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?u1=${memberId}` } }));
  });

  test('should correctly configure Affilinet tracking URL', async () => {
    const url = 'https://being.successfultogether.co.uk/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?subid=${memberId}` } }));
  });

  test('should correctly configure Webgains tracking URL', async () => {
    const url = 'https://track.webgains.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?clickref=${memberId}` } }));
  });

  test('should correctly configure Partnerize tracking URL with MEMID', async () => {
    const url = 'https://prf.hn/MEMID/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `https://prf.hn/${memberId}/` } }));
  });

  test('should correctly configure Partnerize tracking URL with /destination:', async () => {
    const url = 'https://prf.hn/destination:https://example.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(
      Response.OK({
        message: 'Success',
        data: { trackingUrl: `https://prf.hn/pubref:${memberId}/destination:https://example.com/` },
      }),
    );
  });

  test('should correctly configure Impact Radius tracking URL', async () => {
    const url = 'https://impact.example.com/c/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?subId1=${memberId}` } }));
  });

  test('should correctly configure Adtraction tracking URL', async () => {
    const url = 'https://track.adtraction.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?epi=${memberId}` } }));
  });

  test('should correctly configure Affiliate Gateway tracking URL', async () => {
    const url = 'https://www.tagserve.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?SUBID=${memberId}` } }));
  });

  test('should correctly configure Optimise Media tracking URL', async () => {
    const url = 'https://clk.omgt1.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?UID=${memberId}` } }));
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

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?sid=${memberId}` } }));
  });

  test('should correctly configure Tradedoubler tracking URL', async () => {
    const url = 'https://tradedoubler.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?epi=${memberId}` } }));
  });

  test('logger should log available information', async () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'info');
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-11-20T16:56:44.417Z');

    const url = 'https://tradedoubler.com/';
    const affiliateUrl = url;

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl,
        memberId,
      }),
    });

    expect(loggerSpy).toBeCalledWith({
      message: 'POST Affiliate Input',
    });

    expect(res).toEqual(Response.OK({ message: 'Success', data: { trackingUrl: `${url}?epi=${memberId}` } }));
  });

  test('should return a 500 error if the url does not exist', async () => {
    const url = 'https://non-existant.com/';

    // @ts-expect-error - We're not testing the event object
    const res = await handler({
      body: JSON.stringify({
        affiliateUrl: url,
        memberId,
      }),
    });

    expect(res).toEqual(Response.Error(new Error('Error while creating tracking URL')));
  });
});
