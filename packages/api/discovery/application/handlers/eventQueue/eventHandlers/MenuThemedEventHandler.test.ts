import { menuFactory } from '@blc-mono/discovery/application/factories/MenuFactory';
import { menuOfferFactory } from '@blc-mono/discovery/application/factories/MenuOfferFactory';
import { subMenuFactory } from '@blc-mono/discovery/application/factories/SubMenuFactory';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { ThemedMenuOffer } from '@blc-mono/discovery/application/models/ThemedMenu';
import {
  deleteMenuWithSubMenusAndOffers,
  getMenuById,
  insertThemedMenuWithSubMenusAndOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getOffersByIds } from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

import { handleMenuThemedUpdated } from './MenuThemedEventHandler';

jest.mock('@blc-mono/discovery/application/repositories/Menu/service/MenuService');
jest.mock('@blc-mono/discovery/application/repositories/Offer/service/OfferService');

const menu = menuFactory.build();
const subMenu = subMenuFactory.build();
const secondSubMenu = subMenuFactory.build({ id: '2' });
const offer = menuOfferFactory.build({ id: 'offer-1' });
const secondOffer = menuOfferFactory.build({ id: 'offer-2' });

const insertThemedMenuWithSubMenusAndOffersMock = jest.mocked(insertThemedMenuWithSubMenusAndOffers);
const deleteMenuWithSubMenusAndOffersMock = jest.mocked(deleteMenuWithSubMenusAndOffers);
const getOffersByIdsMock = jest.mocked(getOffersByIds);
const getMenuByIdMock = jest.mocked(getMenuById);

const themedMenuOffer: ThemedMenuOffer = {
  ...menu,
  menuType: MenuType.FLEXIBLE,
  themedMenusOffers: [
    { ...subMenu, offers: [{ id: 'offer-1', company: { id: 'company-1' }, position: 0 }] },
    { ...secondSubMenu, offers: [{ id: 'offer-2', company: { id: 'company-2' }, position: 0 }] },
  ],
};

describe('MenuThemedEventHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMenusUpdated', () => {
    it('should insert menu with offers if no current menu record', async () => {
      getMenuByIdMock.mockResolvedValue(undefined);
      getOffersByIdsMock.mockResolvedValue([offer, secondOffer]);

      await handleMenuThemedUpdated(themedMenuOffer);
      expect(getMenuByIdMock).toHaveBeenCalledWith(themedMenuOffer.id);
      expect(getOffersByIdsMock).toHaveBeenCalledWith([
        { id: 'offer-1', companyId: 'company-1' },
        { id: 'offer-2', companyId: 'company-2' },
      ]);
      expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
      expect(insertThemedMenuWithSubMenusAndOffersMock).toHaveBeenCalledWith(
        { ...menu, menuType: MenuType.FLEXIBLE },
        [subMenu, secondSubMenu],
        [
          { subMenuId: '1', offer: { ...offer, start: undefined, end: undefined, position: 0 } },
          { subMenuId: '2', offer: { ...secondOffer, start: undefined, end: undefined, position: 0 } },
        ],
      );
    });

    describe('and current themed menu record event exists', () => {
      it('should remove all themed menu data and insert new themed menu with offers if themed menu record is newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        getOffersByIdsMock.mockResolvedValue([offer, secondOffer]);
        const newerMenu = { ...menu, updatedAt: '2023-09-01T00:00:00' };
        const newerThemedMenuOffer: ThemedMenuOffer = {
          ...newerMenu,
          menuType: MenuType.FLEXIBLE,
          themedMenusOffers: [
            { ...subMenu, offers: [{ id: 'offer-1', company: { id: 'company-1' }, position: 0 }] },
            { ...secondSubMenu, offers: [{ id: 'offer-2', company: { id: 'company-2' }, position: 0 }] },
          ],
        };

        await handleMenuThemedUpdated(newerThemedMenuOffer);
        expect(deleteMenuWithSubMenusAndOffersMock).toHaveBeenCalledWith(newerThemedMenuOffer.id);
        expect(insertThemedMenuWithSubMenusAndOffersMock).toHaveBeenCalledWith(
          { ...newerMenu, menuType: MenuType.FLEXIBLE },
          [subMenu, secondSubMenu],
          [
            { subMenuId: '1', offer: { ...offer, start: undefined, end: undefined, position: 0 } },
            { subMenuId: '2', offer: { ...secondOffer, start: undefined, end: undefined, position: 0 } },
          ],
        );
      });

      it('should not remove all themed menu data and not insert themed menu with offers if themed menu record is not newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        getOffersByIdsMock.mockResolvedValue([offer, secondOffer]);
        const olderThemedMenuOffer: ThemedMenuOffer = {
          ...menu,
          menuType: MenuType.FLEXIBLE,
          themedMenusOffers: [
            { ...subMenu, offers: [{ id: 'offer-1', company: { id: 'company-1' }, position: 0 }] },
            { ...secondSubMenu, offers: [{ id: 'offer-2', company: { id: 'company-2' }, position: 0 }] },
          ],
          updatedAt: new Date(2021, 12, 30).toISOString(),
        };

        await handleMenuThemedUpdated(olderThemedMenuOffer);
        expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
        expect(insertThemedMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('handleMenusDeleted', () => {
    it('should not delete themed menu if no current themed menu record', async () => {
      getMenuByIdMock.mockResolvedValue(undefined);
      await handleMenuThemedUpdated(themedMenuOffer);
      expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
    });

    describe('and current themed menu record exists', () => {
      it('should delete themed menu if themed menu record is newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        const newerMenu = { ...menu, updatedAt: '2023-09-01T00:00:00' };
        const newerThemedMenuOffer: ThemedMenuOffer = {
          ...newerMenu,
          menuType: MenuType.FLEXIBLE,
          themedMenusOffers: [
            { ...subMenu, offers: [{ id: 'offer-1', company: { id: 'company-1' }, position: 0 }] },
            { ...secondSubMenu, offers: [{ id: 'offer-2', company: { id: 'company-2' }, position: 0 }] },
          ],
        };

        await handleMenuThemedUpdated(newerThemedMenuOffer);
        expect(deleteMenuWithSubMenusAndOffersMock).toHaveBeenCalledWith(themedMenuOffer.id);
      });

      it('should not delete themed menu if themed menu record is not newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        const olderThemedMenuOffer: ThemedMenuOffer = {
          ...menu,
          menuType: MenuType.FLEXIBLE,
          themedMenusOffers: [
            { ...subMenu, offers: [{ id: 'offer-1', company: { id: 'company-1' }, position: 0 }] },
            { ...secondSubMenu, offers: [{ id: 'offer-2', company: { id: 'company-2' }, position: 0 }] },
          ],
          updatedAt: new Date(2021, 12, 30).toISOString(),
        };

        await handleMenuThemedUpdated(olderThemedMenuOffer);
        expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
      });
    });
  });
});
