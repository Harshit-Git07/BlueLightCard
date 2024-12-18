import { randomUUID } from 'node:crypto';

import { Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { addMonths, subMonths } from 'date-fns';
import { ApiGatewayV1Api } from 'sst/node/api';

import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
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
  const evergreenOfferUUID = `test-${randomUUID().toString()}`;
  const expiryDateReachedOfferUUID = `test-${randomUUID().toString()}`;
  const futureStartDateOfferUUID = `test-${randomUUID().toString()}`;
  const statusExpiredOfferUUID = `test-${randomUUID().toString()}`;
  const invalidStartDateOfferNoExpiryDateUUID = `test-${randomUUID().toString()}`;
  const invalidExpiryDateOfferNoStartDateUUID = `test-${randomUUID().toString()}`;
  const validStartDateOfferNoExpiryDateUUID = `test-${randomUUID().toString()}`;
  const validExpiryDateOfferNoStartDateUUID = `test-${randomUUID().toString()}`;

  const offers: SanityOffer[] = [
    {
      ...buildTestSanityOffer({ id: activeOfferUUID, companyId: generatedCompanyUUID }),
      name: activeOfferUUID,
      start: subMonths(new Date(), 1).toISOString(),
      expires: addMonths(new Date(), 1).toISOString(),
      evergreen: false,
    },
    {
      ...buildTestSanityOffer({
        id: expiryDateReachedOfferUUID,
        companyId: generatedCompanyUUID,
      }),
      name: expiryDateReachedOfferUUID,
      start: subMonths(new Date(), 2).toISOString(),
      expires: subMonths(new Date(), 1).toISOString(),
    },
    {
      ...buildTestSanityOffer({
        id: futureStartDateOfferUUID,
        companyId: generatedCompanyUUID,
      }),
      name: futureStartDateOfferUUID,
      start: addMonths(new Date(), 1).toISOString(),
      expires: addMonths(new Date(), 2).toISOString(),
    },
    {
      ...buildTestSanityOffer({
        id: evergreenOfferUUID,
        companyId: generatedCompanyUUID,
        startDate: new Date(Date.now()).toISOString(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      }),
      name: evergreenOfferUUID,
      start: undefined,
      evergreen: true,
    },
    {
      ...buildTestSanityOffer({
        id: evergreenOfferUUID,
        companyId: generatedCompanyUUID,
        name: evergreenOfferUUID,
        startDate: new Date(Date.now()).toISOString(),
        evergreen: true,
      }),
      expires: undefined,
    },
    {
      ...buildTestSanityOffer({
        id: statusExpiredOfferUUID,
        companyId: generatedCompanyUUID,
      }),
      name: statusExpiredOfferUUID,
      start: subMonths(new Date(), 1).toISOString(),
      expires: addMonths(new Date(), 1).toISOString(),
      status: 'expired',
    },
    {
      ...buildTestSanityOffer({
        id: invalidStartDateOfferNoExpiryDateUUID,
        companyId: generatedCompanyUUID,
      }),
      name: invalidStartDateOfferNoExpiryDateUUID,
      start: addMonths(new Date(), 1).toISOString(),
      expires: undefined,
    },
    {
      ...buildTestSanityOffer({
        id: invalidExpiryDateOfferNoStartDateUUID,
        companyId: generatedCompanyUUID,
      }),
      name: invalidExpiryDateOfferNoStartDateUUID,
      start: undefined,
      expires: subMonths(new Date(), 1).toISOString(),
    },
    {
      ...buildTestSanityOffer({
        id: validStartDateOfferNoExpiryDateUUID,
        companyId: generatedCompanyUUID,
      }),
      name: validStartDateOfferNoExpiryDateUUID,
      start: subMonths(new Date(), 1).toISOString(),
      expires: undefined,
    },
    {
      ...buildTestSanityOffer({
        id: validExpiryDateOfferNoStartDateUUID,
        companyId: generatedCompanyUUID,
      }),

      name: validExpiryDateOfferNoStartDateUUID,
      start: undefined,
      expires: addMonths(new Date(), 1).toISOString(),
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

  it('should return offer with valid offer start and end dates set', async () => {
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

  it('should return offer with offer expires & offer start as undefined (evergeen)', async () => {
    const companyName = offers[3].company?.brandCompanyDetails?.[0]?.companyName ?? '';
    const companyId = offers[3].company?._id ?? 0;

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

  it('should return offer with offer expires not set & offer start valid', async () => {
    const companyName = offers[7].company?.brandCompanyDetails?.[0]?.companyName ?? '';
    const companyId = offers[7].company?._id ?? 0;

    const expectedSearchResult: SearchResult[] = [
      {
        ID: validStartDateOfferNoExpiryDateUUID,
        OfferName: validStartDateOfferNoExpiryDateUUID,
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
      { query: validStartDateOfferNoExpiryDateUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === validStartDateOfferNoExpiryDateUUID);
    expect([searchResult]).toStrictEqual(expectedSearchResult);
  });

  it('should return offer with offer start not set & offer expires valid', async () => {
    const companyName = offers[8].company?.brandCompanyDetails?.[0]?.companyName ?? '';
    const companyId = offers[8].company?._id ?? 0;

    const expectedSearchResult: SearchResult[] = [
      {
        ID: validExpiryDateOfferNoStartDateUUID,
        OfferName: validExpiryDateOfferNoStartDateUUID,
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
      { query: validExpiryDateOfferNoStartDateUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === validExpiryDateOfferNoStartDateUUID);
    expect([searchResult]).toStrictEqual(expectedSearchResult);
  });

  it('should not return offers with expiry date reached in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: expiryDateReachedOfferUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === expiryDateReachedOfferUUID);

    expect([searchResult]).toStrictEqual([undefined]);
  });

  it('should not return offers not yet started in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: futureStartDateOfferUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === futureStartDateOfferUUID);

    expect([searchResult]).toStrictEqual([undefined]);
  });

  it('should not return offers status "expired" in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: statusExpiredOfferUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === statusExpiredOfferUUID);

    expect([searchResult]).toStrictEqual([undefined]);
  });

  it('should not return offer with no expiry date and start date in the future in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: invalidStartDateOfferNoExpiryDateUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === invalidStartDateOfferNoExpiryDateUUID);

    expect([searchResult]).toStrictEqual([undefined]);
  });

  it('should not return offer with no start date and expiry date in the past in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: invalidExpiryDateOfferNoStartDateUUID, dob: '1990-01-01', organisation: 'DEN' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === invalidExpiryDateOfferNoStartDateUUID);

    expect([searchResult]).toStrictEqual([undefined]);
  });
});
