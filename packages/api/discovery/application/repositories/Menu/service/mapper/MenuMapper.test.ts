import { menuEntityFactory } from '@blc-mono/discovery/application/factories/MenuEntityFactory';
import { menuFactory } from '@blc-mono/discovery/application/factories/MenuFactory';
import { offerEntityFactory } from '@blc-mono/discovery/application/factories/OfferEntityFactory';
import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { Menu } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { MenuEntity } from '@blc-mono/discovery/application/repositories/schemas/MenuEntity';

import {
  mapMenuAndOfferToSingletonMenuResponse,
  mapMenuEntityToMenu,
  mapMenuEntityWithOfferEntitiesToMenuWithOffers,
  mapMenusAndOffersToMenuResponse,
  mapMenuToMenuEntity,
  mapMenuWithOffersToFlexibleMenuResponse,
  mapMenuWithOffersToMarketplaceMenuResponses,
} from './MenuMapper';
import { mapOfferToMenuOfferResponse } from './MenuOfferMapper';

const menu: Menu = menuFactory.build();

const menuEntity: MenuEntity = menuEntityFactory.build();

const offer = offerFactory.build();

const offerEntity = offerEntityFactory.build();

describe('MenuMapper', () => {
  describe('mapMenuEntityToMenu', () => {
    it('should map MenuEntity to Menu', () => {
      const result = mapMenuEntityToMenu(menuEntity);
      expect(result).toEqual(menu);
    });
  });

  describe('mapMenuToMenuEntity', () => {
    it('should map Menu to MenuEntity', () => {
      const result = mapMenuToMenuEntity(menu);
      expect(result).toEqual(menuEntity);
    });
  });

  describe('mapMenuEntityWithOfferEntitiesToMenuWithOffers', () => {
    it('should mapMenuEntityWithOfferEntitiesToMenuWithOffers', () => {
      const result = mapMenuEntityWithOfferEntitiesToMenuWithOffers({ ...menuEntity, offers: [offerEntity] });
      expect(result).toEqual({
        ...menu,
        offers: [offer],
      });
    });
  });

  describe('mapMenuAndOfferToSingletonMenuResponse', () => {
    it('should map menuAndOfferToSingletonMenuResponse', () => {
      const result = mapMenuAndOfferToSingletonMenuResponse([{ ...menu, offers: [offer] }]);
      expect(result).toEqual({
        id: menu.id,
        offers: [mapOfferToMenuOfferResponse(offer)],
      });
    });

    it('should return an empty array of offers if the length of the array is 0', () => {
      const result = mapMenuAndOfferToSingletonMenuResponse([]);
      expect(result).toEqual(undefined);
    });

    it('should throw an error if the length of the array is not greater than 1', () => {
      expect(() =>
        mapMenuAndOfferToSingletonMenuResponse([
          { ...menu, offers: [offer] },
          { ...menu, offers: [offer] },
        ]),
      ).toThrow('Expected exactly one or less menu and offer');
    });
  });

  describe('mapMenuWithOffersToMarketplaceMenuResponse', () => {
    it('should map menuWithOffersToMarketplaceMenuResponses', () => {
      const result = mapMenuWithOffersToMarketplaceMenuResponses([{ ...menu, offers: [offer] }]);
      expect(result).toEqual([
        {
          id: menu.id,
          title: menu.name,
          offers: [mapOfferToMenuOfferResponse(offer)],
        },
      ]);
    });
  });

  describe('mapMenuWithOffersToFlexibleMenuResponse', () => {
    it('should map menuWithOffersToFlexibleMenuResponse', () => {
      const result = mapMenuWithOffersToFlexibleMenuResponse([{ ...menu, offers: [offer] }]);
      expect(result).toEqual([
        {
          id: menu.id,
          title: menu.name,
          imageURL: '',
        },
      ]);
    });
  });

  describe('menusAndOffersToMenuResponse', () => {
    const testCases = [
      {
        menuType: MenuType.MARKETPLACE,
        expected: {
          [MenuType.MARKETPLACE]: mapMenuWithOffersToMarketplaceMenuResponses([{ ...menu, offers: [offer] }]),
          [MenuType.DEALS_OF_THE_WEEK]: undefined,
          [MenuType.FEATURED]: undefined,
          [MenuType.FLEXIBLE]: undefined,
        },
      },
      {
        menuType: MenuType.DEALS_OF_THE_WEEK,
        expected: {
          [MenuType.MARKETPLACE]: undefined,
          [MenuType.DEALS_OF_THE_WEEK]: mapMenuAndOfferToSingletonMenuResponse([
            { ...menu, menuType: MenuType.DEALS_OF_THE_WEEK, offers: [offer] },
          ]),
          [MenuType.FEATURED]: undefined,
          [MenuType.FLEXIBLE]: undefined,
        },
      },
      {
        menuType: MenuType.FEATURED,
        expected: {
          [MenuType.MARKETPLACE]: undefined,
          [MenuType.DEALS_OF_THE_WEEK]: undefined,
          [MenuType.FEATURED]: mapMenuAndOfferToSingletonMenuResponse([
            { ...menu, menuType: MenuType.FEATURED, offers: [offer] },
          ]),
          [MenuType.FLEXIBLE]: undefined,
        },
      },
      {
        menuType: MenuType.FLEXIBLE,
        expected: {
          [MenuType.MARKETPLACE]: undefined,
          [MenuType.DEALS_OF_THE_WEEK]: undefined,
          [MenuType.FEATURED]: undefined,
          [MenuType.FLEXIBLE]: mapMenuWithOffersToFlexibleMenuResponse([
            { ...menu, menuType: MenuType.FLEXIBLE, offers: [offer] },
          ]),
        },
      },
    ];
    it.each(testCases)('should map %s menusAndOffersToMenuResponse', ({ menuType, expected }) => {
      const result = mapMenusAndOffersToMenuResponse({ [menuType]: [{ ...menu, menuType, offers: [offer] }] });
      expect(result).toEqual(expected);
    });
  });
});
