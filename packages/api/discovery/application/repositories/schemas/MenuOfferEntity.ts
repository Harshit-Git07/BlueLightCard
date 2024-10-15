import { Offer } from '../../models/Offer';
import { MENU_PREFIX, OFFER_PREFIX } from '../constants/PrimaryKeyPrefixes';

export type MenuOfferEntity = Offer & {
  partitionKey: string;
  sortKey: string;
  gsi1PartitionKey: string;
  gsi1SortKey: string;
};

export class MenuOfferKeyBuilders {
  static readonly buildPartitionKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;

  static readonly buildSortKey = (offerId: string): string => `${OFFER_PREFIX}${offerId}`;

  static readonly buildGsi1PartitionKey = (offerId: string): string => `${OFFER_PREFIX}${offerId}`;

  static readonly buildGsi1SortKey = (menuId: string): string => `${MENU_PREFIX}${menuId}`;
}
