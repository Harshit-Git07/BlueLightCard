import { randomUUID } from 'node:crypto';

import { Event as SanityEvent, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { addMonths, subDays, subMonths } from 'date-fns';
import { ApiGatewayV1Api } from 'sst/node/api';

import { FlexibleMenuResponse } from '@blc-mono/discovery/application/models/FlexibleMenuResponse';
import { MenuResponse } from '@blc-mono/discovery/application/models/MenuResponse';
import { EventType } from '@blc-mono/discovery/application/models/Offer';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityEventOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityEventOffer';
import { buildTestSanityMarketplace } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMarketplace';
import {
  buildTestSanityDOTWMenuOffer,
  buildTestSanityFeaturedMenuOffer,
  buildTestSanityMenuOffer,
} from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMenuOffer';
import { buildTestSanityMenuThemedEvent } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMenuThemedEvent';
import {
  buildTestSanityMenuThemedOffer,
  buildTestSanityWaysToSaveMenu,
} from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMenuThemedOffer';
import { buildTestSanityOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityOffer';
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
      'x-client-type': 'web',
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
      'x-client-type': 'web',
      ...headers,
    },
  });
};

const generatedOfferUUID = `test-offer-${randomUUID().toString()}`;
const generatedEventUUID = `test-event-${randomUUID().toString()}`;
const generatedExpiredEventUUID = `test-expired-event-${randomUUID().toString()}`;
const generatedExcludedEventUUID = `test-exclusive-event${randomUUID().toString()}`;
const generatedClosedGuestlistEventUUID = `test-closed-guest-${randomUUID().toString()}`;
const generatedCompanyUUID = `test-company-${randomUUID().toString()}`;
const ageRestrictedOfferUUID = `test-age-restrict-${randomUUID().toString()}`;
const ageRestrictedCompanyUUID = `test-company-age-restrict-${randomUUID().toString()}`;
const trustRestrictedOfferUUID = `test-trust-restrict${randomUUID().toString()}`;
const trustRestrictedCompanyUUID = `test-company-trust-restrict${randomUUID().toString()}`;
const expiredOfferUUID = `test-expired-${randomUUID().toString()}`;
const expiredCompanyUUID = `test-company-expired-${randomUUID().toString()}`;
const inScheduleMarketplaceUUID = `test-mp-in-sched-${randomUUID().toString()}`;
const inScheduleMarketplace2UUID = `test-mp-in-sched-2-${randomUUID().toString()}`;
const futureScheduleMarketplaceUUID = `test-mp-fut-${randomUUID().toString()}`;
const previousScheduleMarketplaceUUID = `test-mp-prev-${randomUUID().toString()}`;
const previousScheduleOfferUUID = `test-off-prev${randomUUID().toString()}`;
const futureScheduleOfferUUID = `test-off-fut${randomUUID().toString()}`;
const inScheduleOfferUUID = `test-off-in-sched-${randomUUID().toString()}`;
const generatedOfferUUID2 = `test-${randomUUID().toString()}`;
const menuOfferWithOverridesUUID = `test-menu-off-override-${randomUUID().toString()}`;
const dealsOfTheWeekGeneratedMenuUUID = `test-dotw-${randomUUID().toString()}`;
const featuredOffersGeneratedMenuUUID = `test-feat-${randomUUID().toString()}`;
const flexibleGeneratedSubMenuUUID = `test-flexi-sub-${randomUUID().toString()}`;
const flexibleGeneratedMenuUUID = `test-flexi-menu-${randomUUID().toString()}`;
const waysToSaveGeneratedMenuUUID = `test-wts-menu-${randomUUID().toString()}`;
const waysToSaveGenereratedSubMenuUUID = `test-wts-menu-${randomUUID().toString()}`;
const flexibleGeneratedEventSubMenuUUID = `test-flexi-sub-event-${randomUUID().toString()}`;
const flexibleGeneratedEventMenuUUID = `test-flexi-menu-event-${randomUUID().toString()}`;

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

const previousScheduledOffer = buildTestSanityOffer({ id: previousScheduleOfferUUID, companyId: generatedCompanyUUID });
const inScheduledOffer = buildTestSanityOffer({ id: inScheduleOfferUUID, companyId: generatedCompanyUUID });
const futureScheduledOffer = buildTestSanityOffer({ id: futureScheduleOfferUUID, companyId: generatedCompanyUUID });

const offers = [
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

const offerUUID2 = buildTestSanityOffer({
  id: generatedOfferUUID2,
  companyId: generatedCompanyUUID,
});

const menuOfferWithOverrides = {
  offer: offerUUID2,
  _key: menuOfferWithOverridesUUID,
  overrides: {
    title: 'Test Override',
    description: 'Test Description Override',
    image: {
      default: {
        asset: {
          url: 'https://test-override.com',
        },
      },
    },
  },
};

const menuOffers = offers.map((offer) => ({ offer, _key: offer._id }));

const scheduledMenuOffers = [
  {
    offer: previousScheduledOffer,
    _key: previousScheduleOfferUUID,
    start: subMonths(new Date(), 2).toISOString(),
    end: subMonths(new Date(), 1).toISOString(),
  },
  {
    offer: inScheduledOffer,
    _key: inScheduleOfferUUID,
    start: subMonths(new Date(), 1).toISOString(),
    end: addMonths(new Date(), 1).toISOString(),
  },
  {
    offer: futureScheduledOffer,
    _key: futureScheduleOfferUUID,
    start: addMonths(new Date(), 1).toISOString(),
    end: addMonths(new Date(), 2).toISOString(),
  },
];

const marketplaceMenus = [
  buildTestSanityMenuOffer(
    scheduledMenuOffers,
    inScheduleMarketplaceUUID,
    subMonths(new Date(), 1).toISOString(),
    addMonths(new Date(), 1).toISOString(),
  ),
  buildTestSanityMenuOffer(
    [
      {
        offer: inScheduledOffer,
        _key: inScheduleOfferUUID,
        start: subMonths(new Date(), 1).toISOString(),
        end: addMonths(new Date(), 1).toISOString(),
      },
      ...menuOffers,
      menuOfferWithOverrides,
    ],
    inScheduleMarketplace2UUID,
    subMonths(new Date(), 1).toISOString(),
    addMonths(new Date(), 1).toISOString(),
  ),
  buildTestSanityMenuOffer(
    scheduledMenuOffers,
    futureScheduleMarketplaceUUID,
    addMonths(new Date(), 1).toISOString(),
    addMonths(new Date(), 2).toISOString(),
  ),
  buildTestSanityMenuOffer(
    scheduledMenuOffers,
    previousScheduleMarketplaceUUID,
    subMonths(new Date(), 2).toISOString(),
    subMonths(new Date(), 1).toISOString(),
  ),
];

const dealsOfTheWeekSanityMenuOffer = buildTestSanityDOTWMenuOffer(menuOffers, dealsOfTheWeekGeneratedMenuUUID);
const featuredOffersSanityMenuOffer = buildTestSanityFeaturedMenuOffer(menuOffers, featuredOffersGeneratedMenuUUID);
const flexibleSanityThemedMenuOffer = buildTestSanityMenuThemedOffer(
  offers,
  flexibleGeneratedMenuUUID,
  flexibleGeneratedSubMenuUUID,
);

const waysToSaveSanityThemedMenuOffer = buildTestSanityWaysToSaveMenu(
  offers,
  waysToSaveGeneratedMenuUUID,
  waysToSaveGenereratedSubMenuUUID,
);

const flexibleSanityThemedMenuEvent = buildTestSanityMenuThemedEvent(
  events,
  flexibleGeneratedEventMenuUUID,
  flexibleGeneratedEventSubMenuUUID,
);

const marketplaceSanityEvent = buildTestSanityMarketplace(marketplaceMenus);

describe('Menu', async () => {
  describe('Menu E2E Event Handling', async () => {
    const testUserTokens = await TestUser.authenticate();

    beforeAll(async () => {
      await sendTestEvents({
        source: Events.OFFER_CREATED,
        events: [...offers, previousScheduledOffer, inScheduledOffer, futureScheduledOffer, offerUUID2],
      });
      await sendTestEvents({ source: Events.EVENT_CREATED, events });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await sendTestEvents({
        source: Events.MARKETPLACE_MENUS_CREATED,
        events: [marketplaceSanityEvent],
      });

      await sendTestEvents({
        source: Events.DEALS_OF_THE_WEEK_CREATED,
        events: [dealsOfTheWeekSanityMenuOffer],
      });

      await sendTestEvents({
        source: Events.FEATURED_CREATED,
        events: [featuredOffersSanityMenuOffer],
      });

      await sendTestEvents({
        source: Events.WAYS_TO_SAVE_CREATED,
        events: [waysToSaveSanityThemedMenuOffer],
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
        source: Events.MARKETPLACE_MENUS_DELETED,
        events: [buildTestSanityMarketplace(marketplaceMenus)],
      });
      await sendTestEvents({
        source: Events.DEALS_OF_THE_WEEK_DELETED,
        events: [buildTestSanityDOTWMenuOffer(menuOffers, dealsOfTheWeekGeneratedMenuUUID)],
      });
      await sendTestEvents({
        source: Events.FEATURED_DELETED,
        events: [buildTestSanityFeaturedMenuOffer(menuOffers, featuredOffersGeneratedMenuUUID)],
      });
      await sendTestEvents({
        source: Events.MENU_THEMED_OFFER_DELETED,
        events: [buildTestSanityMenuThemedOffer(offers, flexibleGeneratedMenuUUID, flexibleGeneratedSubMenuUUID)],
      });
      await sendTestEvents({
        source: Events.WAYS_TO_SAVE_DELETED,
        events: [buildTestSanityWaysToSaveMenu(offers, waysToSaveGeneratedMenuUUID, waysToSaveGenereratedSubMenuUUID)],
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
          buildTestSanityOffer({ id: previousScheduleOfferUUID, companyId: generatedCompanyUUID }),
          buildTestSanityOffer({ id: inScheduleOfferUUID, companyId: generatedCompanyUUID }),
          buildTestSanityOffer({ id: futureScheduleOfferUUID, companyId: generatedCompanyUUID }),
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
    });

    it('should consume menu and offer events from the correct events and return the single menu response with expired offers filtered out, in the correct order and with any overrides', async () => {
      const response = await whenMenuIsCalledWith(
        {
          id: 'marketplace',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );

      const result = (await response.json()) as { data: MenuResponse };

      expect(result.data.marketplace?.find((menu) => menu.id === futureScheduleMarketplaceUUID)).not.toBeDefined();
      expect(result.data.marketplace?.find((menu) => menu.id === previousScheduleMarketplaceUUID)).not.toBeDefined();
      expect(result.data.marketplace?.[0].id).toEqual(inScheduleMarketplaceUUID);
      expect(result.data.marketplace?.[1].id).toEqual(inScheduleMarketplace2UUID);
      expect(result.data.marketplace?.[1].offers[4].companyName).toStrictEqual('Test Override');
      expect(result.data.marketplace?.[1].offers[4].offerName).toStrictEqual('Test Description Override');
      expect(result.data.marketplace?.[1].offers[4].imageURL).toStrictEqual('https://test-override.com');
    });

    it('should filter out expired offers from the menu response and return in the correct order', async () => {
      const response = await whenMenuIsCalledWith(
        {
          id: 'marketplace',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );

      const result = (await response.json()) as { data: MenuResponse };

      const expectedMarketplaceMenu = result.data.marketplace?.find((menu) => menu.id === inScheduleMarketplace2UUID);
      const expiredRestrictedOffer = expectedMarketplaceMenu?.offers.find(
        (offer) => offer.offerID === expiredOfferUUID,
      );

      expect(expectedMarketplaceMenu?.offers.length).toEqual(5);
      expect(expectedMarketplaceMenu?.id).toEqual(result.data.marketplace?.[1].id);
      expect(expectedMarketplaceMenu?.offers[0].offerID).toEqual(inScheduleOfferUUID);
      expect(expiredRestrictedOffer).toBeUndefined();
    });

    it('should consume menu and offer events and return all menus in the response', async () => {
      const response = await whenMenuIsCalledWith({}, { Authorization: `Bearer ${testUserTokens.idToken}` });
      const result = (await response.json()) as { data: MenuResponse };

      expect(result.data.flexible?.offers?.find((menu) => menu.id === flexibleGeneratedMenuUUID)).toBeFalsy();

      expect(result.data).toEqual({
        dealsOfTheWeek: {
          id: dealsOfTheWeekGeneratedMenuUUID,
          offers: [
            buildExpectedOfferFrom(offers[0]),
            buildExpectedOfferFrom(offers[1]),
            buildExpectedOfferFrom(offers[2]),
          ],
        },
        featured: {
          id: featuredOffersGeneratedMenuUUID,
          offers: [
            buildExpectedOfferFrom(offers[0]),
            buildExpectedOfferFrom(offers[1]),
            buildExpectedOfferFrom(offers[2]),
          ],
        },
        flexible: {
          events: [
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
          ],
          offers: [
            {
              id: waysToSaveGeneratedMenuUUID,
              title: waysToSaveSanityThemedMenuOffer?.title,
              menus: [
                {
                  id: waysToSaveGenereratedSubMenuUUID,
                  title: waysToSaveSanityThemedMenuOffer?.inclusions?.[0]?.collectionName,
                  imageURL:
                    waysToSaveSanityThemedMenuOffer?.inclusions?.[0]?.offerCollectionImage?.default?.asset?.url ?? '',
                },
              ],
            },
          ],
        },
        marketplace: [
          {
            id: marketplaceMenus[0]._id,
            title: marketplaceMenus[0].title,
            offers: [buildExpectedOfferFrom(scheduledMenuOffers[1].offer)],
          },
          {
            id: marketplaceMenus[1]._id,
            title: marketplaceMenus[1].title,
            offers: [
              buildExpectedOfferFrom(scheduledMenuOffers[1].offer),
              buildExpectedOfferFrom(offers[0]),
              buildExpectedOfferFrom(offers[1]),
              buildExpectedOfferFrom(offers[2]),
              buildExpectedOfferFrom(offerUUID2, {
                title: menuOfferWithOverrides.overrides.title,
                description: menuOfferWithOverrides.overrides.description,
                image: menuOfferWithOverrides.overrides.image.default.asset.url,
              }),
            ],
          },
        ],
      });
    });

    it('should return flexible menu data containing offers correctly', async () => {
      const response = await whenFlexibleMenuIsCalledWith(
        flexibleGeneratedSubMenuUUID,
        {},
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

    it('should return ways to save menu data containing offers correctly', async () => {
      const response = await whenFlexibleMenuIsCalledWith(
        waysToSaveGenereratedSubMenuUUID,
        {},
        {
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      );
      const result = (await response.json()) as { data: FlexibleMenuResponse };
      expect(result.data).toEqual({
        id: waysToSaveGenereratedSubMenuUUID,
        title: waysToSaveSanityThemedMenuOffer?.inclusions?.[0]?.collectionName,
        description: waysToSaveSanityThemedMenuOffer?.inclusions?.[0]?.collectionDescription,
        imageURL: waysToSaveSanityThemedMenuOffer?.inclusions?.[0]?.offerCollectionImage?.default?.asset?.url ?? '',
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
        {},
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
        {},
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
        {},
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
        {},
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

const buildExpectedOfferFrom = (
  offer: SanityOffer,
  overrides?: { title?: string; description?: string; image?: string },
) => {
  const offerDescription = () => {
    if (overrides?.description) {
      return overrides.description;
    }
    return offer?.offerDescription?.content ? getBlockText(offer.offerDescription.content) : '';
  };
  return {
    companyID: offer.company?._id,
    legacyCompanyID: offer.company?.companyId,
    companyName: offer.company?.brandCompanyDetails?.[0]?.companyName,
    imageURL: overrides?.image ?? offer.image?.default?.asset?.url,
    offerDescription: offerDescription(),
    offerID: offer._id,
    legacyOfferID: offer.offerId,
    offerName: overrides?.title ?? offer.name,
    offerType: offer.offerType?.offerType,
  };
};
