import { homepageMenuFactory } from '@blc-mono/discovery/application/factories/HomepageMenuFactory';
import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { MenuRepository } from '@blc-mono/discovery/application/repositories/Menu/MenuRepository';

import { mapHomepageMenuToMenuEntity } from './mapper/MenuMapper';
import { mapOfferToMenuOfferEntity } from './mapper/MenuOfferMapper';
import * as target from './MenuService';

jest.mock('@blc-mono/discovery/application/repositories/Menu/MenuRepository');

const homePageMenu = homepageMenuFactory.build();
const offer = offerFactory.build();
const menuEntity = mapHomepageMenuToMenuEntity(homePageMenu);
const menuOfferEntity = mapOfferToMenuOfferEntity(offer, homePageMenu.id);

const givenMenuOfferRepositoryThrowsAnError = (method: keyof MenuRepository) => {
  jest.spyOn(MenuRepository.prototype, method).mockRejectedValue(new Error('DynamoDB error'));
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
      const mockInsert = jest.spyOn(MenuRepository.prototype, 'batchInsert').mockResolvedValue();
      await target.insertMenuWithOffers(homePageMenu, [offer]);
      expect(mockInsert).toHaveBeenCalledWith([menuEntity, menuOfferEntity]);
    });

    it('should throw error when an menu or menu offer failed to insert', async () => {
      givenMenuOfferRepositoryThrowsAnError('batchInsert');
      await expect(target.insertMenuWithOffers(homePageMenu, [offer])).rejects.toThrow(
        `Error occurred inserting menu with offers as batch, amount: [2]`,
      );
    });
  });

  describe('deleteMenuWithOffers', () => {
    it('should delete menu with offers successfully', async () => {
      const mockDelete = jest.spyOn(MenuRepository.prototype, 'deleteMenuWithOffers').mockResolvedValue();
      await target.deleteMenuWithOffers(homePageMenu.id);
      expect(mockDelete).toHaveBeenCalledWith(homePageMenu.id);
    });

    it('should throw error when menu with offers failed to delete', async () => {
      givenMenuOfferRepositoryThrowsAnError('deleteMenuWithOffers');
      await expect(target.deleteMenuWithOffers(homePageMenu.id)).rejects.toThrow(
        `Error occurred deleting menu with id: [${homePageMenu.id}]`,
      );
    });
  });

  describe('getMenuById', () => {
    it('should get menu by id successfully', async () => {
      const mockRetrieveMenuData = jest
        .spyOn(MenuRepository.prototype, 'retrieveMenuData')
        .mockResolvedValue(menuEntity);
      await target.getMenuById(homePageMenu.id);
      expect(mockRetrieveMenuData).toHaveBeenCalledWith(homePageMenu.id);
    });

    it('should throw error when menu failed to get by id', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveMenuData');
      await expect(target.getMenuById(homePageMenu.id)).rejects.toThrow(
        `Error occurred getting menu with id: [${homePageMenu.id}]`,
      );
    });
  });

  describe('getMenuAndOffersByMenuId', () => {
    it('should get menu and its offers by id successfully', async () => {
      const mockRetrieveMenuWithOffers = jest
        .spyOn(MenuRepository.prototype, 'retrieveMenuWithOffers')
        .mockResolvedValue({
          menu: menuEntity,
          offers: [menuOfferEntity],
        });
      await target.getMenuAndOffersByMenuId(homePageMenu.id);
      expect(mockRetrieveMenuWithOffers).toHaveBeenCalledWith(homePageMenu.id);
    });

    it('should throw error when menu and its offers failed to get by id', async () => {
      givenMenuOfferRepositoryThrowsAnError('retrieveMenuWithOffers');
      await expect(target.getMenuAndOffersByMenuId(homePageMenu.id)).rejects.toThrow(
        `Error occurred getting menu with id: [${homePageMenu.id}] and its offers`,
      );
    });
  });

  describe('updateOfferInMenus', () => {
    it('should successfully update an offer if in one menu', async () => {
      const mockGetOfferInMenusByOfferId = jest
        .spyOn(MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([menuOfferEntity]);

      const mockInsert = jest.spyOn(MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest.spyOn(MenuRepository.prototype, 'batchInsert').mockResolvedValue();
      await target.updateOfferInMenus(offer);

      expect(mockGetOfferInMenusByOfferId).toHaveBeenCalledWith(offer.id);
      expect(mockInsert).toHaveBeenCalledWith(menuOfferEntity);
      expect(mockBatchInsert).not.toHaveBeenCalled();
    });

    it('should successfully update an offer in more than one menu', async () => {
      const mockGetOfferInMenusByOfferId = jest
        .spyOn(MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([menuOfferEntity, menuOfferEntity]);

      const mockInsert = jest.spyOn(MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest.spyOn(MenuRepository.prototype, 'batchInsert').mockResolvedValue();
      await target.updateOfferInMenus(offer);

      expect(mockGetOfferInMenusByOfferId).toHaveBeenCalledWith(offer.id);
      expect(mockInsert).not.toHaveBeenCalled();
      expect(mockBatchInsert).toHaveBeenCalledWith([menuOfferEntity, menuOfferEntity]);
    });

    it('should ignore updating an offer if it does not exist in any menu', async () => {
      const mockGetOfferInMenusByOfferId = jest
        .spyOn(MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([]);

      const mockInsert = jest.spyOn(MenuRepository.prototype, 'insert').mockResolvedValue();
      const mockBatchInsert = jest.spyOn(MenuRepository.prototype, 'batchInsert').mockResolvedValue();
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
        .spyOn(MenuRepository.prototype, 'getOfferInMenusByOfferId')
        .mockResolvedValue([menuOfferEntity, menuOfferEntity]);
      givenMenuOfferRepositoryThrowsAnError('batchInsert');
      await expect(target.updateOfferInMenus(offer)).rejects.toThrow(
        `Error occurred updating offers in menu for offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
    });

    it('should throw an error if an error occurs whilst performing a single insert', async () => {
      jest.spyOn(MenuRepository.prototype, 'getOfferInMenusByOfferId').mockResolvedValue([menuOfferEntity]);
      givenMenuOfferRepositoryThrowsAnError('insert');
      await expect(target.updateOfferInMenus(offer)).rejects.toThrow(
        `Error occurred updating offers in menu for offer with id: [${offer.id}]: [Error: DynamoDB error]`,
      );
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
          ...newOfferRecord,
        },
      ]);
    });
  });
});
