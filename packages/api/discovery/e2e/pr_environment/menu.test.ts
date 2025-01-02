import { randomUUID } from 'node:crypto';

import { Event as SanityEvent, MenuOffer as SanityMenuOffer, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { subDays, subYears } from 'date-fns';
import { ApiGatewayV1Api } from 'sst/node/api';

import { FlexibleMenuResponse } from '@blc-mono/discovery/application/models/FlexibleMenuResponse';
import { MenuResponse } from '@blc-mono/discovery/application/models/MenuResponse';
import { EventType } from '@blc-mono/discovery/application/models/Offer';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityEventOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityEventOffer';
import { buildTestSanityMenuOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMenuOffer';
import { buildTestSanityMenuThemedEvent } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMenuThemedEvent';
import { buildTestSanityMenuThemedOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMenuThemedOffer';
import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
import { buildTestSanitySite } from '@blc-mono/discovery/testScripts/helpers/buildTestSanitySite';
import { sendTestEvents } from '@blc-mono/discovery/testScripts/helpers/sendTestEvents';

import { getBlockText } from '../../helpers/sanityMappers/mapSanityOfferToOffer';

const getMenuEndpoint = () => {
  if (ENDPOINTS.MENU === undefined || ENDPOINTS.MENU === '') {
    return `${ApiGatewayV1Api.discovery.url}menus`;
  }
  return ENDPOINTS.MENU;
};

const whenMenuIsCalledWith = async (params: Record<string, string>, headers: Record<string, string>) => {
  const urlParams = new URLSearchParams(params);
  const menuEndpoint = getMenuEndpoint();
  const searchParams = urlParams.size > 0 ? `?${urlParams.toString()}` : '';

  return fetch(`${menuEndpoint}${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

const whenFlexibleMenuIsCalledWith = async (
  flexibleId: string,
  params: Record<string, string>,
  headers: Record<string, string>,
) => {
  const urlParams = new URLSearchParams(params);
  const menuEndpoint = getMenuEndpoint();
  const searchParams = urlParams.size > 0 ? `?${urlParams.toString()}` : '';
  const flexibleMenuEndpoint = `${menuEndpoint}/flexible/${flexibleId}`;

  return fetch(`${flexibleMenuEndpoint}${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

const generatedOfferUUID = `test-${randomUUID().toString()}`;
const generatedEventUUID = `test-${randomUUID().toString()}`;
const generatedExpiredEventUUID = `test-${randomUUID().toString()}`;
const generatedExcludedEventUUID = `test-${randomUUID().toString()}`;
const generatedClosedGuestlistEventUUID = `test-${randomUUID().toString()}`;
const generatedCompanyUUID = `test-company-${randomUUID().toString()}`;
const ageRestrictedOfferUUID = `test-${randomUUID().toString()}`;
const ageRestrictedCompanyUUID = `test-company-${randomUUID().toString()}`;
const trustRestrictedOfferUUID = `test-${randomUUID().toString()}`;
const trustRestrictedCompanyUUID = `test-company-${randomUUID().toString()}`;
const expiredOfferUUID = `test-${randomUUID().toString()}`;
const expiredCompanyUUID = `test-company-${randomUUID().toString()}`;
const marketplaceGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const dealsOfTheWeekGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const featuredOffersGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const flexibleGeneratedSubMenuUUID = `test-${randomUUID().toString()}`;
const flexibleGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const flexibleGeneratedEventSubMenuUUID = `test-${randomUUID().toString()}`;
const flexibleGeneratedEventMenuUUID = `test-${randomUUID().toString()}`;
const events: SanityEvent[] = [
  buildTestSanityEventOffer({ _id: generatedEventUUID }),
  buildTestSanityEventOffer({ _id: generatedExpiredEventUUID, status: 'expired' }),
  buildTestSanityEventOffer({
    _id: generatedClosedGuestlistEventUUID,
    guestlistComplete: subDays(new Date(), 1).toISOString(),
  }),
  buildTestSanityEventOffer({
    _id: generatedExcludedEventUUID,
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
  }),
];
const offers: SanityOffer[] = [
  buildTestSanityOffer({
    id: generatedOfferUUID,
    companyId: generatedCompanyUUID,
  }),
  buildTestSanityOffer({
    id: ageRestrictedOfferUUID,
    companyId: ageRestrictedCompanyUUID,
    ageRestrictions: ['21+'],
  }),
  buildTestSanityOffer({
    id: trustRestrictedOfferUUID,
    companyId: trustRestrictedCompanyUUID,
    excludedTrusts: ['POLICE'],
  }),
  buildTestSanityOffer({
    id: expiredOfferUUID,
    companyId: expiredCompanyUUID,
    status: 'expired',
  }),
];
const marketplaceSanityMenuOffer = buildTestSanityMenuOffer(offers, marketplaceGeneratedMenuUUID);
const dealsOfTheWeekSanityMenuOffer = buildTestSanityMenuOffer(offers, dealsOfTheWeekGeneratedMenuUUID);
const featuredOffersSanityMenuOffer = buildTestSanityMenuOffer(offers, featuredOffersGeneratedMenuUUID);
const flexibleSanityThemedMenuOffer = buildTestSanityMenuThemedOffer(
  offers,
  flexibleGeneratedMenuUUID,
  flexibleGeneratedSubMenuUUID,
);
const flexibleSanityThemedMenuEvent = buildTestSanityMenuThemedEvent(
  events,
  flexibleGeneratedEventMenuUUID,
  flexibleGeneratedEventSubMenuUUID,
);
const menus: SanityMenuOffer[] = [
  marketplaceSanityMenuOffer,
  dealsOfTheWeekSanityMenuOffer,
  featuredOffersSanityMenuOffer,
];

describe('Menu', async () => {
  describe('Menu E2E Event Handling', async () => {
    const testUserTokens = await TestUser.authenticate();

    beforeAll(async () => {
      await sendTestEvents({
        source: Events.SITE_CREATED,
        events: [buildTestSanitySite(dealsOfTheWeekGeneratedMenuUUID, featuredOffersGeneratedMenuUUID)],
      });
      await sendTestEvents({
        source: Events.OFFER_CREATED,
        events: offers,
      });
      await sendTestEvents({ source: Events.EVENT_CREATED, events });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await sendTestEvents({
        source: Events.MENU_OFFER_CREATED,
        events: menus,
      });
      await sendTestEvents({
        source: Events.MENU_THEMED_OFFER_CREATED,
        events: [flexibleSanityThemedMenuOffer],
      });
      await sendTestEvents({ source: Events.MENU_THEMED_EVENT_CREATED, events: [flexibleSanityThemedMenuEvent] });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    afterAll(async () => {
      await sendTestEvents({
        source: Events.MENU_OFFER_DELETED,
        events: [
          buildTestSanityMenuOffer(offers, marketplaceGeneratedMenuUUID),
          buildTestSanityMenuOffer(offers, dealsOfTheWeekGeneratedMenuUUID),
          buildTestSanityMenuOffer(offers, featuredOffersGeneratedMenuUUID),
        ],
      });
      await sendTestEvents({
        source: Events.MENU_THEMED_OFFER_DELETED,
        events: [buildTestSanityMenuThemedOffer(offers, flexibleGeneratedMenuUUID, flexibleGeneratedSubMenuUUID)],
      });
      await sendTestEvents({
        source: Events.MENU_THEMED_EVENT_DELETED,
        events: [
          buildTestSanityMenuThemedEvent(events, flexibleGeneratedEventMenuUUID, flexibleGeneratedEventSubMenuUUID),
        ],
      });
      await sendTestEvents({
        source: Events.OFFER_DELETED,
        events: [
          buildTestSanityOffer({
            id: generatedOfferUUID,
            companyId: generatedCompanyUUID,
          }),
          buildTestSanityOffer({
            id: ageRestrictedOfferUUID,
            companyId: ageRestrictedCompanyUUID,
          }),
          buildTestSanityOffer({
            id: trustRestrictedOfferUUID,
            companyId: trustRestrictedCompanyUUID,
          }),
          buildTestSanityOffer({
            id: expiredOfferUUID,
            companyId: expiredCompanyUUID,
          }),
        ],
      });
      await sendTestEvents({
        source: Events.EVENT_DELETED,
        events: [
          buildTestSanityEventOffer({ _id: generatedEventUUID }),
          buildTestSanityEventOffer({ _id: generatedExpiredEventUUID }),
          buildTestSanityEventOffer({ _id: generatedExcludedEventUUID }),
        ],
      });
      await sendTestEvents({
        source: Events.SITE_DELETED,
        events: [buildTestSanitySite(dealsOfTheWeekGeneratedMenuUUID, featuredOffersGeneratedMenuUUID)],
      });
    });

    it('should consume menu and offer events and return the single menu response with expired offers filtered out', async () => {
      const response = await whenMenuIsCalledWith(
        {
          id: 'marketplace',
          dob: '1990-01-01',
          organisation: 'DEN',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );

      const result = (await response.json()) as { data: MenuResponse };

      const expectedMarketplaceMenu = result.data.marketplace?.find(
        (menu) => menu.id === marketplaceSanityMenuOffer._id,
      );

      expect(expectedMarketplaceMenu?.title).toEqual(marketplaceSanityMenuOffer.title);
      expect(expectedMarketplaceMenu?.offers.length).toEqual(3);
      expect(expectedMarketplaceMenu?.offers).toEqual(
        expect.arrayContaining([
          buildExpectedOfferFrom(offers[0]),
          buildExpectedOfferFrom(offers[1]),
          buildExpectedOfferFrom(offers[2]),
        ]),
      );
    });

    it('should filter out expired offers from the menu response', async () => {
      const response = await whenMenuIsCalledWith(
        {
          id: 'marketplace',
          dob: '1990-01-01',
          organisation: 'DEN',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );

      const result = (await response.json()) as { data: MenuResponse };

      const expectedMarketplaceMenu = result.data.marketplace?.find(
        (menu) => menu.id === marketplaceSanityMenuOffer._id,
      );
      const expiredRestrictedOffer = expectedMarketplaceMenu?.offers.find(
        (offer) => offer.offerID === expiredOfferUUID,
      );

      expect(expectedMarketplaceMenu?.offers.length).toEqual(3);
      expect(expiredRestrictedOffer).toBeUndefined();
    });

    it('should filter out age gated offers from the menu response', async () => {
      const response = await whenMenuIsCalledWith(
        {
          id: 'marketplace',
          dob: subYears(new Date(), 20).toString(),
          organisation: 'DEN',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );

      const result = (await response.json()) as { data: MenuResponse };

      const expectedMarketplaceMenu = result.data.marketplace?.find(
        (menu) => menu.id === marketplaceSanityMenuOffer._id,
      );
      const ageRestrictedOffer = expectedMarketplaceMenu?.offers.find(
        (offer) => offer.offerID === ageRestrictedOfferUUID,
      );

      expect(expectedMarketplaceMenu?.offers.length).toEqual(2);
      expect(ageRestrictedOffer).toBeUndefined();
    });

    it('should filter out trust restricted offers from the menu response', async () => {
      const response = await whenMenuIsCalledWith(
        {
          id: 'marketplace',
          dob: '1990-01-01',
          organisation: 'POLICE',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );

      const result = (await response.json()) as { data: MenuResponse };

      const expectedMarketplaceMenu = result.data.marketplace?.find(
        (menu) => menu.id === marketplaceSanityMenuOffer._id,
      );
      const trustRestrictedOffer = expectedMarketplaceMenu?.offers.find(
        (offer) => offer.offerID === trustRestrictedOfferUUID,
      );

      expect(expectedMarketplaceMenu?.offers.length).toEqual(2);
      expect(trustRestrictedOffer).toBeUndefined();
    });

    it('should consume menu and offer events and return all menus in the response', async () => {
      const response = await whenMenuIsCalledWith(
        {
          dob: '1990-01-01',
          organisation: 'DEN',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );
      const result = (await response.json()) as { data: MenuResponse };

      expect(result.data).toEqual({
        dealsOfTheWeek: {
          id: dealsOfTheWeekGeneratedMenuUUID,
          offers: expect.arrayContaining([
            buildExpectedOfferFrom(offers[0]),
            buildExpectedOfferFrom(offers[1]),
            buildExpectedOfferFrom(offers[2]),
          ]),
        },
        featured: {
          id: featuredOffersGeneratedMenuUUID,
          offers: expect.arrayContaining([
            buildExpectedOfferFrom(offers[0]),
            buildExpectedOfferFrom(offers[1]),
            buildExpectedOfferFrom(offers[2]),
          ]),
        },
        flexible: expect.arrayContaining([
          {
            id: flexibleGeneratedEventMenuUUID,
            title: flexibleSanityThemedMenuEvent?.title,
            menus: [
              {
                id: flexibleGeneratedEventSubMenuUUID,
                title: flexibleSanityThemedMenuEvent?.inclusions?.[0]?.eventCollectionName,
                imageURL:
                  flexibleSanityThemedMenuEvent?.inclusions?.[0]?.eventCollectionImage?.default?.asset?.url ?? '',
              },
            ],
          },
          {
            id: flexibleGeneratedMenuUUID,
            title: flexibleSanityThemedMenuOffer?.title,
            menus: [
              {
                id: flexibleGeneratedSubMenuUUID,
                title: flexibleSanityThemedMenuOffer?.inclusions?.[0]?.collectionName,
                imageURL:
                  flexibleSanityThemedMenuOffer?.inclusions?.[0]?.offerCollectionImage?.default?.asset?.url ?? '',
              },
            ],
          },
        ]),
        marketplace: [
          {
            id: marketplaceSanityMenuOffer._id,
            title: menus[0].title,
            offers: expect.arrayContaining([
              buildExpectedOfferFrom(offers[0]),
              buildExpectedOfferFrom(offers[1]),
              buildExpectedOfferFrom(offers[2]),
            ]),
          },
        ],
      });
    });

    it('should return flexible menu data containing offers correctly', async () => {
      const response = await whenFlexibleMenuIsCalledWith(
        flexibleGeneratedSubMenuUUID,
        {
          dob: '1990-01-01',
          organisation: 'DEN',
        },
        {
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      );
      const result = (await response.json()) as { data: FlexibleMenuResponse };
      expect(result.data).toEqual({
        id: flexibleGeneratedSubMenuUUID,
        title: flexibleSanityThemedMenuOffer?.inclusions?.[0]?.collectionName,
        description: flexibleSanityThemedMenuOffer?.inclusions?.[0]?.collectionDescription,
        imageURL: flexibleSanityThemedMenuOffer?.inclusions?.[0]?.offerCollectionImage?.default?.asset?.url ?? '',
        events: [],
        offers: expect.arrayContaining([
          buildExpectedOfferFrom(offers[0]),
          buildExpectedOfferFrom(offers[1]),
          buildExpectedOfferFrom(offers[2]),
        ]),
      });
    });
    it('should return flexible menu data containing events correctly', async () => {
      const response = await whenFlexibleMenuIsCalledWith(
        flexibleGeneratedEventSubMenuUUID,
        {
          dob: '1990-01-01',
          organisation: 'DEN',
        },
        {
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      );
      const result = (await response.json()) as { data: FlexibleMenuResponse };
      expect(result.data).toEqual({
        id: flexibleGeneratedEventSubMenuUUID,
        title: flexibleSanityThemedMenuEvent?.inclusions?.[0]?.eventCollectionName,
        description: 'This is a heading↵ This is a paragraph.',
        imageURL: flexibleSanityThemedMenuEvent?.inclusions?.[0]?.eventCollectionImage?.default?.asset?.url ?? '',
        events: [
          {
            eventID: events[0]._id,
            venueID: events[0].venue?._id,
            venueName: events[0].venue?.name,
            imageURL: events[0].image?.default?.asset?.url,
            eventDescription: 'This is a heading↵ This is a paragraph.',
            eventName: events[0].name,
            offerType: EventType.TICKET,
          },
        ],
        offers: [],
      });
    });

    it('should return flexible menu data filtering out expired events', async () => {
      const response = await whenFlexibleMenuIsCalledWith(
        flexibleGeneratedEventSubMenuUUID,
        {
          dob: '1990-01-01',
          organisation: 'DEN',
        },
        {
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      );
      const result = (await response.json()) as { data: FlexibleMenuResponse };

      const expiredEvents = result.data.events.find((event) => event.eventID === generatedExpiredEventUUID);

      expect(expiredEvents).toBeUndefined();
    });

    it('should return flexible menu data filtering out excluded events', async () => {
      const response = await whenFlexibleMenuIsCalledWith(
        flexibleGeneratedEventSubMenuUUID,
        {
          dob: '1990-01-01',
          organisation: 'DEN',
        },
        {
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      );
      const result = (await response.json()) as { data: FlexibleMenuResponse };

      const excludedEvents = result.data.events.find((event) => event.eventID === generatedExcludedEventUUID);

      expect(excludedEvents).toBeUndefined();
    });

    it('should return flexible menu data filtering out events with closed guestlists', async () => {
      const response = await whenFlexibleMenuIsCalledWith(
        flexibleGeneratedEventSubMenuUUID,
        {
          dob: '1990-01-01',
          organisation: 'DEN',
        },
        {
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      );
      const result = (await response.json()) as { data: FlexibleMenuResponse };

      const excludedEvents = result.data.events.find((event) => event.eventID === generatedClosedGuestlistEventUUID);

      expect(excludedEvents).toBeUndefined();
    });
  });
});

const buildExpectedOfferFrom = (offer: SanityOffer) => {
  return {
    companyID: offer.company?._id,
    legacyCompanyID: offer.company?.companyId,
    companyName: offer.company?.brandCompanyDetails?.[0]?.companyName,
    imageURL: offer.image?.default?.asset?.url,
    offerDescription: offer?.offerDescription?.content ? getBlockText(offer.offerDescription.content) : '',
    offerID: offer._id,
    legacyOfferID: offer.offerId,
    offerName: offer.name,
    offerType: offer.offerType?.offerType,
  };
};
