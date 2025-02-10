import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { SubMenu } from '@blc-mono/discovery/application/models/ThemedMenu';

import { SubMenuEntity, SubMenuKeyBuilders } from '../../../schemas/SubMenuEntity';

export function mapSubMenuEntityToSubMenu(subMenuEntity: SubMenuEntity): SubMenu {
  return {
    id: subMenuEntity.id,
    title: subMenuEntity.title,
    description: subMenuEntity.description,
    imageURL: subMenuEntity.imageURL,
    position: subMenuEntity.position,
  };
}

export function mapSubMenuToSubMenuEntity(menuId: string, subMenu: SubMenu): SubMenuEntity {
  return {
    partitionKey: SubMenuKeyBuilders.buildPartitionKey(menuId),
    sortKey: SubMenuKeyBuilders.buildSortKey(subMenu.id),
    gsi1PartitionKey: SubMenuKeyBuilders.buildGsi1PartitionKey(MenuType.FLEXIBLE),
    gsi1SortKey: SubMenuKeyBuilders.buildGsi1SortKey(MenuType.FLEXIBLE),
    gsi2PartitionKey: SubMenuKeyBuilders.buildGsi2PartitionKey(subMenu.id),
    gsi2SortKey: SubMenuKeyBuilders.buildGsi2SortKey(subMenu.id),
    id: subMenu.id,
    title: subMenu.title,
    description: subMenu.description,
    imageURL: subMenu.imageURL,
    position: subMenu.position,
  };
}
