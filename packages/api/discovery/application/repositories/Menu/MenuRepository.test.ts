import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';

import { menuEntityFactory } from '../../factories/MenuEntityFactory';
import { menuOfferEntityFactory } from '../../factories/MenuOfferEntityFactory';
import { DYNAMODB_MAX_BATCH_WRITE_SIZE, GSI1_NAME, GSI2_NAME } from '../constants/DynamoDBConstants';
import { MENU_PREFIX, OFFER_PREFIX } from '../constants/PrimaryKeyPrefixes';
import { MenuKeyBuilders } from '../schemas/MenuEntity';
import { MenuOfferKeyBuilders } from '../schemas/MenuOfferEntity';

import { groupMenusWithOffers, MenuRepository } from './MenuRepository';

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
    return menuOfferEntityFactory.buildList(DYNAMODB_MAX_BATCH_WRITE_SIZE);
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
  const mockScan = jest.fn();

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

  describe('retrieveAllMenusAndOffers', () => {
    DynamoDBService.scan = mockScan;
    it('should call scan method with correct parameters', async () => {
      mockScan.mockResolvedValue([menuEntity, menuOfferEntity]);

      const result = await new MenuRepository().retrieveAllMenusAndOffers();

      expect(mockScan).toHaveBeenCalledWith({ TableName: 'menus-table' });
      expect(result).toEqual([menuEntity, menuOfferEntity]);
    });

    it('should return back an empty array if no data is returned', async () => {
      mockScan.mockResolvedValue(undefined);

      const result = await new MenuRepository().retrieveAllMenusAndOffers();

      expect(mockScan).toHaveBeenCalledWith({ TableName: 'menus-table' });
      expect(result).toEqual([]);
    });
  });

  describe('deleteMenu', () => {
    DynamoDBService.batchDelete = mockBatchDelete;
    DynamoDBService.query = mockQuery;
    it('should call "Query" and "batchDelete" method with correct parameters', async () => {
      mockQuery.mockResolvedValue([menuEntity, menuOfferEntity]);

      await new MenuRepository().deleteMenuWithOffers(menuEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'partitionKey = :partition_key',
        ExpressionAttributeValues: {
          ':partition_key': menuEntity.partitionKey,
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
      mockQuery.mockResolvedValue([menuOfferEntity]);

      const result = await new MenuRepository().retrieveOffersByMenuId(menuEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'partitionKey = :partition_key and begins_with(sortKey, :offer_prefix)',
        ExpressionAttributeValues: {
          ':partition_key': MenuOfferKeyBuilders.buildPartitionKey(menuEntity.id),
          ':offer_prefix': OFFER_PREFIX,
        },
        TableName: 'menus-table',
      });
      expect(result).toEqual([menuOfferEntity]);
    });
  });

  describe('retrieveMenuWithOffers', () => {
    DynamoDBService.query = mockQuery;
    it('should call "Query" method with correct parameters and return the values separated', async () => {
      mockQuery.mockResolvedValue([menuEntity, menuOfferEntity]);

      const result = await new MenuRepository().retrieveMenuWithOffers(menuEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'partitionKey = :partition_key',
        ExpressionAttributeValues: {
          ':partition_key': menuEntity.partitionKey,
        },
        TableName: 'menus-table',
      });
      expect(result).toEqual({ ...menuEntity, offers: [menuOfferEntity] });
    });

    it('should return undefined if no data is found', async () => {
      mockQuery.mockResolvedValue(undefined);
      const result = await new MenuRepository().retrieveMenuWithOffers(menuEntity.id);
      expect(result).toBeUndefined();
    });

    it('should return undefined if an empty array is returned', async () => {
      mockQuery.mockResolvedValue([]);
      const result = await new MenuRepository().retrieveMenuWithOffers(menuEntity.id);
      expect(result).toBeUndefined();
    });

    it('should throw an error if more than one menu entity comes back from the db', async () => {
      mockQuery.mockResolvedValue([menuEntity, menuOfferEntity, { ...menuEntity, partitionKey: '2' }]);

      await expect(new MenuRepository().retrieveMenuWithOffers(menuEntity.id)).rejects.toThrow(
        'Retrieving by single menu id has returned more than one menu',
      );
    });
  });

  describe('retriveMenusWithOffersByMenuType', () => {
    DynamoDBService.query = mockQuery;
    it('should call "Query" method with correct parameters', async () => {
      mockQuery.mockResolvedValue([menuEntity, menuOfferEntity]);
      const result = await new MenuRepository().retrieveMenusWithOffersByMenuType(menuEntity.menuType);
      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'gsi1PartitionKey = :menu_type',
        ExpressionAttributeValues: {
          ':menu_type': MenuKeyBuilders.buildGsi1PartitionKey(menuEntity.menuType),
        },
        IndexName: GSI1_NAME,
        TableName: 'menus-table',
      });
      expect(result).toEqual([{ ...menuEntity, offers: [menuOfferEntity] }]);
    });

    it('should return an empty array if no data is returned', async () => {
      mockQuery.mockResolvedValue([]);
      const result = await new MenuRepository().retrieveMenusWithOffersByMenuType(menuEntity.menuType);
      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'gsi1PartitionKey = :menu_type',
        ExpressionAttributeValues: {
          ':menu_type': MenuKeyBuilders.buildGsi1PartitionKey(menuEntity.menuType),
        },
        IndexName: GSI1_NAME,
        TableName: 'menus-table',
      });
      expect(result).toEqual([]);
    });

    it('should return an empty array if undefined is returned', async () => {
      mockQuery.mockResolvedValue(undefined);
      const result = await new MenuRepository().retrieveMenusWithOffersByMenuType(menuEntity.menuType);
      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'gsi1PartitionKey = :menu_type',
        ExpressionAttributeValues: {
          ':menu_type': MenuKeyBuilders.buildGsi1PartitionKey(menuEntity.menuType),
        },
        IndexName: GSI1_NAME,
        TableName: 'menus-table',
      });
      expect(result).toEqual([]);
    });
  });

  describe('getOfferInMenusByOfferId', () => {
    it('should call "Query" method with correct parameters', async () => {
      DynamoDBService.query = mockQuery;
      mockQuery.mockResolvedValue([menuOfferEntity]);

      const result = await new MenuRepository().getOfferInMenusByOfferId(menuOfferEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        TableName: 'menus-table',
        IndexName: GSI2_NAME,
        KeyConditionExpression: 'gsi2PartitionKey = :offer_id and begins_with(gsi2SortKey, :menu_prefix)',
        ExpressionAttributeValues: {
          ':offer_id': MenuOfferKeyBuilders.buildGsi1PartitionKey(menuOfferEntity.id),
          ':menu_prefix': MENU_PREFIX,
        },
      });
      expect(result).toEqual([menuOfferEntity]);
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
        IndexName: GSI2_NAME,
        KeyConditionExpression: 'gsi2PartitionKey = :offer_id',
        TableName: 'menus-table',
        ExpressionAttributeValues: {
          ':offer_id': MenuOfferKeyBuilders.buildGsi2PartitionKey(menuOfferEntity.id),
        },
      });

      expect(mockBatchDelete).toHaveBeenCalledWith([menuOfferEntity], 'menus-table');
    });
  });

  describe('groupMenusWithOffers', () => {
    const secondMenuEntity = menuEntityFactory.build({ partitionKey: MenuKeyBuilders.buildPartitionKey('2') });
    const testCases = [
      {
        menusAndOffers: [menuEntity, menuOfferEntity],
        expected: [{ ...menuEntity, offers: [menuOfferEntity] }],
      },
      {
        menusAndOffers: [menuOfferEntity, menuOfferEntity, menuEntity],
        expected: [{ ...menuEntity, offers: [menuOfferEntity, menuOfferEntity] }],
      },
      {
        menusAndOffers: [menuEntity, menuOfferEntity, secondMenuEntity],
        expected: [
          { ...menuEntity, offers: [menuOfferEntity] },
          { ...secondMenuEntity, offers: [] },
        ],
      },
      {
        menusAndOffers: [],
        expected: [],
      },
    ];
    it.each(testCases)('should return back the correct grouped menus and offers', (testCase) => {
      const result = groupMenusWithOffers(testCase.menusAndOffers);
      expect(result).toEqual(testCase.expected);
    });

    const testCasesWithInvalidData = [
      {
        menusAndOffers: [menuOfferEntity],
      },
      {
        menusAndOffers: [menuEntity, ...menuOfferEntities],
      },
    ];
    it.each(testCasesWithInvalidData)(
      'should throw an error if a menu offer is passed without a menu',
      ({ menusAndOffers }) => {
        expect(() => groupMenusWithOffers(menusAndOffers)).toThrow('Offers have been returned without a menu');
      },
    );
  });
});
