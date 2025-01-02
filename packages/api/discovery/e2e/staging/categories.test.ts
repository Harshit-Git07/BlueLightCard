import { randomUUID } from 'node:crypto';

import { Event as SanityEvent, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { subDays } from 'date-fns';
import { ApiGatewayV1Api } from 'sst/node/api';

import { CategoryResponse } from '@blc-mono/discovery/application/models/CategoryResponse';
import { EventResponse } from '@blc-mono/discovery/application/models/EventResponse';
import { EventStatus, EventType, OfferType } from '@blc-mono/discovery/application/models/Offer';
import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';
import { SimpleCategory } from '@blc-mono/discovery/application/models/SimpleCategory';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityEventOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityEventOffer';
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
      {
        id: '19',
        name: 'Events',
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
  const activeEventUUID = `test-${randomUUID().toString()}`;
  const activeEventUUID2 = `test-${randomUUID().toString()}`;
  const expiredEventUUID = `test-${randomUUID().toString()}`;
  const excludedEventUUID = `test-${randomUUID().toString()}`;
  const excludedEventUUID2 = `test-${randomUUID().toString()}`;
  const guestlistExpiredEventUUID = `test-${randomUUID().toString()}`;

  const offers: SanityOffer[] = [
    {
      ...buildTestSanityOffer({ id: activeOfferUUID, companyId: generatedCompanyUUID }),
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
      ...buildTestSanityOffer({ id: activeOfferUUID2, companyId: generatedCompanyUUID }),
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

  const events: SanityEvent[] = [
    {
      ...buildTestSanityEventOffer({ _id: activeEventUUID }),
      includedTrust: [],
      excludedTrust: [],
      name: activeEventUUID,
      categorySelection: [
        {
          _key: '',
          category1: {
            _id: '19',
            _type: 'category',
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            id: 19,
            name: 'Event',
            level: 3,
            parentCategoryIds: [],
          },
        },
      ],
    },
    {
      ...buildTestSanityEventOffer({ _id: guestlistExpiredEventUUID }),
      includedTrust: [],
      excludedTrust: [],
      name: activeEventUUID,
      categorySelection: [
        {
          _key: '',
          category1: {
            _id: '19',
            _type: 'category',
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            id: 19,
            name: 'Event',
            level: 3,
            parentCategoryIds: [],
          },
        },
      ],
      guestlistComplete: subDays(new Date(), 1).toISOString(),
    },
    {
      ...buildTestSanityEventOffer({ _id: expiredEventUUID }),
      includedTrust: [],
      excludedTrust: [],
      status: EventStatus.EXPIRED,
      name: activeEventUUID,
      categorySelection: [
        {
          _key: '',
          category1: {
            _id: '19',
            _type: 'category',
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            id: 19,
            name: 'Event',
            level: 3,
            parentCategoryIds: [],
          },
        },
      ],
    },
    {
      ...buildTestSanityEventOffer({ _id: excludedEventUUID }),
      includedTrust: [],
      excludedTrust: [
        {
          _createdAt: '2024-09-21T11:16:00Z',
          _id: '1021256801aea8359ac41110e7e980084b39bdbbda94308f293478331ce4e9c2',
          _rev: '7ka7e2D4B46GtcD4HOHgpB',
          _type: 'trust',
          _updatedAt: '2024-09-21T11:16:00Z',
          code: 'REGFOR',
          description: '',
          name: 'blc',
          trustId: 38,
        },
      ],
      name: activeEventUUID,
      categorySelection: [
        {
          _key: '',
          category1: {
            _id: '19',
            _type: 'category',
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            id: 19,
            name: 'Event',
            level: 3,
            parentCategoryIds: [],
          },
        },
      ],
    },
    {
      ...buildTestSanityEventOffer({ _id: excludedEventUUID2 }),
      includedTrust: [
        {
          _createdAt: '2024-09-21T11:16:00Z',
          _id: '1021256801aea8359ac41110e7e980084b39bdbbda94308f293478331ce4e9c2',
          _rev: '7ka7e2D4B46GtcD4HOHgpB',
          _type: 'trust',
          _updatedAt: '2024-09-21T11:16:00Z',
          code: 'REGFOR',
          description: '',
          name: 'HM Armed Forces',
          trustId: 38,
        },
      ],
      excludedTrust: [],
      name: activeEventUUID,
      categorySelection: [
        {
          _key: '',
          category1: {
            _id: '19',
            _type: 'category',
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            id: 19,
            name: 'Event',
            level: 3,
            parentCategoryIds: [],
          },
        },
      ],
    },
    {
      ...buildTestSanityEventOffer({
        _id: activeEventUUID2,
      }),
      includedTrust: [],
      excludedTrust: [],
      name: activeEventUUID2,
      categorySelection: [
        {
          _key: '',
          category1: {
            _id: '4',
            _type: 'category',
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            id: 4,
            name: 'Event',
            level: 3,
            parentCategoryIds: [],
          },
        },
      ],
    },
  ];

  afterAll(async () => {
    await sendTestEvents({
      source: Events.OFFER_DELETED,
      events: offers.map((offer) => ({ ...offer, _updatedAt: new Date(Date.now()).toISOString() })),
    });

    await sendTestEvents({
      source: Events.EVENT_DELETED,
      events: events.map((event) => ({ ...event, _updatedAt: new Date(Date.now()).toISOString() })),
    });
  });

  beforeAll(async () => {
    await sendTestEvents({ source: Events.EVENT_CREATED, events });
    await new Promise((resolve) => setTimeout(resolve, 2000));

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

  it.only('should consume events and return only valid events when queries by category', async () => {
    const expectedSearchResult: EventResponse = {
      eventID: activeEventUUID,
      eventName: activeEventUUID,
      offerType: EventType.TICKET,
      imageURL: 'https://example.com/image.jpg',
      eventDescription: 'This is a heading↵ This is a paragraph.',
      venueID: 'dc1adf94-f6f5-4d77-a155-65f72928fb77',
      venueName: 'The O2 Arena',
    };

    const result = await whenCategoryIsCalledWith(
      {
        dob: '2001-01-01',
        organisation: 'blc',
      },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
      '19',
    );

    const results = (await result.json()) as { data: { data: EventResponse[] } };

    expect(results.data.data.length).toEqual(1);
    const searchResult = results.data.data.find((result) => result.eventID === activeEventUUID);
    const expiredSearchResult = results.data.data.find((result) => result.eventID === expiredEventUUID);
    const excludedSearchResult = results.data.data.find(
      (result) => result.eventID === excludedEventUUID || result.eventID === excludedEventUUID2,
    );
    const gueslistExpiredSearchResult = results.data.data.find(
      (result) => result.eventID === guestlistExpiredEventUUID,
    );

    expect(searchResult).toBeDefined();
    expect(expiredSearchResult).toBeUndefined();
    expect(excludedSearchResult).toBeUndefined();
    expect(gueslistExpiredSearchResult).toBeUndefined();
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
