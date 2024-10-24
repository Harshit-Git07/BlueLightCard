import { getEnv } from '@blc-mono/core/utils/getEnv';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { DynamoDBService } from '../../services/DynamoDbService';
import { GSI1_NAME } from '../constants/DynamoDBConstants';
import { MENU_PREFIX, OFFER_PREFIX } from '../constants/PrimaryKeyPrefixes';
import { MenuEntity, MenuKeyBuilders } from '../schemas/MenuEntity';
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

  async deleteMenuWithOffers(menuId: string): Promise<void> {
    const menuWithOffers = (await DynamoDBService.get({
      Key: {
        partitionKey: MenuKeyBuilders.buildPartitionKey(menuId),
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

  async retrieveMenuData(menuId: string): Promise<MenuEntity> {
    return (await DynamoDBService.get({
      Key: {
        partitionKey: MenuKeyBuilders.buildPartitionKey(menuId),
        sortKey: MenuKeyBuilders.buildSortKey(menuId),
      },
      TableName: this.tableName,
    })) as MenuEntity;
  }

  async retrieveOffersByMenuId(menuId: string): Promise<MenuOfferEntity[]> {
    return (await DynamoDBService.query({
      KeyConditionExpression: 'partionKey = :partion_key and begins_with(sortKey, :offer_prefix)',
      ExpressionAttributeValues: {
        partition_key: MenuOfferKeyBuilders.buildPartitionKey(menuId),
        offer_prefix: OFFER_PREFIX,
      },
      TableName: this.tableName,
    })) as MenuOfferEntity[];
  }

  async retrieveMenuWithOffers(menuId: string): Promise<{ menu: MenuEntity; offers: MenuOfferEntity[] }> {
    const menuWithOffers = (await DynamoDBService.get({
      Key: {
        partitionKey: MenuKeyBuilders.buildPartitionKey(menuId),
      },
      TableName: this.tableName,
    })) as (MenuEntity | MenuOfferEntity)[];
    let menu: MenuEntity | undefined;
    const offers: MenuOfferEntity[] = [];
    menuWithOffers.forEach((item) => {
      if (item.sortKey.startsWith(MENU_PREFIX)) {
        menu = item as MenuEntity;
      } else {
        offers.push(item as MenuOfferEntity);
      }
    });
    if (!menu) {
      throw new Error(`Menu not found with id: ${menuId}`);
    }
    return { menu, offers };
  }

  async getOfferInMenusByOfferId(offerId: string): Promise<MenuOfferEntity[]> {
    return (await DynamoDBService.query({
      TableName: this.tableName,
      KeyConditionExpression: 'gsi1PartitionKey = :offer_id and begins_with(gsi1SortKey, :menu_prefix)',
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
      IndexName: GSI1_NAME,
      KeyConditionExpression: 'gsi1PartitionKey = :offer_id',
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':offer_id': MenuOfferKeyBuilders.buildGsi1PartitionKey(offerId),
      },
    })) as MenuOfferEntity[];
    return await this.batchDelete(menuOffers);
  }
}
