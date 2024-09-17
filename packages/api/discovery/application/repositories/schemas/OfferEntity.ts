import {
  COMPANY_PREFIX,
  LOCAL_PREFIX,
  OFFER_PREFIX,
} from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';

import { Offer } from '../../models/Offer';

export type OfferEntity = Offer & {
  partitionKey: string;
  sortKey: string;
  gsi1PartitionKey: string;
  gsi1SortKey: string;
  gsi2PartitionKey: string;
  gsi2SortKey: string;
};

export class OfferKeyBuilders {
  static readonly buildPartitionKey = (id: string): string => `${OFFER_PREFIX}${id}`;

  static readonly buildSortKey = (companyId: string): string => `${COMPANY_PREFIX}${companyId}`;

  static readonly buildGsi1PartitionKey = (local: boolean): string => `${LOCAL_PREFIX}${local}`;

  static readonly buildGsi1SortKey = (local: boolean): string => `${LOCAL_PREFIX}${local}`;

  static readonly buildGsi2PartitionKey = (companyId: string): string => `${COMPANY_PREFIX}${companyId}`;

  static readonly buildGsi2SortKey = (offerId: string): string => `${OFFER_PREFIX}${offerId}`;
}
