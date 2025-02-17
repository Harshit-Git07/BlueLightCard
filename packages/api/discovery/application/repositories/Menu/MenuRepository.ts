import { getEnv } from '@blc-mono/core/utils/getEnv';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { MenuType } from '../../models/MenuResponse';
import { DynamoDBService } from '../../services/DynamoDbService';
import { GSI1_NAME, GSI2_NAME, GSI3_NAME } from '../constants/DynamoDBConstants';
import { EVENT_PREFIX, MENU_PREFIX, OFFER_PREFIX, SUB_MENU_PREFIX } from '../constants/PrimaryKeyPrefixes';
import {
  MenuEntity,
  MenuEntityWithOfferEntities,
  MenuEntityWithSubMenuEntities,
  MenuKeyBuilders,
} from '../schemas/MenuEntity';
import {
  MenuEventEntity,
  MenuEventKeyBuilders,
  MenuOfferEntity,
  MenuOfferKeyBuilders,
} from '../schemas/MenuOfferEntity';
import { SubMenuEntity, SubMenuEntityWithOfferEntities } from '../schemas/SubMenuEntity';

import { isFlexibleMenuType } from './service/mapper/MenuOfferMapper';

type MenuRepositoryEntity = MenuEntity | MenuOfferEntity | SubMenuEntity | MenuEventEntity;

export class MenuRepository {
  private readonly tableName: string;

  constructor() {
    this.tableName = getEnv(DiscoveryStackEnvironmentKeys.MENUS_TABLE_NAME);
  }

  async insert(menuEntity: MenuRepositoryEntity): Promise<void> {
    await DynamoDBService.put({
      Item: menuEntity,
      TableName: this.tableName,
    });
  }

  async batchInsert(items: MenuRepositoryEntity[]): Promise<void> {
    // @ts-expect-error Typescript doesn't like the nested venue object as its not a top level type on MenuOfferEntity
    await DynamoDBService.batchInsert(items, this.tableName);
  }

  async batchDelete(items: MenuRepositoryEntity[]): Promise<void> {
    await DynamoDBService.batchDelete(items, this.tableName);
  }

  async transactWrite(itemsToPut: MenuRepositoryEntity[], itemsToDelete: MenuRepositoryEntity[]): Promise<void> {
    const transactWriteCommandInput = [
      ...itemsToPut.map((item) => ({
        Put: {
          Item: item,
          TableName: this.tableName,
        },
      })),
      ...itemsToDelete.map((item) => ({
        Delete: {
          Key: {
            partitionKey: item.partitionKey,
            sortKey: item.sortKey,
          },
          TableName: this.tableName,
        },
      })),
    ];

    await DynamoDBService.transactWrite({
      TransactItems: transactWriteCommandInput,
    });
  }

  async retrieveAllTopLevelMenuData(): Promise<MenuRepositoryEntity[]> {
    return (
      ((await DynamoDBService.scan({
        TableName: this.tableName,
        IndexName: GSI1_NAME,
      })) as MenuRepositoryEntity[]) ?? []
    );
  }

  async deleteMenuWithSubMenuAndOffers(menuId: string): Promise<void> {
    const menuWithOffers = (await DynamoDBService.query({
      KeyConditionExpression: 'partitionKey = :partition_key',
      ExpressionAttributeValues: {
        ':partition_key': MenuKeyBuilders.buildPartitionKey(menuId),
      },
      TableName: this.tableName,
    })) as MenuRepositoryEntity[];
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

  async deleteThemedMenuOffer(subMenuId: string, offerId: string): Promise<void> {
    const menuOffer = (await DynamoDBService.query({
      KeyConditionExpression: 'gsi2PartitionKey = :gsi2_partition_key and gsi2SortKey = :gsi2_sort_key',
      ExpressionAttributeValues: {
        ':gsi2_partition_key': MenuOfferKeyBuilders.buildGsi2PartitionKey(subMenuId),
        ':gsi2_sort_key': MenuOfferKeyBuilders.buildGsi2SortKey(offerId),
      },
      TableName: this.tableName,
      IndexName: GSI2_NAME,
    })) as MenuOfferEntity[] | undefined;
    if (!menuOffer || menuOffer.length === 0) {
      return;
    }
    await DynamoDBService.delete({
      Key: {
        partitionKey: menuOffer[0].partitionKey,
        sortKey: menuOffer[0].sortKey,
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

  async retrieveThemedMenuWithOffers(subMenuId: string): Promise<SubMenuEntityWithOfferEntities | undefined> {
    const subMenuWithOffers = (await DynamoDBService.query({
      KeyConditionExpression: 'gsi2PartitionKey = :gsi2_partition_key',
      ExpressionAttributeValues: {
        ':gsi2_partition_key': MenuOfferKeyBuilders.buildGsi2PartitionKey(subMenuId),
      },
      IndexName: GSI2_NAME,
      TableName: this.tableName,
    })) as (SubMenuEntity | MenuOfferEntity | MenuEventEntity)[];
    if (!subMenuWithOffers || subMenuWithOffers.length === 0) {
      return undefined;
    }
    const themedMenuAndOffersGrouped = groupThemedMenuWithOffers(subMenuWithOffers);
    if (themedMenuAndOffersGrouped.length > 1) {
      throw new Error('Retrieving by single themed menu id has returned more than one themed menu');
    }
    return themedMenuAndOffersGrouped[0];
  }

  async retrieveMenuWithOffers(menuId: string): Promise<MenuEntityWithOfferEntities | undefined> {
    const menuWithOffers = (await DynamoDBService.query({
      KeyConditionExpression: 'partitionKey = :partition_key',
      ExpressionAttributeValues: {
        ':partition_key': MenuKeyBuilders.buildPartitionKey(menuId),
      },
      TableName: this.tableName,
    })) as (MenuOfferEntity | MenuEntity)[];
    if (!menuWithOffers || menuWithOffers.length === 0) {
      return undefined;
    }
    const menuAndOffersGrouped = groupMenusWithTopLevelData(menuWithOffers) as MenuEntityWithOfferEntities[];
    if (menuAndOffersGrouped.length > 1) {
      throw new Error('Retrieving by single menu id has returned more than one menu');
    }
    return menuAndOffersGrouped[0];
  }

  async retrieveMenusWithOffersByMenuType(menuType: MenuType): Promise<MenuEntityWithOfferEntities[]> {
    const menusAndOffers = (await DynamoDBService.query({
      KeyConditionExpression: 'gsi1PartitionKey = :menu_type',
      ExpressionAttributeValues: {
        ':menu_type': MenuKeyBuilders.buildGsi1PartitionKey(menuType),
      },
      IndexName: GSI1_NAME,
      TableName: this.tableName,
    })) as (MenuOfferEntity | MenuEntity)[];
    if (!menusAndOffers || menusAndOffers.length === 0) {
      return [];
    }
    return groupMenusWithTopLevelData(menusAndOffers) as MenuEntityWithOfferEntities[];
  }

  async retrieveThemedMenusWithSubMenus(menuType: MenuType): Promise<MenuEntityWithSubMenuEntities[]> {
    const menusAndSubMenus = (await DynamoDBService.query({
      KeyConditionExpression: 'gsi1PartitionKey = :menu_type',
      ExpressionAttributeValues: {
        ':menu_type': MenuKeyBuilders.buildGsi1PartitionKey(menuType),
      },
      IndexName: GSI1_NAME,
      TableName: this.tableName,
    })) as (SubMenuEntity | MenuEntity)[];
    if (!menusAndSubMenus || menusAndSubMenus.length === 0) {
      return [];
    }
    return groupMenusWithTopLevelData(menusAndSubMenus) as MenuEntityWithSubMenuEntities[];
  }

  async getOfferInMenusByOfferId(offerId: string): Promise<MenuOfferEntity[]> {
    return (await DynamoDBService.query({
      TableName: this.tableName,
      KeyConditionExpression: 'gsi3PartitionKey = :offer_id and begins_with(gsi3SortKey, :menu_prefix)',
      IndexName: GSI3_NAME,
      ExpressionAttributeValues: {
        ':offer_id': MenuOfferKeyBuilders.buildGsi3PartitionKey(offerId),
        ':menu_prefix': MENU_PREFIX,
      },
    })) as MenuOfferEntity[];
  }

  async getEventInMenusByEventId(eventId: string): Promise<MenuEventEntity[]> {
    return (await DynamoDBService.query({
      TableName: this.tableName,
      KeyConditionExpression: 'gsi3PartitionKey = :event_id and begins_with(gsi3SortKey, :menu_prefix)',
      IndexName: GSI3_NAME,
      ExpressionAttributeValues: {
        ':event_id': MenuEventKeyBuilders.buildGsi3PartitionKey(eventId),
        ':menu_prefix': MENU_PREFIX,
      },
    })) as MenuEventEntity[];
  }

  async updateMenuOffer(menuOfferEntity: MenuOfferEntity): Promise<void> {
    await DynamoDBService.put({
      TableName: this.tableName,
      Item: menuOfferEntity,
    });
  }

  async deleteOfferFromMenus(offerId: string): Promise<void> {
    const menuOffers = (await DynamoDBService.query({
      IndexName: GSI3_NAME,
      KeyConditionExpression: 'gsi3PartitionKey = :offer_id',
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':offer_id': MenuOfferKeyBuilders.buildGsi3PartitionKey(offerId),
      },
    })) as MenuOfferEntity[];
    return await this.batchDelete(menuOffers);
  }
}

export const groupMenusWithTopLevelData = (
  menusWithTopLevelData: MenuRepositoryEntity[],
): (MenuEntityWithOfferEntities | MenuEntityWithSubMenuEntities)[] => {
  if (menusWithTopLevelData.length === 0) {
    return [];
  }
  const menuAndSubItemsGrouped = {} as {
    [partitionKey: string]: { menu?: MenuEntity; items: (MenuOfferEntity | SubMenuEntity)[] };
  };
  menusWithTopLevelData.forEach((item) => {
    if (!menuAndSubItemsGrouped[item.partitionKey]) {
      if (item.sortKey.startsWith(MENU_PREFIX)) {
        menuAndSubItemsGrouped[item.partitionKey] = { menu: item as MenuEntity, items: [] };
      }
      if (item.sortKey.startsWith(OFFER_PREFIX) || item.sortKey.startsWith(SUB_MENU_PREFIX)) {
        menuAndSubItemsGrouped[item.partitionKey] = { items: [item as MenuOfferEntity | SubMenuEntity] };
      }
    } else {
      if (item.sortKey.startsWith(OFFER_PREFIX) || item.sortKey.startsWith(SUB_MENU_PREFIX)) {
        menuAndSubItemsGrouped[item.partitionKey].items.push(item as MenuOfferEntity | SubMenuEntity);
      }
      if (item.sortKey.startsWith(MENU_PREFIX)) {
        menuAndSubItemsGrouped[item.partitionKey].menu = item as MenuEntity;
      }
    }
  });
  const menuAndItemsArr = Object.values(menuAndSubItemsGrouped);
  if (menuAndItemsArr.find((item) => !item.menu)) {
    throw new Error('Offers have been returned without a menu');
  }
  return menuAndItemsArr.map(({ items, menu }) => {
    if (menu?.menuType && isFlexibleMenuType(menu.menuType)) {
      return { ...menu, subMenus: items } as MenuEntityWithSubMenuEntities;
    } else {
      return { ...menu, offers: items } as MenuEntityWithOfferEntities;
    }
  });
};

export const groupThemedMenuWithOffers = (
  themedMenuWithOffers: (SubMenuEntity | MenuOfferEntity | MenuEventEntity)[],
): SubMenuEntityWithOfferEntities[] => {
  const menuAndOffersGrouped = {} as {
    [gsi2PartitionKey: string]: { subMenu?: SubMenuEntity; offers: MenuOfferEntity[]; events: MenuEventEntity[] };
  };
  themedMenuWithOffers.forEach((item) => {
    if (!item.gsi2PartitionKey || !item.gsi2SortKey) {
      throw new Error('Themed menu offer called with undefined gsi2PartitionKey/gsi2SortKey');
    }
    if (!menuAndOffersGrouped[item.gsi2PartitionKey]) {
      if (item.gsi2SortKey.startsWith(SUB_MENU_PREFIX)) {
        menuAndOffersGrouped[item.gsi2PartitionKey] = { subMenu: item as SubMenuEntity, offers: [], events: [] };
      }
      if (item.gsi2SortKey.startsWith(OFFER_PREFIX)) {
        menuAndOffersGrouped[item.gsi2PartitionKey] = { offers: [item as MenuOfferEntity], events: [] };
      }
      if (item.gsi2SortKey.startsWith(EVENT_PREFIX)) {
        menuAndOffersGrouped[item.gsi2PartitionKey] = { offers: [], events: [item as MenuEventEntity] };
      }
    } else {
      if (item.gsi2SortKey.startsWith(SUB_MENU_PREFIX)) {
        menuAndOffersGrouped[item.gsi2PartitionKey].subMenu = item as SubMenuEntity;
      }
      if (item.gsi2SortKey.startsWith(OFFER_PREFIX)) {
        menuAndOffersGrouped[item.gsi2PartitionKey].offers.push(item as MenuOfferEntity);
      }
      if (item.gsi2SortKey.startsWith(EVENT_PREFIX)) {
        menuAndOffersGrouped[item.gsi2PartitionKey].events.push(item as MenuEventEntity);
      }
    }
  });
  const menuAndOffersArr = Object.values(menuAndOffersGrouped);
  if (menuAndOffersArr.find((item) => !item.subMenu)) {
    throw new Error('Offers have been returned without a themed menu');
  }
  return menuAndOffersArr.map(({ offers, events, subMenu }) => ({
    ...subMenu,
    events,
    offers,
  })) as SubMenuEntityWithOfferEntities[];
};
