import { menuFactory } from '@blc-mono/discovery/application/factories/MenuFactory';
import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { MenuWithOffers } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import * as MenuRepositoryFile from '@blc-mono/discovery/application/repositories/Menu/MenuRepository';

import { mapMenuToMenuEntity } from './mapper/MenuMapper';
import { mapOfferToMenuOfferEntity } from './mapper/MenuOfferMapper';
import * as target from './MenuService';

jest.mock('@blc-mono/discovery/application/repositories/Menu/MenuRepository');

const menu = menuFactory.build();
const offer = offerFactory.build();
const menuEntity = mapMenuToMenuEntity(menu);
const menuOfferEntity = mapOfferToMenuOfferEntity(offer, menu.id, menu.menuType);
const featuredMenu = { ...menu, menuType: MenuType.FEATURED, id: '1234' };
const featuredMenuEntity = mapMenuToMenuEntity(featuredMenu);
const featuredOfferEntity = mapOfferToMenuOfferEntity(offer, featuredMenu.id, featuredMenu.menuType);

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

  describe('deleteMenuWithOffers', () => {
    it('should delete menu with offers successfully', async () => {
      const mockDelete = jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'deleteMenuWithOffers')
        .mockResolvedValue();
      await target.deleteMenuWithOffers(menu.id);
      expect(mockDelete).toHaveBeenCalledWith(menu.id);
    });

    it('should throw error when menu with offers failed to delete', async () => {
      givenMenuOfferRepositoryThrowsAnError('deleteMenuWithOffers');
      await expect(target.deleteMenuWithOffers(menu.id)).rejects.toThrow(
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
    it('should get menus by menu type successfully', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveMenusWithOffersByMenuType')
        .mockResolvedValue([{ ...menuEntity, offers: [menuOfferEntity] }]);
      const result = await target.getMenusByMenuType(menu.menuType);
      expect(result).toEqual({ [menu.menuType]: [{ ...menu, offers: [offer] }] });
    });

    it('should throw error when menus by menu type failed to get', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveMenusWithOffersByMenuType');
      await expect(target.getMenusByMenuType(menu.menuType)).rejects.toThrow(
        `Error occurred getting menu with menu type: [${menu.menuType}]`,
      );
    });
  });

  describe('getMenusByMenuTypes', () => {
    it('should get all menus by default successfully', async () => {
      jest
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveAllMenusAndOffers')
        .mockResolvedValue([menuEntity, menuOfferEntity, featuredMenuEntity, featuredOfferEntity]);
      jest.spyOn(MenuRepositoryFile, 'groupMenusWithOffers').mockReturnValue([
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
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveAllMenusAndOffers')
        .mockResolvedValue([menuEntity, menuOfferEntity, featuredMenuEntity, featuredOfferEntity]);
      jest.spyOn(MenuRepositoryFile, 'groupMenusWithOffers').mockReturnValue([
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
        .spyOn(MenuRepositoryFile.MenuRepository.prototype, 'retrieveAllMenusAndOffers')
        .mockResolvedValue([menuEntity, menuOfferEntity, featuredMenuEntity, featuredOfferEntity]);
      jest.spyOn(MenuRepositoryFile, 'groupMenusWithOffers').mockReturnValue([
        { ...menuEntity, offers: [menuOfferEntity] },
        { ...featuredMenuEntity, offers: [featuredOfferEntity] },
        { ...featuredMenuEntity, offers: [featuredOfferEntity] },
      ]);

      const result = await target.getMenusByMenuTypes(['dealsOfTheWeek']);
      expect(result).toEqual({
        ['dealsOfTheWeek']: [],
      });
    });

    it('should throw an error when menus by menu types failed to get', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveAllMenusAndOffers');
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
          ...newOfferRecord,
        },
      ]);
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
});
