import { randomUUID } from 'node:crypto';

import { Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { ApiGatewayV1Api } from 'sst/node/api';

import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityCompany } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompany';
import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';

const getSearchEndpoint = () => {
  if (ENDPOINTS.SEARCH === undefined || ENDPOINTS.SEARCH === '') {
    return `${ApiGatewayV1Api.discovery.url}search`;
  }
  return ENDPOINTS.SEARCH;
};

const whenSearchIsCalledWith = async (params: Record<string, string>, headers: Record<string, string>) => {
  const urlParams = new URLSearchParams(params);
  const searchEndpoint = getSearchEndpoint();
  return fetch(`${searchEndpoint}?${urlParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

describe('GET /search', async () => {
  const testUserTokens = await TestUser.authenticate();
  it.each([
    [
      200,
      'A valid request is sent',
      {
        query: 'Test Company',
        dob: '2001-01-01',
        organisation: 'blc',
      },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [401, 'No authorization header is provided', { query: 'JD Sports', isAgeGated: 'false', organisation: 'blc' }, {}],
    [
      401,
      'Invalid authorization header is provided',
      { query: 'JD Sports', isAgeGated: 'false', organisation: 'blc' },
      { Authorization: `Bearer invalidToken` },
    ],
    [
      400,
      'No search term is provided',
      { isAgeGated: 'false', organisation: 'blc' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [
      400,
      'No organisation is provided',
      { query: 'JD Sports', isAgeGated: 'false' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
  ])('should return with response code %s when %s', async (statusCode, _description, params, headers) => {
    const result = await whenSearchIsCalledWith(params, headers);
    expect(result.status).toBe(statusCode);
  });
});

describe('Search E2E Event Handling', async () => {
  const testUserTokens = await TestUser.authenticate();
  const generatedCompanyUUID = `test-company-${randomUUID().toString()}`;

  const activeOfferUUID = `test-${randomUUID().toString()}`;
  const expiredOfferUUID = `test-${randomUUID().toString()}`;
  const evergreenOfferUUID = `test-${randomUUID().toString()}`;

  const offers: SanityOffer[] = [
    {
      ...buildTestSanityOffer({ _id: activeOfferUUID, company: buildTestSanityCompany({ _id: generatedCompanyUUID }) }),
      name: activeOfferUUID,
      start: new Date(Date.now()).toISOString(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      ...buildTestSanityOffer({
        _id: expiredOfferUUID,
        company: buildTestSanityCompany({ _id: generatedCompanyUUID }),
      }),
      name: expiredOfferUUID,
      start: new Date(Date.now()).toISOString(),
      expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      ...buildTestSanityOffer({
        _id: evergreenOfferUUID,
        company: buildTestSanityCompany({ _id: generatedCompanyUUID }),
      }),
      name: evergreenOfferUUID,
      start: new Date(Date.now()).toISOString(),
      evergreen: true,
      expires: undefined,
    },
  ];

  afterAll(async () => {
    await sendTestEvents({
      source: Events.OFFER_DELETED,
      events: offers.map((offer) => ({ ...offer, _updatedAt: new Date(Date.now()).toISOString() })),
    });
  });

  beforeAll(async () => {
    await sendTestEvents({ source: Events.OFFER_CREATED, events: offers });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await sendTestEvents({ source: Events.OPENSEARCH_POPULATE_INDEX, events: offers });
    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  it('should consume offer created event with offer expires set', async () => {
    const companyName = offers[0].company?.brandCompanyDetails?.[0]?.companyName ?? '';
    const expectedSearchResult: SearchResult = {
      ID: activeOfferUUID,
      OfferName: activeOfferUUID,
      OfferType: 'online',
      offerimg: 'https://testimage.com',
      CompID: generatedCompanyUUID,
      LegacyID: 1,
      OfferDescription: 'Test to see if all linked to webhook - attempt n',
      LegacyCompanyID: 1,
      CompanyName: companyName,
    };

    const result = await whenSearchIsCalledWith(
      { query: activeOfferUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === activeOfferUUID);

    expect(searchResult).toStrictEqual(expectedSearchResult);
  });

  it('should not return expired offers in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: expiredOfferUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === expiredOfferUUID);

    expect([searchResult]).toStrictEqual([undefined]);
  });

  it('should consume offer created event with offer expires as undefined', async () => {
    const companyName = offers[2].company?.brandCompanyDetails?.[0]?.companyName ?? '';
    const companyId = offers[2].company?._id ?? 0;

    const expectedSearchResult: SearchResult[] = [
      {
        ID: evergreenOfferUUID,
        OfferName: evergreenOfferUUID,
        OfferType: 'online',
        offerimg: 'https://testimage.com',
        CompID: companyId.toString(),
        LegacyID: 1,
        OfferDescription: 'Test to see if all linked to webhook - attempt n',
        LegacyCompanyID: 1,
        CompanyName: companyName,
      },
    ];

    const result = await whenSearchIsCalledWith(
      { query: evergreenOfferUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === evergreenOfferUUID);
    expect([searchResult]).toStrictEqual(expectedSearchResult);
  });
});
