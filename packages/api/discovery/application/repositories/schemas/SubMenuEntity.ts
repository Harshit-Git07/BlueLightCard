import { SubMenu } from '../../models/ThemedMenu';
import { MENU_PREFIX, MENU_TYPE_PREFIX, SUB_MENU_PREFIX } from '../constants/PrimaryKeyPrefixes';

import { MenuOfferEntity } from './MenuOfferEntity';

export type SubMenuEntity = SubMenu & {
  partitionKey: string;
  sortKey: string;
  gsi1PartitionKey: string;
  gsi1SortKey: string;
  gsi2PartitionKey: string;
  gsi2SortKey: string;
};

export type SubMenuEntityWithOfferEntities = SubMenuEntity & {
  offers: MenuOfferEntity[];
};

export class SubMenuKeyBuilders {
  static readonly buildPartitionKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;

  static readonly buildSortKey = (subMenuId: string): string => `${SUB_MENU_PREFIX}${subMenuId}`;

  static readonly buildGsi1PartitionKey = (menuType: string): string => `${MENU_TYPE_PREFIX}${menuType}`;

  static readonly buildGsi1SortKey = (menuType: string): string => `${MENU_TYPE_PREFIX}${menuType}`;

  static readonly buildGsi2PartitionKey = (subMenuId: string): string => `${SUB_MENU_PREFIX}${subMenuId}`;

  static readonly buildGsi2SortKey = (subMenuId: string): string => `${SUB_MENU_PREFIX}${subMenuId}`;
}
