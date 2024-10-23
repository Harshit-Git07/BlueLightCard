import { menuEntityFactory } from '@blc-mono/discovery/application/factories/MenuEntityFactory';
import { menuOfferEntityFactory } from '@blc-mono/discovery/application/factories/MenuOfferEntityFactory';
import {
  deleteMenuWithOffers,
  getMenuAndOffersByMenuId,
  insertMenuWithOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';

import * as target from './MenusEventHandler';

jest.mock('@blc-mono/discovery/application/repositories/Menu/service/MenuService');

const insertMenuWithOffersMock = jest.mocked(insertMenuWithOffers);
const getMenuAndOffersByMenuIdMock = jest.mocked(getMenuAndOffersByMenuId);
const deleteMenuWithOffersMock = jest.mocked(deleteMenuWithOffers);

const menuEntity = menuEntityFactory.build({ updatedAt: new Date(2022, 12, 30).toISOString() });
const menuOfferEntity = menuOfferEntityFactory.buildList(1);
const olderMenuEntity = menuEntityFactory.build({ updatedAt: new Date(2021, 12, 30).toISOString() });
const newerMenuEntity = menuEntityFactory.build({ updatedAt: new Date(2023, 12, 30).toISOString() });

describe('MenusEventHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMenusUpdated', () => {
    it('should insert menu with offers if no current menu record', async () => {
      getMenuAndOffersByMenuIdMock.mockResolvedValue(undefined);
      await target.handleMenusUpdated(menuEntity, menuOfferEntity);
      expect(deleteMenuWithOffersMock).toHaveBeenCalledWith(menuEntity.id);
      expect(insertMenuWithOffersMock).toHaveBeenCalledWith(menuEntity, menuOfferEntity);
    });

    describe('and current record exists', () => {
      it('should remove all menu data and insert new menu with offers if menu record is newer version', async () => {
        getMenuAndOffersByMenuIdMock.mockResolvedValue({ menu: menuEntity, offers: [] });
        await target.handleMenusUpdated(newerMenuEntity, menuOfferEntity);
        expect(deleteMenuWithOffersMock).toHaveBeenCalledWith(menuEntity.id);
        expect(insertMenuWithOffersMock).toHaveBeenCalledWith(newerMenuEntity, menuOfferEntity);
      });

      it('should not remove all menu data and not insert menu with offers if menu record is not newer version', async () => {
        getMenuAndOffersByMenuIdMock.mockResolvedValue({ menu: menuEntity, offers: [] });
        await target.handleMenusUpdated(olderMenuEntity, menuOfferEntity);
        expect(deleteMenuWithOffersMock).not.toHaveBeenCalled();
        expect(insertMenuWithOffersMock).not.toHaveBeenCalledWith();
      });
    });
  });

  describe('handleMenusDeleted', () => {
    it('should not delete menu if no current menu record', async () => {
      getMenuAndOffersByMenuIdMock.mockResolvedValue(undefined);
      await target.handleMenusDeleted(menuEntity);
      expect(deleteMenuWithOffersMock).not.toHaveBeenCalled();
    });

    describe('and current record exists', () => {
      it('should delete menu if menu record is newer version', async () => {
        getMenuAndOffersByMenuIdMock.mockResolvedValue({ menu: menuEntity, offers: [] });
        await target.handleMenusDeleted(newerMenuEntity);
        expect(deleteMenuWithOffersMock).toHaveBeenCalledWith(newerMenuEntity.id);
      });

      it('should not delete menu if menu record is not newer version', async () => {
        getMenuAndOffersByMenuIdMock.mockResolvedValue({ menu: menuEntity, offers: [] });
        await target.handleMenusDeleted(olderMenuEntity);
        expect(deleteMenuWithOffersMock).not.toHaveBeenCalled();
      });
    });
  });
});
