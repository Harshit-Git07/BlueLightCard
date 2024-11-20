import { menuFactory } from '@blc-mono/discovery/application/factories/MenuFactory';
import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { subMenuFactory } from '@blc-mono/discovery/application/factories/SubMenuFactory';
import { MenuWithOffers } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import * as MenuRepositoryFile from '@blc-mono/discovery/application/repositories/Menu/MenuRepository';

import { MenuEntity, MenuEntityWithOfferEntities } from '../../schemas/MenuEntity';

import { mapMenuToMenuEntity } from './mapper/MenuMapper';
import { mapOfferToMenuOfferEntity } from './mapper/MenuOfferMapper';
import { mapSubMenuToSubMenuEntity } from './mapper/SubMenuMapper';
import * as target from './MenuService';

jest.mock('@blc-mono/discovery/application/repositories/Menu/MenuRepository');

const menu = menuFactory.build();
const offer = offerFactory.build();
const menuEntity = mapMenuToMenuEntity(menu);
const menuOfferEntity = mapOfferToMenuOfferEntity(offer, menu.id, menu.menuType);
const featuredMenu = { ...menu, menuType: MenuType.FEATURED, id: '1234' };
const featuredMenuEntity = mapMenuToMenuEntity(featuredMenu);
const featuredOfferEntity = mapOfferToMenuOfferEntity(offer, featuredMenu.id, featuredMenu.menuType);

const flexibleMenu = { ...menu, menuType: MenuType.FLEXIBLE, id: '5678' };
const flexibleMenuEntity = mapMenuToMenuEntity(flexibleMenu);
const flexibleSubMenu = subMenuFactory.build();
const flexibleSubMenuEntity = mapSubMenuToSubMenuEntity(flexibleMenu.id, flexibleSubMenu);
const flexibleSubMenuOfferEntity = mapOfferToMenuOfferEntity(
  offer,
  flexibleMenu.id,
  MenuType.FLEXIBLE,
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

  describe('getMenuById', () => {
    it('should get menu by id successfully', async () => {
      const mockRetrieveMenuData = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenuData')
        .mockResolvedValue(menuEntity);
      const result = await target.getMenuById(menu.id);
      expect(mockRetrieveMenuData).toHaveBeenCalledWith(menu.id);
      expect(result).toStrictEqual(menu);
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
      expect(result).toStrictEqual({ ...menu, offers: [offer] });
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
        .mockResolvedValue({ ...flexibleSubMenuEntity, offers: [flexibleSubMenuOfferEntity] });
      const result = await target.getThemedMenuAndOffersBySubMenuId(flexibleSubMenu.id);
      expect(mockRetrieveMenuWithOffers).toHaveBeenCalledWith(flexibleSubMenu.id);
      expect(result).toStrictEqual({ ...flexibleSubMenu, offers: [offer] });
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
      expect(result).toEqual({ [menu.menuType]: [{ ...menu, offers: [offer] }] });
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
      expect(result).toEqual({ [flexibleMenu.menuType]: [{ ...flexibleMenu, subMenus: [flexibleSubMenu] }] });
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

  describe('getMenusByMenuTypes', () => {
    it('should get all menus by default successfully', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveAllTopLevelMenuData')
        .mockResolvedValue([menuEntity, menuOfferEntity, featuredMenuEntity, featuredOfferEntity]);
      jest.spyOn(MenuRepositoryFile, 'groupMenusWithTopLevelData').mockReturnValue([
        { ...menuEntity, offers: [menuOfferEntity] },
        { ...featuredMenuEntity, offers: [featuredOfferEntity] },
        { ...featuredMenuEntity, offers: [featuredOfferEntity] },
      ]);

      const result = await target.getMenusByMenuTypes([]);
      expect(result).toEqual({
        [MenuType.MARKETPLACE]: [{ ...menu, offers: [offer] }],
        [MenuType.FEATURED]: [
          { ...featuredMenu, offers: [offer] },
          { ...featuredMenu, offers: [offer] },
        ],
        [MenuType.FLEXIBLE]: [],
        [MenuType.DEALS_OF_THE_WEEK]: [],
      });
    });

    it('should only return menu types passed successfully', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveAllTopLevelMenuData')
        .mockResolvedValue([menuEntity, menuOfferEntity, featuredMenuEntity, featuredOfferEntity]);
      jest.spyOn(MenuRepositoryFile, 'groupMenusWithTopLevelData').mockReturnValue([
        { ...menuEntity, offers: [menuOfferEntity] },
        { ...featuredMenuEntity, offers: [featuredOfferEntity] },
        { ...featuredMenuEntity, offers: [featuredOfferEntity] },
      ]);

      const result = await target.getMenusByMenuTypes([menu.menuType]);
      expect(result).toEqual({
        [menu.menuType]: [{ ...menu, offers: [offer] }],
      });
    });

    it('should return an empty array for a menu type thats passed', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveAllTopLevelMenuData')
        .mockResolvedValue([menuEntity, menuOfferEntity, featuredMenuEntity, featuredOfferEntity]);
      jest.spyOn(MenuRepositoryFile, 'groupMenusWithTopLevelData').mockReturnValue([
        { ...menuEntity, offers: [menuOfferEntity] },
        { ...featuredMenuEntity, offers: [featuredOfferEntity] },
        { ...featuredMenuEntity, offers: [featuredOfferEntity] },
      ]);

      const result = await target.getMenusByMenuTypes([MenuType.DEALS_OF_THE_WEEK]);
      expect(result).toEqual({
        [MenuType.DEALS_OF_THE_WEEK]: [],
      });
    });

    it('should throw an error when menus by menu types failed to get', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveAllTopLevelMenuData');
      await expect(target.getMenusByMenuTypes([])).rejects.toThrow(`Error occurred retrieving all menus.`);
    });
  });

  describe('updateMenuOfferEntities', () => {
    it('should update menu offer entities with the new offer records but keeping the partition key, sort key & gsi keys', () => {
      const newOfferRecord = offerFactory.build();
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

  describe('groupByMenuType', () => {
    it('should group menu and offers by menu type successfully', () => {
      const menuWithOffers: MenuWithOffers[] = [
        { ...menu, offers: [offer] },
        { ...featuredMenu, offers: [offer] },
        { ...menu, offers: [offer] },
      ];
      const result = target.groupByMenuType(menuWithOffers);
      expect(result).toEqual({
        [menu.menuType]: [
          { ...menu, offers: [offer] },
          { ...menu, offers: [offer] },
        ],
        [featuredMenu.menuType]: [{ ...featuredMenu, offers: [offer] }],
      });
    });
  });

  describe('mapMenuAndDataEntitiesToMenusAndData', () => {
    const menuEntitiesWithTopLevelData = [
      { ...flexibleMenuEntity, subMenus: [flexibleSubMenuEntity] },
      { ...menuEntity, offers: [menuOfferEntity] },
    ];
    it('should map menu and data entities to menus and data successfully', () => {
      const result = target.mapMenuAndDataEntitiesToMenusAndData(menuEntitiesWithTopLevelData);
      expect(result).toStrictEqual([
        { ...flexibleMenu, subMenus: [flexibleSubMenu] },
        { ...menu, offers: [offer] },
      ]);
    });
  });
});
