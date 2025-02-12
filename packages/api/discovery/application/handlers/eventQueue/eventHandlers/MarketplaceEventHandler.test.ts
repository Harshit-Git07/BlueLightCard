import { subMonths } from 'date-fns';

import { menuFactory } from '@blc-mono/discovery/application/factories/MenuFactory';
import { ingestedMenuOfferFactory, menuOfferFactory } from '@blc-mono/discovery/application/factories/MenuOfferFactory';
import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { IngestedMenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import {
  deleteMenusByMenuType,
  getMenusByMenuType,
  insertMenusWithOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getOffersByIds } from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

import * as target from './MarketplaceEventHandler';

jest.mock('@blc-mono/discovery/application/repositories/Menu/service/MenuService');
jest.mock('@blc-mono/discovery/application/repositories/Offer/service/OfferService');

const insertMenusWithOffersMock = jest.mocked(insertMenusWithOffers);
const deleteMenusByMenuTypeMock = jest.mocked(deleteMenusByMenuType);
const getOffersByIdsMock = jest.mocked(getOffersByIds);
const getMenusByMenuTypeMock = jest.mocked(getMenusByMenuType);

const ingestedMenuOffer = ingestedMenuOfferFactory.build({ menuType: MenuType.MARKETPLACE });
const offers = offerFactory.buildList(3);

const { offers: menuOffers, ...menu } = ingestedMenuOffer;

describe('MarketplaceEventHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMarketplaceMenusUpdated', () => {
    it('should insert marketplace menus if no current marketplace menus are found', async () => {
      getMenusByMenuTypeMock.mockResolvedValue([]);
      getOffersByIdsMock.mockResolvedValue(offers);

      await target.handleMarketplaceMenusUpdated({
        updatedAt: ingestedMenuOffer.updatedAt,
        ingestedMenuOffers: [ingestedMenuOffer],
      });

      const expectedResult = [
        {
          menu,
          menuOffers: [
            {
              ...offers[0],
              start: menuOffers[0].start,
              end: menuOffers[0].end,
              position: menuOffers[0].position,
            },
            {
              ...offers[1],
              start: menuOffers[1].start,
              end: menuOffers[1].end,
              position: menuOffers[1].position,
            },
            {
              ...offers[2],
              start: menuOffers[2].start,
              end: menuOffers[2].end,
              position: menuOffers[2].position,
            },
          ],
        },
      ];

      expect(deleteMenusByMenuTypeMock).not.toHaveBeenCalled();
      expect(insertMenusWithOffersMock).toHaveBeenCalledWith(expectedResult);
    });

    it('should insert marketplace menus if the event is newer and delete old marketplace menus', async () => {
      const dateTimeStamp = new Date().toISOString();
      const newerIngestedMenuOffer = { ...ingestedMenuOffer, updatedAt: dateTimeStamp };
      const olderDate = subMonths(new Date(), 2).toISOString();
      const olderMenu = menuFactory.build({ updatedAt: olderDate });
      const olderMenuOffer = menuOfferFactory.build({ updatedAt: olderDate });
      getMenusByMenuTypeMock.mockResolvedValue([{ ...olderMenu, offers: [olderMenuOffer] }]);
      getOffersByIdsMock.mockResolvedValue(offers);

      const expectedResult = [
        {
          menu: { ...menu, updatedAt: dateTimeStamp },
          menuOffers: [
            {
              ...offers[0],
              start: menuOffers[0].start,
              end: menuOffers[0].end,
              position: menuOffers[0].position,
            },
            {
              ...offers[1],
              start: menuOffers[1].start,
              end: menuOffers[1].end,
              position: menuOffers[1].position,
            },
            {
              ...offers[2],
              start: menuOffers[2].start,
              end: menuOffers[2].end,
              position: menuOffers[2].position,
            },
          ],
        },
      ];

      await target.handleMarketplaceMenusUpdated({
        updatedAt: newerIngestedMenuOffer.updatedAt,
        ingestedMenuOffers: [newerIngestedMenuOffer],
      });
      expect(deleteMenusByMenuTypeMock).toHaveBeenCalledWith(MenuType.MARKETPLACE);
      expect(insertMenusWithOffersMock).toHaveBeenCalledWith(expectedResult);
    });

    it('should insert multiple marketplace menus correctly', async () => {
      getMenusByMenuTypeMock.mockResolvedValue([]);
      const secondMenu = menuFactory.build();
      const secondMenuOffer = {
        ...menuOffers[0],
        start: '2001-12-30T00:00:00.000Z',
      };
      const inputMenus: IngestedMenuOffer[] = [
        { ...menu, offers: [{ ...menuOffers[0] }] },
        { ...secondMenu, offers: [secondMenuOffer] },
      ];
      const expectedResult = [
        {
          menu,
          menuOffers: [
            {
              ...offers[0],
              start: menuOffers[0].start,
              end: menuOffers[0].end,
              position: menuOffers[0].position,
            },
          ],
        },
        {
          menu: secondMenu,
          menuOffers: [
            {
              ...offers[0],
              start: secondMenuOffer.start,
              end: secondMenuOffer.end,
              position: secondMenuOffer.position,
            },
          ],
        },
      ];
      getOffersByIdsMock.mockResolvedValue([offers[0]]);
      await target.handleMarketplaceMenusUpdated({ updatedAt: menu.updatedAt, ingestedMenuOffers: inputMenus });
      expect(insertMenusWithOffersMock).toHaveBeenCalledWith(expectedResult);
    });

    it('should not insert marketplace menus if the event is not newer', async () => {
      const olderTimeStamp = subMonths(new Date(), 2).toISOString();
      const olderIngestedMenuOffer = { ...ingestedMenuOffer, updatedAt: olderTimeStamp };
      const currentDate = new Date().toISOString();
      const newerMenu = menuFactory.build({ updatedAt: currentDate });
      const newerMenuOffer = menuOfferFactory.build({ updatedAt: currentDate });
      getMenusByMenuTypeMock.mockResolvedValue([{ ...newerMenu, offers: [newerMenuOffer] }]);

      await target.handleMarketplaceMenusUpdated({
        updatedAt: olderIngestedMenuOffer.updatedAt,
        ingestedMenuOffers: [olderIngestedMenuOffer],
      });
      expect(deleteMenusByMenuTypeMock).not.toHaveBeenCalled();
      expect(insertMenusWithOffersMock).not.toHaveBeenCalled();
    });
  });

  describe('handleMarketplaceMenusDeleted', () => {
    it('should delete marketplace menus if current marketplace menus are found and the event is newer', async () => {
      const dateTimeStamp = new Date().toISOString();
      const newerIngestedMenuOffer = { ...ingestedMenuOffer, updatedAt: dateTimeStamp };
      const olderDate = subMonths(new Date(), 2).toISOString();
      const olderMenu = menuFactory.build({ updatedAt: olderDate });
      const olderMenuOffer = menuOfferFactory.build({ updatedAt: olderDate });
      getMenusByMenuTypeMock.mockResolvedValue([{ ...olderMenu, offers: [olderMenuOffer] }]);

      await target.handleMarketplaceMenusDeleted({
        updatedAt: newerIngestedMenuOffer.updatedAt,
        ingestedMenuOffers: [newerIngestedMenuOffer],
      });
      expect(deleteMenusByMenuTypeMock).toHaveBeenCalledWith(MenuType.MARKETPLACE);
    });

    it('should not delete marketplace menus if the event is not newer', async () => {
      const olderTimeStamp = subMonths(new Date(), 2).toISOString();
      const olderIngestedMenuOffer = { ...ingestedMenuOffer, updatedAt: olderTimeStamp };
      const currentDate = new Date().toISOString();
      const newerMenu = menuFactory.build({ updatedAt: currentDate });
      const newerMenuOffer = menuOfferFactory.build({ updatedAt: currentDate });
      getMenusByMenuTypeMock.mockResolvedValue([{ ...newerMenu, offers: [newerMenuOffer] }]);

      await target.handleMarketplaceMenusDeleted({
        updatedAt: olderIngestedMenuOffer.updatedAt,
        ingestedMenuOffers: [olderIngestedMenuOffer],
      });
      expect(deleteMenusByMenuTypeMock).not.toHaveBeenCalled();
    });

    it('should return early if no current marketplace menus are found', async () => {
      getMenusByMenuTypeMock.mockResolvedValue([]);
      await target.handleMarketplaceMenusDeleted({
        updatedAt: ingestedMenuOffer.updatedAt,
        ingestedMenuOffers: [ingestedMenuOffer],
      });
      expect(deleteMenusByMenuTypeMock).not.toHaveBeenCalled();
    });
  });
});
