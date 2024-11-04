import { getEnv } from '@blc-mono/core/utils/getEnv';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { DynamoDBService } from '../../services/DynamoDbService';
import { GSI1_NAME, GSI2_NAME } from '../constants/DynamoDBConstants';
import { MENU_PREFIX, OFFER_PREFIX } from '../constants/PrimaryKeyPrefixes';
import { MenuEntity, MenuEntityWithOfferEntities, MenuKeyBuilders } from '../schemas/MenuEntity';
import { MenuOfferEntity, MenuOfferKeyBuilders } from '../schemas/MenuOfferEntity';

export class MenuRepository {
  private readonly tableName: string;

  constructor() {
    this.tableName = getEnv(DiscoveryStackEnvironmentKeys.MENUS_TABLE_NAME);
  }

  async insert(menuEntity: MenuEntity | MenuOfferEntity): Promise<void> {
    await DynamoDBService.put({
      Item: menuEntity,
      TableName: this.tableName,
    });
  }

  async batchInsert(items: (MenuEntity | MenuOfferEntity)[]): Promise<void> {
    await DynamoDBService.batchInsert(items, this.tableName);
  }

  async batchDelete(items: (MenuEntity | MenuOfferEntity)[]): Promise<void> {
    await DynamoDBService.batchDelete(items, this.tableName);
  }

  async retrieveAllMenusAndOffers(): Promise<(MenuEntity | MenuOfferEntity)[]> {
    const data = await DynamoDBService.scan({ TableName: this.tableName });
    if (!data) {
      return [];
    }
    return data as (MenuEntity | MenuOfferEntity)[];
  }

  async deleteMenuWithOffers(menuId: string): Promise<void> {
    const menuWithOffers = (await DynamoDBService.query({
      KeyConditionExpression: 'partitionKey = :partition_key',
      ExpressionAttributeValues: {
        ':partition_key': MenuKeyBuilders.buildPartitionKey(menuId),
      },
      TableName: this.tableName,
    })) as (MenuEntity | MenuOfferEntity)[];
    await DynamoDBService.batchDelete(menuWithOffers, this.tableName);
  }

  async deleteMenuOffer(menuId: string, offerId: string): Promise<void> {
    await DynamoDBService.delete({
      Key: {
        partitionKey: MenuOfferKeyBuilders.buildPartitionKey(menuId),
        sortKey: MenuOfferKeyBuilders.buildSortKey(offerId),
      },
      TableName: this.tableName,
    });
  }

  async retrieveMenuData(menuId: string): Promise<MenuEntity | undefined> {
    return (await DynamoDBService.get({
      Key: {
        partitionKey: MenuKeyBuilders.buildPartitionKey(menuId),
        sortKey: MenuKeyBuilders.buildSortKey(menuId),
      },
      TableName: this.tableName,
    })) as MenuEntity | undefined;
  }

  async retrieveOffersByMenuId(menuId: string): Promise<MenuOfferEntity[]> {
    return (await DynamoDBService.query({
      KeyConditionExpression: 'partitionKey = :partition_key and begins_with(sortKey, :offer_prefix)',
      ExpressionAttributeValues: {
        ':partition_key': MenuOfferKeyBuilders.buildPartitionKey(menuId),
        ':offer_prefix': OFFER_PREFIX,
      },
      TableName: this.tableName,
    })) as MenuOfferEntity[];
  }

  async retrieveMenuWithOffers(menuId: string): Promise<MenuEntityWithOfferEntities | undefined> {
    const menuWithOffers = (await DynamoDBService.query({
      KeyConditionExpression: 'partitionKey = :partition_key',
      ExpressionAttributeValues: {
        ':partition_key': MenuKeyBuilders.buildPartitionKey(menuId),
      },
      TableName: this.tableName,
    })) as (MenuEntity | MenuOfferEntity)[];
    if (!menuWithOffers || menuWithOffers.length === 0) {
      return undefined;
    }
    const menuAndOffersGrouped = groupMenusWithOffers(menuWithOffers);
    if (menuAndOffersGrouped.length > 1) {
      throw new Error('Retrieving by single menu id has returned more than one menu');
    }
    return menuAndOffersGrouped[0];
  }

  async retrieveMenusWithOffersByMenuType(menuType: string): Promise<MenuEntityWithOfferEntities[]> {
    const menusAndOffers = (await DynamoDBService.query({
      KeyConditionExpression: 'gsi1PartitionKey = :menu_type',
      ExpressionAttributeValues: {
        ':menu_type': MenuKeyBuilders.buildGsi1PartitionKey(menuType),
      },
      IndexName: GSI1_NAME,
      TableName: this.tableName,
    })) as (MenuEntity | MenuOfferEntity)[];
    if (!menusAndOffers || menusAndOffers.length === 0) {
      return [];
    }
    return groupMenusWithOffers(menusAndOffers);
  }

  async getOfferInMenusByOfferId(offerId: string): Promise<MenuOfferEntity[]> {
    return (await DynamoDBService.query({
      TableName: this.tableName,
      KeyConditionExpression: 'gsi2PartitionKey = :offer_id and begins_with(gsi2SortKey, :menu_prefix)',
      IndexName: GSI2_NAME,
      ExpressionAttributeValues: {
        ':offer_id': MenuOfferKeyBuilders.buildGsi1PartitionKey(offerId),
        ':menu_prefix': MENU_PREFIX,
      },
    })) as MenuOfferEntity[];
  }

  async updateMenuOffer(menuOfferEntity: MenuOfferEntity): Promise<void> {
    await DynamoDBService.put({
      TableName: this.tableName,
      Item: menuOfferEntity,
    });
  }

  async deleteOfferFromMenus(offerId: string): Promise<void> {
    const menuOffers = (await DynamoDBService.query({
      IndexName: GSI2_NAME,
      KeyConditionExpression: 'gsi2PartitionKey = :offer_id',
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':offer_id': MenuOfferKeyBuilders.buildGsi2PartitionKey(offerId),
      },
    })) as MenuOfferEntity[];
    return await this.batchDelete(menuOffers);
  }
}

export const groupMenusWithOffers = (
  menusAndOffers: (MenuEntity | MenuOfferEntity)[],
): MenuEntityWithOfferEntities[] => {
  if (menusAndOffers.length === 0) {
    return [];
  }
  const menusAndOffersGrouped = {} as { [partitionKey: string]: { menu?: MenuEntity; offers: MenuOfferEntity[] } };
  menusAndOffers.forEach((item) => {
    if (!menusAndOffersGrouped[item.partitionKey]) {
      if (item.sortKey.startsWith(MENU_PREFIX)) {
        menusAndOffersGrouped[item.partitionKey] = { menu: item as MenuEntity, offers: [] };
      }
      if (item.sortKey.startsWith(OFFER_PREFIX)) {
        menusAndOffersGrouped[item.partitionKey] = { offers: [item as MenuOfferEntity] };
      }
    } else {
      if (item.sortKey.startsWith(OFFER_PREFIX)) {
        menusAndOffersGrouped[item.partitionKey].offers.push(item as MenuOfferEntity);
      }
      if (item.sortKey.startsWith(MENU_PREFIX)) {
        menusAndOffersGrouped[item.partitionKey].menu = item as MenuEntity;
      }
    }
  });
  const menuAndOffersArr = Object.values(menusAndOffersGrouped);
  if (menuAndOffersArr.find((item) => !item.menu)) {
    throw new Error('Offers have been returned without a menu');
  }
  return menuAndOffersArr.map(({ offers, menu }) => ({ ...menu, offers })) as MenuEntityWithOfferEntities[];
};
