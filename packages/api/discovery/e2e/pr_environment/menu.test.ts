import { randomUUID } from 'node:crypto';

import { MenuOffer as SanityMenuOffer, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { ApiGatewayV1Api } from 'sst/node/api';

import { FlexibleMenuResponse } from '@blc-mono/discovery/application/models/FlexibleMenuResponse';
import { MenuResponse } from '@blc-mono/discovery/application/models/MenuResponse';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityCompany } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityCompany';
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

const whenFlexibleMenuIsCalledWith = async (flexibleId: string, headers: Record<string, string>) => {
  const menuEndpoint = getMenuEndpoint();
  const flexibleMenuEndpoint = `${menuEndpoint}/flexible/${flexibleId}`;

  return fetch(flexibleMenuEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

const generatedOfferUUID = `test-${randomUUID().toString()}`;
const generatedCompanyUUID = `test-company-${randomUUID().toString()}`;
const marketplaceGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const dealsOfTheWeekGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const featuredOffersGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const flexibleGeneratedSubMenuUUID = `test-${randomUUID().toString()}`;
const flexibleGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const testCompany = buildTestSanityCompany({ _id: generatedCompanyUUID });
const offers: SanityOffer[] = [buildTestSanityOffer({ _id: generatedOfferUUID, company: testCompany })];
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
      await sendTestEvents({ source: Events.OFFER_CREATED, events: offers });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await sendTestEvents({ source: Events.MENU_OFFER_CREATED, events: menus });
      await sendTestEvents({ source: Events.MENU_THEMED_OFFER_CREATED, events: [flexibleSanityThemedMenuOffer] });
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
            _id: generatedOfferUUID,
            company: buildTestSanityCompany({ _id: generatedCompanyUUID }),
          }),
        ],
      });
      await sendTestEvents({
        source: Events.SITE_DELETED,
        events: [buildTestSanitySite(dealsOfTheWeekGeneratedMenuUUID, featuredOffersGeneratedMenuUUID)],
      });
    });

    it('should consume menu and offer events and return the single menu response', async () => {
      const response = await whenMenuIsCalledWith(
        { id: 'marketplace' },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      );

      const result = (await response.json()) as { data: MenuResponse };

      const expectedMarketplaceMenu = result.data.marketplace?.find(
        (menu) => menu.id === marketplaceSanityMenuOffer._id,
      );

      expect(expectedMarketplaceMenu).toEqual({
        id: marketplaceSanityMenuOffer._id,
        title: menus[0].title,
        offers: [
          {
            offerID: offers[0]._id,
            legacyOfferID: offers[0].offerId,
            offerName: offers[0].name,
            offerDescription: offers[0]?.offerDescription?.content
              ? getBlockText(offers[0].offerDescription.content)
              : '',
            offerType: offers[0].offerType?.offerType,
            imageURL: offers[0].image?.default?.asset?.url,
            companyID: offers[0].company?._id,
            legacyCompanyID: offers[0].company?.companyId,
            companyName: offers[0].company?.brandCompanyDetails?.[0]?.companyName,
          },
        ],
      });
    });

    it('should consume menu and offer events and return all menus in the response', async () => {
      const response = await whenMenuIsCalledWith({}, { Authorization: `Bearer ${testUserTokens.idToken}` });
      const result = (await response.json()) as { data: MenuResponse };

      expect(result.data).toEqual({
        dealsOfTheWeek: {
          id: dealsOfTheWeekGeneratedMenuUUID,
          offers: [
            {
              companyID: offers[0].company?._id,
              legacyCompanyID: offers[0].company?.companyId,
              companyName: offers[0].company?.brandCompanyDetails?.[0]?.companyName,
              imageURL: offers[0].image?.default?.asset?.url,
              offerDescription: offers[0]?.offerDescription?.content
                ? getBlockText(offers[0].offerDescription.content)
                : '',
              offerID: offers[0]._id,
              legacyOfferID: offers[0].offerId,
              offerName: offers[0].name,
              offerType: offers[0].offerType?.offerType,
            },
          ],
        },
        featured: {
          id: featuredOffersGeneratedMenuUUID,
          offers: [
            {
              companyID: offers[0].company?._id,
              legacyCompanyID: offers[0].company?.companyId,
              companyName: offers[0].company?.brandCompanyDetails?.[0]?.companyName,
              imageURL: offers[0].image?.default?.asset?.url,
              offerDescription: offers[0]?.offerDescription?.content
                ? getBlockText(offers[0].offerDescription.content)
                : '',
              offerID: offers[0]._id,
              legacyOfferID: offers[0].offerId,
              offerName: offers[0].name,
              offerType: offers[0].offerType?.offerType,
            },
          ],
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
            offers: [
              {
                offerID: offers[0]._id,
                legacyOfferID: offers[0].offerId,
                offerName: offers[0].name,
                offerDescription: offers[0]?.offerDescription?.content
                  ? getBlockText(offers[0].offerDescription.content)
                  : '',
                offerType: offers[0].offerType?.offerType,
                imageURL: offers[0].image?.default?.asset?.url,
                companyID: offers[0].company?._id,
                legacyCompanyID: offers[0].company?.companyId,
                companyName: offers[0].company?.brandCompanyDetails?.[0]?.companyName,
              },
            ],
          },
        ],
      });
    });

    it('should return flexible menu data correctly', async () => {
      const response = await whenFlexibleMenuIsCalledWith(flexibleGeneratedSubMenuUUID, {
        Authorization: `Bearer ${testUserTokens.idToken}`,
      });
      const result = (await response.json()) as { data: FlexibleMenuResponse };
      expect(result.data).toEqual({
        id: flexibleGeneratedSubMenuUUID,
        title: flexibleSanityThemedMenuOffer?.inclusions?.[0]?.collectionName,
        description: flexibleSanityThemedMenuOffer?.inclusions?.[0]?.collectionDescription,
        imageURL: flexibleSanityThemedMenuOffer?.inclusions?.[0]?.offerCollectionImage?.default?.asset?.url ?? '',
        offers: [
          {
            companyID: offers[0].company?._id,
            legacyCompanyID: offers[0].company?.companyId,
            companyName: offers[0].company?.brandCompanyDetails?.[0]?.companyName,
            imageURL: offers[0].image?.default?.asset?.url,
            offerDescription: offers[0]?.offerDescription?.content
              ? getBlockText(offers[0].offerDescription.content)
              : '',
            offerID: offers[0]._id,
            legacyOfferID: offers[0].offerId,
            offerName: offers[0].name,
            offerType: offers[0].offerType?.offerType,
          },
        ],
      });
    });
  });
});
