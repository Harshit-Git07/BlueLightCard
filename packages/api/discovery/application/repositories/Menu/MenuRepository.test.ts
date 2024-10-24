import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';

import { menuEntityFactory } from '../../factories/MenuEntityFactory';
import { menuOfferEntityFactory } from '../../factories/MenuOfferEntityFactory';
import { DYNAMODB_MAX_BATCH_SIZE, GSI1_NAME } from '../constants/DynamoDBConstants';
import { MENU_PREFIX, OFFER_PREFIX } from '../constants/PrimaryKeyPrefixes';
import { MenuOfferKeyBuilders } from '../schemas/MenuOfferEntity';

import { MenuRepository } from './MenuRepository';

jest.mock('@blc-mono/discovery/application/services/DynamoDbService');

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

const menuEntity = menuEntityFactory.build();
const menuOfferEntity = menuOfferEntityFactory.build();
const menuOfferEntities = menuOfferEntityFactory.buildList(3);

describe('Menu Repository', () => {
  const createBatchOfMenuAndOffers = () => {
    return menuOfferEntityFactory.buildList(DYNAMODB_MAX_BATCH_SIZE);
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const mockSave = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockBatchInsert = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockBatchDelete = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockDelete = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockGet = jest.fn();
  const mockQuery = jest.fn();

  describe('insert', () => {
    DynamoDBService.put = mockSave;
    it('should call "Put" method with correct parameters when passed a menuOfferEntity', async () => {
      await new MenuRepository().insert(menuOfferEntity);

      expect(mockSave).toHaveBeenCalledWith({
        Item: menuOfferEntity,
        TableName: 'menus-table',
      });
    });

    it('should call "Put" method with correct parameters when passed a menuEntity', async () => {
      await new MenuRepository().insert(menuEntity);

      expect(mockSave).toHaveBeenCalledWith({
        Item: menuEntity,
        TableName: 'menus-table',
      });
    });
  });

  describe('batchInsert', () => {
    DynamoDBService.batchInsert = mockBatchInsert;
    it('should call "BatchWrite" method with correct parameters, and the correct number of times', async () => {
      const items = createBatchOfMenuAndOffers();

      await new MenuRepository().batchInsert(items);

      expect(mockBatchInsert).toHaveBeenCalled();
      expect(mockBatchInsert).toHaveBeenCalledWith(items, 'menus-table');
    });
  });

  describe('batchDelete', () => {
    DynamoDBService.batchDelete = mockBatchDelete;
    it('should call "BatchWrite" method with correct parameters, and the correct number of times', async () => {
      const items = createBatchOfMenuAndOffers();

      await new MenuRepository().batchDelete(items);

      expect(mockBatchDelete).toHaveBeenCalled();
      expect(mockBatchDelete).toHaveBeenCalledWith(items, 'menus-table');
    });
  });

  describe('deleteMenu', () => {
    DynamoDBService.batchDelete = mockBatchDelete;
    DynamoDBService.get = mockGet;
    it('should call "Get" and "batchDelete" method with correct parameters', async () => {
      mockGet.mockResolvedValue([menuEntity, menuOfferEntity]);

      await new MenuRepository().deleteMenuWithOffers(menuEntity.id);

      expect(mockGet).toHaveBeenCalledWith({
        Key: {
          partitionKey: menuEntity.partitionKey,
        },
        TableName: 'menus-table',
      });
      expect(mockBatchDelete).toHaveBeenCalledWith([menuEntity, menuOfferEntity], 'menus-table');
    });
  });

  describe('deleteMenuOffer', () => {
    it('should call "Delete" method with correct parameters', async () => {
      DynamoDBService.delete = mockDelete;

      await new MenuRepository().deleteMenuOffer(menuOfferEntity.id, menuEntity.id);

      expect(mockDelete).toHaveBeenCalledWith({
        Key: {
          partitionKey: MenuOfferKeyBuilders.buildPartitionKey(menuEntity.id),
          sortKey: menuOfferEntity.sortKey,
        },
        TableName: 'menus-table',
      });
    });
  });

  describe('retrieveMenuData', () => {
    DynamoDBService.get = mockGet;
    it('should call "Get" method with correct parameters', async () => {
      mockGet.mockResolvedValue(menuEntity);

      const result = await new MenuRepository().retrieveMenuData(menuEntity.id);

      expect(mockGet).toHaveBeenCalledWith({
        Key: {
          partitionKey: menuEntity.partitionKey,
          sortKey: menuEntity.sortKey,
        },
        TableName: 'menus-table',
      });
      expect(result).toEqual(menuEntity);
    });
  });

  describe('retrieveOffersByMenuId', () => {
    DynamoDBService.query = mockQuery;
    it('should call "Query" method with correct parameters', async () => {
      mockQuery.mockResolvedValue(menuOfferEntities);

      const result = await new MenuRepository().retrieveOffersByMenuId(menuEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'partionKey = :partion_key and begins_with(sortKey, :offer_prefix)',
        ExpressionAttributeValues: {
          partition_key: MenuOfferKeyBuilders.buildPartitionKey(menuEntity.id),
          offer_prefix: OFFER_PREFIX,
        },
        TableName: 'menus-table',
      });
      expect(result).toEqual(menuOfferEntities);
    });
  });

  describe('retrieveMenuWithOffers', () => {
    DynamoDBService.get = mockGet;
    it('should call "Get" method with correct parameters and return the values separated', async () => {
      mockGet.mockResolvedValue([menuEntity, ...menuOfferEntities]);

      const result = await new MenuRepository().retrieveMenuWithOffers(menuEntity.id);

      expect(mockGet).toHaveBeenCalledWith({
        Key: {
          partitionKey: menuEntity.partitionKey,
        },
        TableName: 'menus-table',
      });
      expect(result).toEqual({ menu: menuEntity, offers: menuOfferEntities });
    });

    it('should throw an error if no menu entity is found with the menu id passed to it', async () => {
      mockGet.mockResolvedValue(menuOfferEntities);

      await expect(new MenuRepository().retrieveMenuWithOffers('menuId')).rejects.toThrow(
        `Menu not found with id: menuId`,
      );
    });
  });

  describe('getOfferInMenusByOfferId', () => {
    it('should call "Query" method with correct parameters', async () => {
      DynamoDBService.query = mockQuery;
      mockQuery.mockResolvedValue(menuOfferEntities);

      const result = await new MenuRepository().getOfferInMenusByOfferId(menuOfferEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        TableName: 'menus-table',
        KeyConditionExpression: 'gsi1PartitionKey = :offer_id and begins_with(gsi1SortKey, :menu_prefix)',
        ExpressionAttributeValues: {
          ':offer_id': MenuOfferKeyBuilders.buildGsi1PartitionKey(menuOfferEntity.id),
          ':menu_prefix': MENU_PREFIX,
        },
      });
      expect(result).toEqual(menuOfferEntities);
    });
  });

  describe('updateMenuOffer', () => {
    DynamoDBService.put = mockSave;
    it('should call "Put" method with correct parameters', async () => {
      await new MenuRepository().updateMenuOffer(menuOfferEntity);

      expect(mockSave).toHaveBeenCalledWith({
        TableName: 'menus-table',
        Item: menuOfferEntity,
      });
    });
  });

  describe('deleteOfferFromMenu', () => {
    DynamoDBService.query = mockQuery;
    DynamoDBService.batchDelete = mockBatchDelete;

    it('should call "Delete" method with correct parameters', async () => {
      mockQuery.mockResolvedValue([menuOfferEntity]);

      await new MenuRepository().deleteOfferFromMenus(menuOfferEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        IndexName: GSI1_NAME,
        KeyConditionExpression: 'gsi1PartitionKey = :offer_id',
        TableName: 'menus-table',
        ExpressionAttributeValues: {
          ':offer_id': MenuOfferKeyBuilders.buildGsi1PartitionKey(menuOfferEntity.id),
        },
      });

      expect(mockBatchDelete).toHaveBeenCalledWith([menuOfferEntity], 'menus-table');
    });
  });
});
