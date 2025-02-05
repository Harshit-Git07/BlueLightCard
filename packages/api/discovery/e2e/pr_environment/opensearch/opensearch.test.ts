import { randomUUID } from 'node:crypto';

import { Company as SanityCompany, Event as SanityEvent, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { addMonths, subDays, subMonths } from 'date-fns';

import { EventStatus } from '@blc-mono/discovery/application/models/Offer';
import { SanityCompanyLocationEventBody } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyLocationToCompanyLocation';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityCompany } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompany';
import { buildTestSanityCompanyLocation } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompanyLocation';
import { buildTestSanityEventOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityEventOffer';
import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';

import { TestUser } from '../../TestUser';

import { categoriesOpenSearchTests } from './categoriesTests';
import { companiesOpenSearchTests } from './companyTests';
import { nearestOpenSearchTests } from './nearestTests';
import { searchOpenSearchTests } from './searchTests';

describe('OpenSearch Integration Tests', async () => {
  const testUserTokens = await TestUser.authenticate();

  const companyUUID = `test-company-${randomUUID().toString()}`;
  const activeOfferUUID = `test-${randomUUID().toString()}`;
  const activeEventUUID = `test-${randomUUID().toString()}`;
  const expiredEventUUID = `test-${randomUUID().toString()}`;
  const excludedEventUUID = `test-${randomUUID().toString()}`;
  const guestlistExpiredEventUUID = `test-${randomUUID().toString()}`;
  const evergreenOfferUUID = `test-${randomUUID().toString()}`;
  const validStartDateOfferNoExpiryDateUUID = `test-${randomUUID().toString()}`;
  const validExpiryDateOfferNoStartDateUUID = `test-${randomUUID().toString()}`;
  const statusExpiredOfferUUID = `test-${randomUUID().toString()}`;
  const expiryDateReachedOfferUUID = `test-${randomUUID().toString()}`;
  const futureStartDateOfferUUID = `test-${randomUUID().toString()}`;
  const updatedAtTimeStamp = new Date().toISOString();

  const companies: SanityCompany[] = [buildTestSanityCompany({ id: companyUUID })];
  const offers: SanityOffer[] = [
    {
      ...buildTestSanityOffer({ id: activeOfferUUID, companyId: companyUUID }),
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
  ];
  const searchOffers: SanityOffer[] = [
    {
      ...buildTestSanityOffer({
        id: evergreenOfferUUID,
        companyId: companyUUID,
        name: evergreenOfferUUID,
        startDate: new Date(Date.now()).toISOString(),
        evergreen: true,
      }),
      expires: undefined,
    },
    {
      ...buildTestSanityOffer({
        id: validStartDateOfferNoExpiryDateUUID,
        companyId: companyUUID,
      }),
      name: validStartDateOfferNoExpiryDateUUID,
      start: subMonths(new Date(), 1).toISOString(),
      expires: undefined,
    },
    {
      ...buildTestSanityOffer({
        id: validExpiryDateOfferNoStartDateUUID,
        companyId: companyUUID,
      }),

      name: validExpiryDateOfferNoStartDateUUID,
      start: undefined,
      expires: addMonths(new Date(), 1).toISOString(),
    },
    {
      ...buildTestSanityOffer({
        id: statusExpiredOfferUUID,
        companyId: companyUUID,
      }),
      name: statusExpiredOfferUUID,
      start: subMonths(new Date(), 1).toISOString(),
      expires: addMonths(new Date(), 1).toISOString(),
      status: 'expired',
    },
    {
      ...buildTestSanityOffer({
        id: expiryDateReachedOfferUUID,
        companyId: companyUUID,
      }),
      name: expiryDateReachedOfferUUID,
      start: subMonths(new Date(), 2).toISOString(),
      expires: subMonths(new Date(), 1).toISOString(),
    },
    {
      ...buildTestSanityOffer({
        id: futureStartDateOfferUUID,
        companyId: companyUUID,
      }),
      name: futureStartDateOfferUUID,
      start: addMonths(new Date(), 1).toISOString(),
      expires: addMonths(new Date(), 2).toISOString(),
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
      name: guestlistExpiredEventUUID,
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
      name: expiredEventUUID,
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
          name: 'DEN',
          trustId: 38,
        },
      ],
      name: excludedEventUUID,
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
  ];

  const companyLocationEvents: SanityCompanyLocationEventBody[] = [
    buildTestSanityCompanyLocation({
      _id: companyUUID,
      _updatedAt: updatedAtTimeStamp,
    }),
  ];

  beforeAll(async () => {
    await sendTestEvents({ source: Events.EVENT_CREATED, events });
    await sendTestEvents({ source: Events.OFFER_CREATED, events: offers });
    await sendTestEvents({ source: Events.OFFER_CREATED, events: searchOffers });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await sendTestEvents({ source: Events.COMPANY_LOCATION_BATCH_CREATED, events: companyLocationEvents });
    await sendTestEvents({ source: Events.COMPANY_CREATED, events: companies });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await sendTestEvents({ source: Events.OPENSEARCH_POPULATE_INDEX, events: offers });
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  afterAll(async () => {
    await sendTestEvents({
      source: Events.OFFER_DELETED,
      events: offers.map((offer) => ({ ...offer, _updatedAt: new Date(Date.now()).toISOString() })),
    });

    await sendTestEvents({
      source: Events.OFFER_DELETED,
      events: searchOffers.map((offer) => ({ ...offer, _updatedAt: new Date(Date.now()).toISOString() })),
    });

    await sendTestEvents({
      source: Events.EVENT_DELETED,
      events: events.map((event) => ({ ...event, _updatedAt: new Date(Date.now()).toISOString() })),
    });
  });

  describe('Categories', () => {
    categoriesOpenSearchTests({
      activeEventUUID,
      activeOfferUUID,
      companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
      companyUUID,
      excludedEventUUID,
      expiredEventUUID,
      guestlistExpiredEventUUID,
      testUserToken: testUserTokens.idToken,
    });
  });

  describe('Companies', () => {
    companiesOpenSearchTests({
      legacyCompanyID: offers[0].company?.companyId ?? 0,
      companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
      companyUUID,
      companyID: offers[0].company?._id ?? '',
      testUserToken: testUserTokens.idToken,
    });
  });

  describe('Search', () => {
    searchOpenSearchTests({
      activeOffer: {
        companyId: companyUUID,
        companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
        offerId: activeOfferUUID,
      },
      evergreenOffer: {
        companyId: companyUUID,
        companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
        offerId: evergreenOfferUUID,
      },
      expiredStatus: {
        companyId: companyUUID,
        companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
        offerId: statusExpiredOfferUUID,
      },
      expiryDateReached: {
        companyId: companyUUID,
        companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
        offerId: expiryDateReachedOfferUUID,
      },
      futureStartDate: {
        companyId: companyUUID,
        companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
        offerId: futureStartDateOfferUUID,
      },
      testUserToken: testUserTokens.idToken,
      validEndDateNoStart: {
        companyId: companyUUID,
        companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
        offerId: validExpiryDateOfferNoStartDateUUID,
      },
      validStartDateNoExpiry: {
        companyId: companyUUID,
        companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
        offerId: validStartDateOfferNoExpiryDateUUID,
      },
    });
  });

  describe('Nearest', () => {
    nearestOpenSearchTests({
      companyLocation: {
        lat: companyLocationEvents[0]?.locations[0]?.location?.lat ?? 0,
        lon: companyLocationEvents[0]?.locations[0]?.location?.lng ?? 0,
      },
      companyUUID,
      companyName: companies[0]?.brandCompanyDetails?.[0]?.companyName ?? '',
      testUserToken: testUserTokens.idToken,
      storeName: companyLocationEvents[0]?.locations[0]?.storeName ?? '',
    });
  });
});
