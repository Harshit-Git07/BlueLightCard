import { Menu } from '../../models/Menu';
import { MENU_PREFIX, MENU_TYPE_PREFIX } from '../constants/PrimaryKeyPrefixes';

import { MenuOfferEntity } from './MenuOfferEntity';
import { SubMenuEntity } from './SubMenuEntity';

export type MenuEntity = Menu & {
  partitionKey: string;
  sortKey: string;
  gsi1PartitionKey: string;
  gsi1SortKey: string;
};

export type MenuEntityWithOfferEntities = MenuEntity & {
  offers: MenuOfferEntity[];
};

export type MenuEntityWithSubMenuEntities = MenuEntity & {
  subMenus: SubMenuEntity[];
};

export class MenuKeyBuilders {
  static readonly buildPartitionKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;

  static readonly buildSortKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;

  static readonly buildGsi1PartitionKey = (menuType: string): string => `${MENU_TYPE_PREFIX}${menuType}`;

  static readonly buildGsi1SortKey = (menuType: string): string => `${MENU_TYPE_PREFIX}${menuType}`;
}
