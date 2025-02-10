import { ingestedMenuOfferFactory, menuOfferFactory } from '@blc-mono/discovery/application/factories/MenuOfferFactory';
import {
  deleteMenuWithSubMenusAndOffers,
  getMenuById,
  insertMenuWithOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getOffersByIds } from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

import * as target from './MenusEventHandler';

jest.mock('@blc-mono/discovery/application/repositories/Menu/service/MenuService');
jest.mock('@blc-mono/discovery/application/repositories/Offer/service/OfferService');

const insertMenuWithOffersMock = jest.mocked(insertMenuWithOffers);
const deleteMenuWithSubMenusAndOffersMock = jest.mocked(deleteMenuWithSubMenusAndOffers);
const getOffersByIdsMock = jest.mocked(getOffersByIds);
const getMenuByIdMock = jest.mocked(getMenuById);
const menuOffer = ingestedMenuOfferFactory.build();
const olderMenuOffer = ingestedMenuOfferFactory.build({ updatedAt: new Date(2021, 12, 30).toISOString() });
const newerMenuOffer = ingestedMenuOfferFactory.build({ updatedAt: new Date(2023, 12, 30).toISOString() });
const offers = menuOfferFactory.buildList(1);
const { offers: _menuOffers, ...menu } = menuOffer;

describe('MenusEventHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMenusUpdated', () => {
    it('should insert menu with offers if no current menu record', async () => {
      getMenuByIdMock.mockResolvedValue(undefined);
      getOffersByIdsMock.mockResolvedValue(offers);

      await target.handleMenusUpdated(menuOffer);
      expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalledWith(menuOffer.id);
      expect(insertMenuWithOffersMock).toHaveBeenCalledWith(menu, offers);
    });

    describe('and current record exists', () => {
      it('should remove all menu data and insert new menu with offers if menu record is newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        getOffersByIdsMock.mockResolvedValue(offers);
        const { offers: _newMenuOffers, ...newMenu } = newerMenuOffer;
        await target.handleMenusUpdated(newerMenuOffer);
        expect(deleteMenuWithSubMenusAndOffersMock).toHaveBeenCalledWith(newerMenuOffer.id);
        expect(insertMenuWithOffersMock).toHaveBeenCalledWith(newMenu, offers);
      });

      it('should not remove all menu data and not insert menu with offers if menu record is not newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        getOffersByIdsMock.mockResolvedValue(offers);
        await target.handleMenusUpdated(olderMenuOffer);
        expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
        expect(insertMenuWithOffersMock).not.toHaveBeenCalledWith();
      });
    });
  });

  describe('handleMenusDeleted', () => {
    it('should not delete menu if no current menu record', async () => {
      getMenuByIdMock.mockResolvedValue(undefined);
      await target.handleMenusDeleted(menuOffer);
      expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
    });

    describe('and current record exists', () => {
      it('should delete menu if menu record is newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        await target.handleMenusDeleted(newerMenuOffer);
        expect(deleteMenuWithSubMenusAndOffersMock).toHaveBeenCalledWith(newerMenuOffer.id);
      });

      it('should not delete menu if menu record is not newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        await target.handleMenusDeleted(olderMenuOffer);
        expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
      });
    });
  });
});
