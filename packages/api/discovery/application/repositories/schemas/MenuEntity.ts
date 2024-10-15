import { HomepageMenu } from '../../models/HomepageMenu';
import { MENU_PREFIX } from '../constants/PrimaryKeyPrefixes';

export type MenuEntity = HomepageMenu & {
  partitionKey: string;
  sortKey: string;
};

export class MenuKeyBuilders {
  static readonly buildPartitionKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;

  static readonly buildSortKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;
}
