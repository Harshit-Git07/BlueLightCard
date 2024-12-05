import { randomUUID } from 'node:crypto';

import { Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { ApiGatewayV1Api } from 'sst/node/api';

import { CategoryResponse } from '@blc-mono/discovery/application/models/CategoryResponse';
import { OfferType } from '@blc-mono/discovery/application/models/Offer';
import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';
import { SimpleCategory } from '@blc-mono/discovery/application/models/SimpleCategory';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityCompany } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompany';
import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';

describe('GET /categories', async () => {
  const testUserTokens = await TestUser.authenticate();

  const whenCategoriesIsCalledWith = async (headers: Record<string, string>) => {
    const categoriesEndpoint = `${ApiGatewayV1Api.discovery.url}categories`;
    return fetch(categoriesEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  };

  it.each([
    [200, 'A valid request is sent', { Authorization: `Bearer ${testUserTokens.idToken}` }],
    [401, 'No authorization header is provided', {}],
    [401, 'Invalid authorization header is provided', { Authorization: `Bearer invalidToken` }],
  ])('should return with response code %s when %s', async (statusCode, _description, headers) => {
    const result = await whenCategoriesIsCalledWith(headers);
    expect(result.status).toBe(statusCode);
  });

  it('should return the expected categories', async () => {
    const expectedCategories = [
      {
        id: '13',
        name: 'Health and Beauty',
      },
      {
        id: '16',
        name: 'Children and Toys',
      },
      {
        id: '8',
        name: 'Electrical',
      },
      {
        id: '4',
        name: 'Fashion',
      },
      {
        id: '7',
        name: 'Financial and Insurance',
      },
      {
        id: '12',
        name: 'Food and Drink',
      },
      {
        id: '17',
        name: 'Gifts and Flowers',
      },
      {
        id: '15',
        name: 'Holiday and Travel',
      },
      {
        id: '1',
        name: 'Home',
      },
      {
        id: '6',
        name: 'Jewellery and Watches',
      },
      {
        id: '11',
        name: 'Leisure and Entertainment',
      },
      {
        id: '18',
        name: 'Motor',
      },
      {
        id: '3',
        name: 'Pets',
      },
      {
        id: '9',
        name: 'Phones',
      },
      {
        id: '14',
        name: 'Sports and Fitness',
      },
    ];
    const result = await whenCategoriesIsCalledWith({ Authorization: `Bearer ${testUserTokens.idToken}` });
    const resultBody = (await result.json()) as { data: SimpleCategory[] };

    expect(resultBody.data).toStrictEqual(expectedCategories);
  });
});

describe('GET /categories/${id}', async () => {
  const testUserTokens = await TestUser.authenticate();
  const queryParams = {
    dob: '2001-01-01',
    organisation: 'blc',
  };

  it.each([
    [200, 'A valid request is sent', { Authorization: `Bearer ${testUserTokens.idToken}` }, '1'],
    [401, 'No authorization header is provided', {}, '1'],
    [401, 'Invalid authorization header is provided', { Authorization: `Bearer invalidToken` }, '1'],
    [400, 'Invalid category ID is provided', { Authorization: `Bearer ${testUserTokens.idToken}` }, 'Invalid'],
  ])('should return with response code %s when %s', async (statusCode, _description, headers, categoryId) => {
    const result = await whenCategoryIsCalledWith(queryParams, headers, categoryId);
    expect(result.status).toBe(statusCode);
  });

  it('should return the expected category', async () => {
    const result = await whenCategoryIsCalledWith(
      queryParams,
      { Authorization: `Bearer ${testUserTokens.idToken}` },
      '1',
    );
    const resultBody = (await result.json()) as { data: CategoryResponse };

    expect(resultBody.data.id).toStrictEqual('1');
    expect(resultBody.data.name).toStrictEqual('Home');
  });
});

describe('Categories E2E Event Handling', async () => {
  const testUserTokens = await TestUser.authenticate();
  const generatedCompanyUUID = `test-company-${randomUUID().toString()}`;
  const activeOfferUUID = `test-${randomUUID().toString()}`;
  const activeOfferUUID2 = `test-${randomUUID().toString()}`;

  const offers: SanityOffer[] = [
    {
      ...buildTestSanityOffer({ _id: activeOfferUUID, company: buildTestSanityCompany({ _id: generatedCompanyUUID }) }),
      name: activeOfferUUID,
      categorySelection: [
        {
          _key: '',
          category1: {
            _id: '1',
            _type: 'category',
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            id: 1,
            name: 'Test Category 2',
            level: 3,
            parentCategoryIds: [],
          },
        },
      ],
      start: new Date(Date.now()).toISOString(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      ...buildTestSanityOffer({
        _id: activeOfferUUID2,
        company: buildTestSanityCompany({ _id: generatedCompanyUUID }),
      }),
      name: activeOfferUUID2,
      categorySelection: [
        {
          _key: '',
          category1: {
            _id: '1',
            _type: 'category',
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            id: 3,
            name: 'Test Category 3',
            level: 3,
            parentCategoryIds: [],
          },
        },
      ],
      start: new Date(Date.now()).toISOString(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
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

  it('should consume offer and return it when queries by category', async () => {
    const companyName = offers[0].company?.brandCompanyDetails?.[0]?.companyName ?? '';
    const expectedSearchResult: OfferResponse = {
      offerID: activeOfferUUID,
      offerName: activeOfferUUID,
      offerType: OfferType.ONLINE,
      imageURL: 'https://testimage.com',
      companyID: generatedCompanyUUID,
      legacyOfferID: 1,
      offerDescription: 'Test to see if all linked to webhook - attempt n',
      legacyCompanyID: 1,
      companyName: companyName,
    };

    const result = await whenCategoryIsCalledWith(
      {
        dob: '2001-01-01',
        organisation: 'blc',
      },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
      '1',
    );

    const results = (await result.json()) as { data: { data: OfferResponse[] } };

    const searchResult = results.data.data.find((result) => result.offerID === activeOfferUUID);

    expect(searchResult).toBeDefined();
    expect(searchResult).toStrictEqual(expectedSearchResult);
  });
});

const whenCategoryIsCalledWith = async (
  params: Record<string, string>,
  headers: Record<string, string>,
  categoryId: string,
) => {
  const urlParams = new URLSearchParams(params);
  const categoriesEndpoint = `${ApiGatewayV1Api.discovery.url}categories/${categoryId}?${urlParams.toString()}`;
  return fetch(categoriesEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};
