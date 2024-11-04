import { Offer } from '../../models/Offer';
import { MENU_PREFIX, MENU_TYPE_PREFIX, OFFER_PREFIX } from '../constants/PrimaryKeyPrefixes';

export type MenuOfferEntity = Offer & {
  partitionKey: string;
  sortKey: string;
  gsi1PartitionKey: string;
  gsi1SortKey: string;
  gsi2PartitionKey: string;
  gsi2SortKey: string;
};

export class MenuOfferKeyBuilders {
  static readonly buildPartitionKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;

  static readonly buildSortKey = (offerId: string): string => `${OFFER_PREFIX}${offerId}`;

  static readonly buildGsi1PartitionKey = (menuType: string): string => `${MENU_TYPE_PREFIX}${menuType}`;

  static readonly buildGsi1SortKey = (menuType: string): string => `${MENU_TYPE_PREFIX}${menuType}`;

  static readonly buildGsi2PartitionKey = (offerId: string): string => `${OFFER_PREFIX}${offerId}`;

  static readonly buildGsi2SortKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;
}
