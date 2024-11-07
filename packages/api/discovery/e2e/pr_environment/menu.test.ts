import { randomUUID } from 'node:crypto';

import { MenuOffer as SanityMenuOffer, Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { ApiGatewayV1Api } from 'sst/node/api';

import { MenuResponse } from '@blc-mono/discovery/application/models/MenuResponse';
import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';
import { buildTestSanityMenuOffer } from '@blc-mono/discovery/testScripts/helpers/buildTestSanityMenuOffer';
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

const generatedOfferUUID = `test-${randomUUID().toString()}`;
const generatedCompanyUUID = `test-company-${randomUUID().toString()}`;
const marketplaceGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const dealsOfTheWeekGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const featuredOffersGeneratedMenuUUID = `test-${randomUUID().toString()}`;
const offers: SanityOffer[] = [buildTestSanityOffer(generatedOfferUUID, generatedCompanyUUID)];
const marketplaceSanityMenuOffer = buildTestSanityMenuOffer(offers, marketplaceGeneratedMenuUUID);
const dealsOfTheWeekSanityMenuOffer = buildTestSanityMenuOffer(offers, dealsOfTheWeekGeneratedMenuUUID);
const featuredOffersSanityMenuOffer = buildTestSanityMenuOffer(offers, featuredOffersGeneratedMenuUUID);
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await sendTestEvents({ source: Events.OFFER_CREATED, events: offers });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await sendTestEvents({ source: Events.MENU_OFFER_CREATED, events: menus });
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await sendTestEvents({
        source: Events.OFFER_DELETED,
        events: [buildTestSanityOffer(generatedOfferUUID, generatedCompanyUUID)],
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
            offerName: offers[0].name,
            offerDescription: offers[0]?.offerDescription?.content
              ? getBlockText(offers[0].offerDescription.content)
              : '',
            offerType: offers[0].offerType?.offerType,
            imageURL: offers[0].image?.default?.asset?.url,
            companyID: offers[0].company?._id,
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
              companyName: offers[0].company?.brandCompanyDetails?.[0]?.companyName,
              imageURL: offers[0].image?.default?.asset?.url,
              offerDescription: offers[0]?.offerDescription?.content
                ? getBlockText(offers[0].offerDescription.content)
                : '',
              offerID: offers[0]._id,
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
              companyName: offers[0].company?.brandCompanyDetails?.[0]?.companyName,
              imageURL: offers[0].image?.default?.asset?.url,
              offerDescription: offers[0]?.offerDescription?.content
                ? getBlockText(offers[0].offerDescription.content)
                : '',
              offerID: offers[0]._id,
              offerName: offers[0].name,
              offerType: offers[0].offerType?.offerType,
            },
          ],
        },
        flexible: [],
        marketplace: [
          {
            id: marketplaceSanityMenuOffer._id,
            title: menus[0].title,
            offers: [
              {
                offerID: offers[0]._id,
                offerName: offers[0].name,
                offerDescription: offers[0]?.offerDescription?.content
                  ? getBlockText(offers[0].offerDescription.content)
                  : '',
                offerType: offers[0].offerType?.offerType,
                imageURL: offers[0].image?.default?.asset?.url,
                companyID: offers[0].company?._id,
                companyName: offers[0].company?.brandCompanyDetails?.[0]?.companyName,
              },
            ],
          },
        ],
      });
    });
  });
});
