import { randomUUID } from 'node:crypto';

import { ApiGatewayV1Api } from 'sst/node/api';

import { Offer as SanityOffer } from '@blc-mono/discovery/application/models/SanityTypes';
import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';
import { TestUser } from '@blc-mono/redemptions/libs/test/helpers/identity';

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

describe('OpenSearch E2E Test', async () => {
  const testUserTokens = await TestUser.authenticate();
  const generatedUUID = randomUUID().toString();
  const openSearchQuery = { query: generatedUUID, dob: '1990-01-01', organisation: 'DEN' };
  const offers: SanityOffer[] = [buildTestSanityOffer()];
  offers[0]._id = generatedUUID;
  offers[0].name = generatedUUID;
  const companyName = offers[0].company?.brandCompanyDetails?.[0]?.companyName ?? '';
  const companyId = offers[0].company?._id ?? 0;

  const expectedSearchResult: SearchResult[] = [
    {
      ID: generatedUUID,
      OfferName: generatedUUID,
      OfferType: 'online',
      offerimg: 'https://testimage.com',
      CompID: companyId.toString(),
      CompanyName: companyName,
    },
  ];

  afterEach(async () => {
    await sendTestEvents({ source: Events.OFFER_DELETED, events: offers });
  });

  it('should push an offer to eventbridge and run index then query index for expected result', async () => {
    await sendTestEvents({ source: Events.OFFER_CREATED, events: offers });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await sendTestEvents({ source: Events.OPENSEARCH_POPULATE_INDEX, events: offers });
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const result = await whenSearchIsCalledWith(
      { ...openSearchQuery },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    expect(results.data.length).toBe(1);
    expect(results.data).toStrictEqual(expectedSearchResult);
  });
});
