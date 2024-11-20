import { Offer } from '../../models/Offer';
import { MENU_PREFIX, MENU_TYPE_PREFIX, OFFER_PREFIX, SUB_MENU_PREFIX } from '../constants/PrimaryKeyPrefixes';

export type MenuOfferEntity = Offer & {
  partitionKey: string;
  sortKey: string;
  gsi1PartitionKey?: string;
  gsi1SortKey?: string;
  gsi2PartitionKey?: string;
  gsi2SortKey?: string;
  gsi3PartitionKey: string;
  gsi3SortKey: string;
};

export class MenuOfferKeyBuilders {
  static readonly buildPartitionKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;

  static readonly buildSortKey = (offerId: string): string => `${OFFER_PREFIX}${offerId}`;

  static readonly buildGsi1PartitionKey = (menuType: string): string => `${MENU_TYPE_PREFIX}${menuType}`;

  static readonly buildGsi1SortKey = (menuType: string): string => `${MENU_TYPE_PREFIX}${menuType}`;

  static readonly buildGsi2PartitionKey = (subMenuId: string): string => `${SUB_MENU_PREFIX}${subMenuId}`;

  static readonly buildGsi2SortKey = (offerId: string): string => `${OFFER_PREFIX}${offerId}`;

  static readonly buildGsi3PartitionKey = (offerId: string): string => `${OFFER_PREFIX}${offerId}`;

  static readonly buildGsi3SortKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;
}
