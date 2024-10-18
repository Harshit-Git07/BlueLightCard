import { HomepageMenu } from '@blc-mono/discovery/application/models/HomepageMenu';
import { MenuEntity, MenuKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/MenuEntity';

export function mapMenuEntityToHomepageMenu(menuEntity: MenuEntity): HomepageMenu {
  return {
    id: menuEntity.id,
    name: menuEntity.name,
    startTime: menuEntity.startTime,
    endTime: menuEntity.endTime,
    updatedAt: menuEntity.updatedAt,
  };
}

export function mapHomepageMenuToMenuEntity(homepageMenu: HomepageMenu): MenuEntity {
  return {
    ...homepageMenu,
    partitionKey: MenuKeyBuilders.buildPartitionKey(homepageMenu.id),
    sortKey: MenuKeyBuilders.buildSortKey(homepageMenu.id),
  };
}
