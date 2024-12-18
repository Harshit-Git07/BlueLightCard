import { randomUUID } from 'node:crypto';

import { MenuOffer as SanityMenuOffer, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { subYears } from 'date-fns';
import { ApiGatewayV1Api } from 'sst/node/api';

import { FlexibleMenuResponse } from '@blc-mono/discovery/application/models/FlexibleMenuResponse';
import { MenuResponse } from '@blc-mono/discovery/application/models/MenuResponse';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityMenuOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMenuOffer';
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await sendTestEvents({
        source: Events.MENU_OFFER_CREATED,
        events: menus,
      });
      await sendTestEvents({
        source: Events.MENU_THEMED_OFFER_CREATED,
        events: [flexibleSanityThemedMenuOffer],
      });
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
        source: Events.OFFER_DELETED,
        events: [
          buildTestSanityOffer({
            id: generatedOfferUUID,
            companyId: generatedCompanyUUID,
          }),
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
        flexible: [
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
        ],
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

    it('should return flexible menu data correctly', async () => {
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
        offers: expect.arrayContaining([
          buildExpectedOfferFrom(offers[0]),
          buildExpectedOfferFrom(offers[1]),
          buildExpectedOfferFrom(offers[2]),
        ]),
      });
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
