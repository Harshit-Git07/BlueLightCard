import { menuEntityFactory } from '@blc-mono/discovery/application/factories/MenuEntityFactory';
import { menuFactory } from '@blc-mono/discovery/application/factories/MenuFactory';
import { menuOfferFactory } from '@blc-mono/discovery/application/factories/MenuOfferFactory';
import { subMenuFactory } from '@blc-mono/discovery/application/factories/SubMenuFactory';
import { Menu } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { MenuEntity } from '@blc-mono/discovery/application/repositories/schemas/MenuEntity';

import {
  mapMenuAndOfferToSingletonMenuResponse,
  mapMenuEntityToMenu,
  mapMenuEntityWithOfferEntitiesToMenuWithOffers,
  mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus,
  mapMenusAndOffersToMenuResponse,
  mapMenuToMenuEntity,
  mapMenuWithOffersToMarketplaceMenuResponses,
  mapMenuWithSubMenusToFlexibleMenuResponse,
} from './MenuMapper';
import { mapMenuOfferToMenuOfferEntity, mapMenuOfferToMenuOfferResponse } from './MenuOfferMapper';
import { mapSubMenuToSubMenuEntity } from './SubMenuMapper';

const menu: Menu = menuFactory.build();

const menuEntity: MenuEntity = menuEntityFactory.build();

const offer = menuOfferFactory.build();

const offerEntity = mapMenuOfferToMenuOfferEntity(offer, menu.id, menu.menuType);

const subMenu = subMenuFactory.build();

const subMenuEntity = mapSubMenuToSubMenuEntity(menu.id, subMenu);

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

  describe('mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus', () => {
    it('should map MenuEntityWithSubMenuEntities to MenuWithSubMenus', () => {
      const result = mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus({ ...menuEntity, subMenus: [subMenuEntity] });
      expect(result).toEqual({
        ...menu,
        subMenus: [subMenu],
      });
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
        offers: [mapMenuOfferToMenuOfferResponse(offer)],
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
          offers: [mapMenuOfferToMenuOfferResponse(offer)],
        },
      ]);
    });
  });

  describe('mapMenuWithSubMenusToFlexibleMenuResponse', () => {
    it('should map menuWithOffersToFlexibleMenuResponse', () => {
      const result = mapMenuWithSubMenusToFlexibleMenuResponse([{ ...menu, subMenus: [subMenu] }]);
      expect(result).toEqual([
        {
          id: menu.id,
          title: menu.name,
          menus: [{ id: subMenu.id, title: subMenu.title, imageURL: subMenu.imageURL }],
        },
      ]);
    });
  });

  describe('menusAndOffersToMenuResponse', () => {
    const testCases = [
      {
        menuType: MenuType.MARKETPLACE,
        input: [{ ...menu, menuType: MenuType.MARKETPLACE, offers: [offer] }],
        expected: {
          [MenuType.MARKETPLACE]: mapMenuWithOffersToMarketplaceMenuResponses([{ ...menu, offers: [offer] }]),
          [MenuType.DEALS_OF_THE_WEEK]: undefined,
          [MenuType.FEATURED]: undefined,
          [MenuType.FLEXIBLE]: undefined,
        },
      },
      {
        menuType: MenuType.DEALS_OF_THE_WEEK,
        input: [{ ...menu, menuType: MenuType.DEALS_OF_THE_WEEK, offers: [offer] }],
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
        input: [{ ...menu, menuType: MenuType.FEATURED, offers: [offer] }],
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
        input: [{ ...menu, menuType: MenuType.FLEXIBLE, subMenus: [subMenu] }],
        expected: {
          [MenuType.MARKETPLACE]: undefined,
          [MenuType.DEALS_OF_THE_WEEK]: undefined,
          [MenuType.FEATURED]: undefined,
          [MenuType.FLEXIBLE]: mapMenuWithSubMenusToFlexibleMenuResponse([
            { ...menu, menuType: MenuType.FLEXIBLE, subMenus: [subMenu] },
          ]),
        },
      },
    ];
    it.each(testCases)('should map %s menusAndOffersToMenuResponse', ({ menuType, expected, input }) => {
      const result = mapMenusAndOffersToMenuResponse({ [menuType]: input });
      expect(result).toEqual(expected);
    });
  });
});
