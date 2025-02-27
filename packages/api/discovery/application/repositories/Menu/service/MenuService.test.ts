import { menuFactory } from '@blc-mono/discovery/application/factories/MenuFactory';
import { menuEventOfferFactory, menuOfferFactory } from '@blc-mono/discovery/application/factories/MenuOfferFactory';
import { subMenuFactory } from '@blc-mono/discovery/application/factories/SubMenuFactory';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import * as MenuRepositoryFile from '@blc-mono/discovery/application/repositories/Menu/MenuRepository';

import { MenuEntity, MenuEntityWithOfferEntities } from '../../schemas/MenuEntity';

import { mapEventToMenuEventEntity } from './mapper/MenuEventMapper';
import { mapMenuToMenuEntity } from './mapper/MenuMapper';
import { mapMenuOfferToMenuOfferEntity } from './mapper/MenuOfferMapper';
import { mapSubMenuToSubMenuEntity } from './mapper/SubMenuMapper';
import * as target from './MenuService';

jest.mock('@blc-mono/discovery/application/repositories/Menu/MenuRepository');

const menu = menuFactory.build();
const offer = menuOfferFactory.build();
const event = menuEventOfferFactory.build();
const menuEntity = mapMenuToMenuEntity(menu);
const menuOfferEntity = mapMenuOfferToMenuOfferEntity(offer, menu.id, menu.menuType);
const menuEventEntity = mapEventToMenuEventEntity(event, menu.id, menu.menuType);

const flexibleMenu = { ...menu, menuType: MenuType.WAYS_TO_SAVE, id: '5678' };
const flexibleMenuEntity = mapMenuToMenuEntity(flexibleMenu);
const flexibleSubMenu = subMenuFactory.build();
const flexibleSubMenuEntity = mapSubMenuToSubMenuEntity(flexibleMenu.id, flexibleSubMenu, flexibleMenu.menuType);
const flexibleSubMenuOfferEntity = mapMenuOfferToMenuOfferEntity(
  offer,
  flexibleMenu.id,
  MenuType.WAYS_TO_SAVE,
  flexibleSubMenu.id,
);
const flexibleSubMenuEventEntity = mapEventToMenuEventEntity(
  event,
  flexibleMenu.id,
  MenuType.WAYS_TO_SAVE,
  flexibleSubMenu.id,
);

const givenMenuOfferRepositoryThrowsAnError = (method: keyof MenuRepositoryFile.MenuRepository) => {
  jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, method).mockRejectedValue(new Error('DynamoDB error'));
};

jest.mock('@blc-mono/core/utils/getEnv', () => {
  return {
    getEnv: (key: string) => {
      if (key === 'MENUS_TABLE_NAME') {
        return 'menus-table';
      }
      return 'invalid-env-key';
    },
    getEnvRaw: (key: string) => {
      if (key === 'REGION') {
        return 'eu-west-2';
      }
      return 'invalid-env-key';
    },
  };
});

describe('Menu Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('insertMenuWithOffers', () => {
    it('should insert menu with offers successfully', async () => {
      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert').mockResolvedValue();
      await target.insertMenuWithOffers(menu, [offer]);
      expect(mockInsert).toHaveBeenCalledWith([menuEntity, menuOfferEntity]);
    });

    it('should throw error when an menu or menu offer failed to insert', async () => {
      givenMenuOfferRepositoryThrowsAnError('batchInsert');
      await expect(target.insertMenuWithOffers(menu, [offer])).rejects.toThrow(
        `Error occurred inserting menu with offers as batch, amount: [2]`,
      );
    });
  });

  describe('insertMenusWithOffers', () => {
    it('should insert menus with offers successfully', async () => {
      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert').mockResolvedValue();
      await target.insertMenusWithOffers([{ menu, menuOffers: [offer] }]);
      expect(mockInsert).toHaveBeenCalledWith([menuEntity, menuOfferEntity]);
    });

    it('should throw error when an menu or menu offer failed to insert', async () => {
      givenMenuOfferRepositoryThrowsAnError('batchInsert');
      await expect(target.insertMenuWithOffers(menu, [offer])).rejects.toThrow(
        `Error occurred inserting menu with offers as batch, amount: [2]`,
      );
    });
  });

  describe('insertThemedMenuWithSubMenusAndOffers', () => {
    it('should insert themed menu with sub menus and offers successfully', async () => {
      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert').mockResolvedValue();
      await target.insertThemedMenuWithSubMenusAndOffers(
        flexibleMenu,
        [flexibleSubMenu],
        [{ subMenuId: flexibleSubMenu.id, offer }],
      );
      expect(mockInsert).toHaveBeenCalledWith([flexibleMenuEntity, flexibleSubMenuEntity, flexibleSubMenuOfferEntity]);
    });

    it('should throw error when themed menu with sub menus and offers failed to insert', async () => {
      givenMenuOfferRepositoryThrowsAnError('batchInsert');
      await expect(
        target.insertThemedMenuWithSubMenusAndOffers(
          flexibleMenu,
          [flexibleSubMenu],
          [{ subMenuId: flexibleSubMenu.id, offer }],
        ),
      ).rejects.toThrow(`Error occurred inserting themed menu with sub menus offers as batch, amount: [3]`);
    });
  });

  describe('insertThemedMenuWithSubMenusAndEvents', () => {
    it('should insert themed menu with sub menus and events successfully', async () => {
      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert').mockResolvedValue();
      await target.insertThemedMenuWithSubMenusAndEvents(
        flexibleMenu,
        [flexibleSubMenu],
        [{ subMenuId: flexibleSubMenu.id, event }],
      );
      expect(mockInsert).toHaveBeenCalledWith([flexibleMenuEntity, flexibleSubMenuEntity, flexibleSubMenuEventEntity]);
    });

    it('should throw error when themed menu with sub menus and events failed to insert', async () => {
      givenMenuOfferRepositoryThrowsAnError('batchInsert');
      await expect(
        target.insertThemedMenuWithSubMenusAndEvents(
          flexibleMenu,
          [flexibleSubMenu],
          [{ subMenuId: flexibleSubMenu.id, event }],
        ),
      ).rejects.toThrow(`Error occurred inserting themed menu with sub menus events as batch, amount: [3]`);
    });
  });

  describe('deleteMenuWithSubMenusAndOffers', () => {
    it('should delete menu with offers successfully', async () => {
      const mockDelete = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'deleteMenuWithSubMenuAndOffers')
        .mockResolvedValue();
      await target.deleteMenuWithSubMenusAndOffers(menu.id);
      expect(mockDelete).toHaveBeenCalledWith(menu.id);
    });

    it('should throw error when menu with offers failed to delete', async () => {
      givenMenuOfferRepositoryThrowsAnError('deleteMenuWithSubMenuAndOffers');
      await expect(target.deleteMenuWithSubMenusAndOffers(menu.id)).rejects.toThrow(
        `Error occurred deleting menu with id: [${menu.id}]`,
      );
    });
  });

  describe('deleteMenusByMenuType', () => {
    describe('menuType Flexible Offers or Flexible Events', () => {
      it.each([MenuType.WAYS_TO_SAVE])('should delete menus with sub menus successfully', async (menuType) => {
        const retrieveThemedMenusWithSubMenus = jest
          .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveThemedMenusWithSubMenus')
          .mockResolvedValue([{ ...flexibleMenuEntity, subMenus: [flexibleSubMenuEntity] }]);

        const batchDeleteSpy = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchDelete');
        await target.deleteMenusByMenuType(menuType);
        expect(retrieveThemedMenusWithSubMenus).toHaveBeenCalled();
        expect(batchDeleteSpy).toHaveBeenCalledWith([flexibleMenuEntity, flexibleSubMenuEntity]);
      });

      it('should throw error when themed menus with sub menus fails to get', async () => {
        givenMenuOfferRepositoryThrowsAnError('retrieveThemedMenusWithSubMenus');
        await expect(target.deleteMenusByMenuType(MenuType.WAYS_TO_SAVE)).rejects.toThrow(
          `Error occurred deleting menus by menu type: [waysToSave]: [Error: DynamoDB error]`,
        );
      });

      it('should throw error when the batch Delete fails', async () => {
        jest
          .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveThemedMenusWithSubMenus')
          .mockResolvedValue([{ ...flexibleMenuEntity, subMenus: [flexibleSubMenuEntity] }]);
        givenMenuOfferRepositoryThrowsAnError('batchDelete');
        await expect(target.deleteMenusByMenuType(MenuType.WAYS_TO_SAVE)).rejects.toThrow(
          `Error occurred deleting menus by menu type: [waysToSave]: [Error: DynamoDB error]`,
        );
      });
    });

    describe('menuType Marketplace, Featured or DOTW', () => {
      it.each([MenuType.MARKETPLACE])('should delete menus with offers successfully', async (menuType) => {
        const retrieveMenusWithOffersByMenuType = jest
          .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenusWithOffersByMenuType')
          .mockResolvedValue([{ ...menuEntity, offers: [menuOfferEntity] }]);

        const batchDeleteSpy = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchDelete');
        batchDeleteSpy.mockResolvedValue();

        await target.deleteMenusByMenuType(menuType);
        expect(retrieveMenusWithOffersByMenuType).toHaveBeenCalled();
        expect(batchDeleteSpy).toHaveBeenCalledWith([menuEntity, menuOfferEntity]);
      });

      it.each([MenuType.MARKETPLACE, MenuType.FEATURED, MenuType.DEALS_OF_THE_WEEK])(
        'should throw error when menus with offers fails to get',
        async (menuType) => {
          givenMenuOfferRepositoryThrowsAnError('retrieveMenusWithOffersByMenuType');
          await expect(target.deleteMenusByMenuType(menuType)).rejects.toThrow(
            `Error occurred deleting menus by menu type: [${menuType}]: [Error: DynamoDB error]`,
          );
        },
      );

      it.each([MenuType.MARKETPLACE, MenuType.FEATURED, MenuType.DEALS_OF_THE_WEEK])(
        'should throw error when the batch Delete fails',
        async (menuType) => {
          jest
            .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenusWithOffersByMenuType')
            .mockResolvedValue([{ ...menuEntity, offers: [menuOfferEntity] }]);
          givenMenuOfferRepositoryThrowsAnError('batchDelete');
          await expect(target.deleteMenusByMenuType(menuType)).rejects.toThrow(
            `Error occurred deleting menus by menu type: [${menuType}]: [Error: DynamoDB error]`,
          );
        },
      );
    });
  });

  describe('getMenuById', () => {
    it('should get menu by id successfully', async () => {
      const mockRetrieveMenuData = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenuData')
        .mockResolvedValue(menuEntity);
      const result = await target.getMenuById(menu.id);
      expect(mockRetrieveMenuData).toHaveBeenCalledWith(menu.id);
      expect(result).toEqual(menu);
    });

    it('should return undefined if retrieveMenuData returns undefined', async () => {
      const mockRetrieveMenuData = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenuData')
        .mockResolvedValue(undefined);
      const result = await target.getMenuById(menu.id);
      expect(mockRetrieveMenuData).toHaveBeenCalledWith(menu.id);
      expect(result).toBeUndefined();
    });

    it('should throw error when menu failed to get by id', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveMenuData');
      await expect(target.getMenuById(menu.id)).rejects.toThrow(`Error occurred getting menu with id: [${menu.id}]`);
    });
  });

  describe('getMenuAndOffersByMenuId', () => {
    it('should get menu and its offers by id successfully', async () => {
      const mockRetrieveMenuWithOffers = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenuWithOffers')
        .mockResolvedValue({
          ...menuEntity,
          offers: [menuOfferEntity],
        });
      const result = await target.getMenuAndOffersByMenuId(menu.id);
      expect(mockRetrieveMenuWithOffers).toHaveBeenCalledWith(menu.id);
      expect(result).toEqual({ ...menu, offers: [offer] });
    });

    it('should return undefined if no menu with offers is found', async () => {
      const mockRetrieveMenuWithOffers = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenuWithOffers')
        .mockResolvedValue(undefined);
      const result = await target.getMenuAndOffersByMenuId(menu.id);
      expect(mockRetrieveMenuWithOffers).toHaveBeenCalledWith(menu.id);
      expect(result).toBeUndefined();
    });

    it('should throw error when menu and its offers failed to get by id', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveMenuWithOffers');
      await expect(target.getMenuAndOffersByMenuId(menu.id)).rejects.toThrow(
        `Error occurred getting menu with id: [${menu.id}] and its offers`,
      );
    });
  });

  describe('getThemedMenuAndOffersBySubMenuId', () => {
    it('should get themed menu and its offers by sub menu id successfully', async () => {
      const mockRetrieveMenuWithOffers = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveThemedMenuWithOffers')
        .mockResolvedValue({
          ...flexibleSubMenuEntity,
          offers: [flexibleSubMenuOfferEntity],
          events: [flexibleSubMenuEventEntity],
        });
      const result = await target.getThemedMenuAndOffersBySubMenuId(flexibleSubMenu.id);
      expect(mockRetrieveMenuWithOffers).toHaveBeenCalledWith(flexibleSubMenu.id);
      expect(result).toStrictEqual({ ...flexibleSubMenu, offers: [offer], events: [event] });
    });

    it('should return undefined if no themed menu with offers is found', async () => {
      const mockRetrieveMenuWithOffers = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveThemedMenuWithOffers')
        .mockResolvedValue(undefined);
      const result = await target.getThemedMenuAndOffersBySubMenuId(flexibleSubMenu.id);
      expect(mockRetrieveMenuWithOffers).toHaveBeenCalledWith(flexibleSubMenu.id);
      expect(result).toBeUndefined();
    });

    it('should throw error when themed menu and its offers failed to get by sub menu id', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveThemedMenuWithOffers');
      await expect(target.getThemedMenuAndOffersBySubMenuId(flexibleSubMenu.id)).rejects.toThrow(
        `Error occurred getting themed menu with sub menu id: [${flexibleSubMenu.id}] and its offers`,
      );
    });
  });

  describe('updateOfferInMenus', () => {
    it('should successfully update an offer if in one menu', async () => {
      const mockGetOfferInMenusByOfferId = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([menuOfferEntity]);

      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert')
        .mockResolvedValue();
      await target.updateOfferInMenus(offer);

      expect(mockGetOfferInMenusByOfferId).toHaveBeenCalledWith(offer.id);
      expect(mockInsert).toHaveBeenCalledWith(menuOfferEntity);
      expect(mockBatchInsert).not.toHaveBeenCalled();
    });

    it('should successfully update an offer in more than one menu', async () => {
      const mockGetOfferInMenusByOfferId = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([menuOfferEntity, menuOfferEntity]);

      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert')
        .mockResolvedValue();
      await target.updateOfferInMenus(offer);

      expect(mockGetOfferInMenusByOfferId).toHaveBeenCalledWith(offer.id);
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockBatchInsert).toHaveBeenCalledWith([menuOfferEntity, menuOfferEntity]);
    });

    it('should ignore updating an offer if it does not exist in any menu', async () => {
      const mockGetOfferInMenusByOfferId = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([]);

      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert')
        .mockResolvedValue();
      await target.updateOfferInMenus(offer);

      expect(mockGetOfferInMenusByOfferId).toHaveBeenCalledWith(offer.id);
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockBatchInsert).not.toHaveBeenCalled();
    });

    it('should throw an error if an error occurs whilst getting offers by offer id', async () => {
      givenMenuOfferRepositoryThrowsAnError('getOfferInMenusByOfferId');
      await expect(target.updateOfferInMenus(offer)).rejects.toThrow(
        `Error occurred updating offers in menu for offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });

    it('should throw an error if an error occurs whilst batch inserting', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([menuOfferEntity, menuOfferEntity]);
      givenMenuOfferRepositoryThrowsAnError('batchInsert');
      await expect(target.updateOfferInMenus(offer)).rejects.toThrow(
        `Error occurred updating offers in menu for offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });

    it('should throw an error if an error occurs whilst performing a single insert', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([menuOfferEntity]);
      givenMenuOfferRepositoryThrowsAnError('insert');
      await expect(target.updateOfferInMenus(offer)).rejects.toThrow(
        `Error occurred updating offers in menu for offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });
  });

  describe('updateEventInMenus', () => {
    it('should successfully update an event if in one menu', async () => {
      const mockGetOfferInMenusByEventId = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getEventInMenusByEventId')
        .mockResolvedValue([menuEventEntity]);

      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert')
        .mockResolvedValue();
      await target.updateEventInMenus(event);

      expect(mockGetOfferInMenusByEventId).toHaveBeenCalledWith(event.id);
      expect(mockInsert).toHaveBeenCalledWith(menuEventEntity);
      expect(mockBatchInsert).not.toHaveBeenCalled();
    });

    it('should successfully update an event in more than one menu', async () => {
      const mockGetOfferInMenusByEventId = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getEventInMenusByEventId')
        .mockResolvedValue([menuEventEntity, menuEventEntity]);

      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert')
        .mockResolvedValue();
      await target.updateEventInMenus(event);

      expect(mockGetOfferInMenusByEventId).toHaveBeenCalledWith(event.id);
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockBatchInsert).toHaveBeenCalledWith([menuEventEntity, menuEventEntity]);
    });

    it('should ignore updating an event if it does not exist in any menu', async () => {
      const mockGetOfferInMenusByEventId = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getEventInMenusByEventId')
        .mockResolvedValue([]);

      const mockInsert = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'batchInsert')
        .mockResolvedValue();
      await target.updateEventInMenus(event);

      expect(mockGetOfferInMenusByEventId).toHaveBeenCalledWith(offer.id);
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockBatchInsert).not.toHaveBeenCalled();
    });

    it('should throw an error if an error occurs whilst getting offers by event id', async () => {
      givenMenuOfferRepositoryThrowsAnError('getEventInMenusByEventId');
      await expect(target.updateEventInMenus(event)).rejects.toThrow(
        `Error occurred updating events in menu for offer with id: [${event.id}]: [Error: DynamoDB error]`,
      );
    });

    it('should throw an error if an error occurs whilst batch inserting', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getEventInMenusByEventId')
        .mockResolvedValue([menuEventEntity, menuEventEntity]);
      givenMenuOfferRepositoryThrowsAnError('batchInsert');
      await expect(target.updateEventInMenus(event)).rejects.toThrow(
        `Error occurred updating events in menu for offer with id: [${event.id}]: [Error: DynamoDB error]`,
      );
    });

    it('should throw an error if an error occurs whilst performing a single insert', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'getEventInMenusByEventId')
        .mockResolvedValue([menuEventEntity]);
      givenMenuOfferRepositoryThrowsAnError('insert');
      await expect(target.updateEventInMenus(event)).rejects.toThrow(
        `Error occurred updating events in menu for offer with id: [${event.id}]: [Error: DynamoDB error]`,
      );
    });
  });

  describe('getMenusByMenuType', () => {
    it('should get non flexible menus by menu type successfully', async () => {
      const retrieveMenusByMenuTypeSpy = jest.spyOn(
        MenuRepositoryFile.MenuRepository.prototype,
        'retrieveMenusWithOffersByMenuType',
      );
      retrieveMenusByMenuTypeSpy.mockResolvedValue([{ ...menuEntity, offers: [menuOfferEntity] }]);
      const retrieveThemedMenusWithSubMenusSpy = jest.spyOn(
        MenuRepositoryFile.MenuRepository.prototype,
        'retrieveThemedMenusWithSubMenus',
      );
      const result = await target.getMenusByMenuType(menu.menuType);

      expect(retrieveMenusByMenuTypeSpy).toHaveBeenCalledWith(menu.menuType);
      expect(retrieveThemedMenusWithSubMenusSpy).not.toHaveBeenCalled();
      expect(result).toEqual([{ ...menu, offers: [offer] }]);
    });

    it('should get flexible menus by menu type successfully', async () => {
      const retrieveThemedMenusWithSubMenusSpy = jest.spyOn(
        MenuRepositoryFile.MenuRepository.prototype,
        'retrieveThemedMenusWithSubMenus',
      );
      retrieveThemedMenusWithSubMenusSpy.mockResolvedValue([
        { ...flexibleMenuEntity, subMenus: [flexibleSubMenuEntity] },
      ]);
      const retrieveMenusByMenuTypeSpy = jest.spyOn(
        MenuRepositoryFile.MenuRepository.prototype,
        'retrieveMenusWithOffersByMenuType',
      );
      const result = await target.getMenusByMenuType(flexibleMenu.menuType);
      expect(retrieveThemedMenusWithSubMenusSpy).toHaveBeenCalled();
      expect(retrieveMenusByMenuTypeSpy).not.toHaveBeenCalled();
      expect(result).toEqual([{ ...flexibleMenu, subMenus: [flexibleSubMenu] }]);
    });

    it('should throw error when menus by menu type failed to get', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveMenusWithOffersByMenuType');
      await expect(target.getMenusByMenuType(menu.menuType)).rejects.toThrow(
        `Error occurred getting menu with menu type: [${menu.menuType}]`,
      );
    });

    it('should throw error when flexible menus by menu type failed to get', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveThemedMenusWithSubMenus');
      await expect(target.getMenusByMenuType(flexibleMenu.menuType)).rejects.toThrow(
        `Error occurred getting menu with menu type: [${flexibleMenu.menuType}]`,
      );
    });
  });

  describe('updateMenuOfferEntities', () => {
    it('should update menu offer entities with the new offer records but keeping the partition key, sort key & gsi keys', () => {
      const newOfferRecord = menuOfferFactory.build();
      const updatedMenuOfferEntities = target.updateMenuOfferEntities([menuOfferEntity], newOfferRecord);

      expect(updatedMenuOfferEntities).toEqual([
        {
          partitionKey: menuOfferEntity.partitionKey,
          sortKey: menuOfferEntity.sortKey,
          gsi1PartitionKey: menuOfferEntity.gsi1PartitionKey,
          gsi1SortKey: menuOfferEntity.gsi1SortKey,
          gsi2PartitionKey: menuOfferEntity.gsi2PartitionKey,
          gsi2SortKey: menuOfferEntity.gsi2SortKey,
          gsi3PartitionKey: menuOfferEntity.gsi3PartitionKey,
          gsi3SortKey: menuOfferEntity.gsi3SortKey,
          ...newOfferRecord,
        },
      ]);
    });
  });

  describe('updateSingletonMenuId', () => {
    const marketplaceMenu = menuFactory.build({ menuType: MenuType.MARKETPLACE });
    const marketplaceMenuEntity = mapMenuToMenuEntity(marketplaceMenu);
    const newStaticMenu = mapMenuToMenuEntity({ ...marketplaceMenu, menuType: MenuType.DEALS_OF_THE_WEEK });
    const oldStaticMenu = menuFactory.build({ menuType: MenuType.DEALS_OF_THE_WEEK });
    const oldStaticMenuEntity = mapMenuToMenuEntity(oldStaticMenu);

    let mockRetrieveMenuData: jest.SpyInstance;
    let mockRetrieveMenusWithOffersByMenuType: jest.SpyInstance;
    let mockTransactWrite: jest.SpyInstance;
    let mockDeleteMenuWithSubMenuAndOffers: jest.SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();
      mockTransactWrite = jest.spyOn(MenuRepositoryFile.MenuRepository.prototype, 'transactWrite').mockResolvedValue();
      mockDeleteMenuWithSubMenuAndOffers = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'deleteMenuWithSubMenuAndOffers')
        .mockResolvedValue();
    });

    const givenMenuDataIs = (menuEntity?: MenuEntity) => {
      mockRetrieveMenuData = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenuData')
        .mockResolvedValue(menuEntity);
    };

    const givenMenuWithOffersIs = (menuWithOffers: MenuEntityWithOfferEntities[]) => {
      mockRetrieveMenusWithOffersByMenuType = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenusWithOffersByMenuType')
        .mockResolvedValue(menuWithOffers);
    };

    it('should find & update menu to be of new static menu type', async () => {
      givenMenuDataIs(marketplaceMenuEntity);
      givenMenuWithOffersIs([{ ...oldStaticMenuEntity, offers: [menuOfferEntity] }]);

      await target.updateSingletonMenuId(marketplaceMenuEntity.id, MenuType.DEALS_OF_THE_WEEK);

      expect(mockRetrieveMenuData).toHaveBeenCalledWith(marketplaceMenuEntity.id);
      expect(mockRetrieveMenusWithOffersByMenuType).toHaveBeenCalledWith(MenuType.DEALS_OF_THE_WEEK);
      expect(mockTransactWrite).toHaveBeenCalledWith([newStaticMenu], [oldStaticMenuEntity]);
      expect(mockDeleteMenuWithSubMenuAndOffers).toHaveBeenCalled();
    });

    it('should call transactWrite with an empty array if no menuToUpdate is found', async () => {
      givenMenuDataIs();
      givenMenuWithOffersIs([{ ...oldStaticMenuEntity, offers: [menuOfferEntity] }]);

      await target.updateSingletonMenuId(marketplaceMenuEntity.id, MenuType.DEALS_OF_THE_WEEK);

      expect(mockRetrieveMenuData).toHaveBeenCalledWith(marketplaceMenuEntity.id);
      expect(mockRetrieveMenusWithOffersByMenuType).toHaveBeenCalledWith(MenuType.DEALS_OF_THE_WEEK);
      expect(mockTransactWrite).toHaveBeenCalledWith([], [oldStaticMenuEntity]);
      expect(mockDeleteMenuWithSubMenuAndOffers).toHaveBeenCalled();
    });

    it('should call transactWrite with an empty array if no menuToDelete is found', async () => {
      givenMenuDataIs(marketplaceMenuEntity);
      givenMenuWithOffersIs([]);

      await target.updateSingletonMenuId(marketplaceMenuEntity.id, MenuType.DEALS_OF_THE_WEEK);

      expect(mockRetrieveMenuData).toHaveBeenCalledWith(marketplaceMenuEntity.id);
      expect(mockRetrieveMenusWithOffersByMenuType).toHaveBeenCalledWith(MenuType.DEALS_OF_THE_WEEK);
      expect(mockTransactWrite).toHaveBeenCalledWith([newStaticMenu], []);
      expect(mockDeleteMenuWithSubMenuAndOffers).not.toHaveBeenCalled();
    });

    it('should delete current singleton menu offers', async () => {
      givenMenuDataIs(marketplaceMenuEntity);
      givenMenuWithOffersIs([{ ...oldStaticMenuEntity, offers: [menuOfferEntity] }]);

      await target.updateSingletonMenuId(marketplaceMenuEntity.id, MenuType.DEALS_OF_THE_WEEK);

      expect(mockDeleteMenuWithSubMenuAndOffers).toHaveBeenCalledWith(oldStaticMenuEntity.id);
    });

    it('should not call transactWrite if no menusToDelete are found', async () => {
      givenMenuDataIs();
      givenMenuWithOffersIs([]);

      await target.updateSingletonMenuId(marketplaceMenuEntity.id, MenuType.DEALS_OF_THE_WEEK);

      expect(mockDeleteMenuWithSubMenuAndOffers).not.toHaveBeenCalled();
      expect(mockTransactWrite).not.toHaveBeenCalled();
    });
  });
});
