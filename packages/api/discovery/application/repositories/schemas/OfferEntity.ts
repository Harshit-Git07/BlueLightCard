import {
  COMPANY_PREFIX,
  EVENT_PREFIX,
  LOCAL_PREFIX,
  OFFER_PREFIX,
  REGION_PREFIX,
  VENUE_PREFIX,
} from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';

import { EventOffer, Offer } from '../../models/Offer';

export type OfferEntity = Offer & {
  partitionKey: string;
  sortKey: string;
  gsi1PartitionKey: string;
  gsi1SortKey: string;
  gsi2PartitionKey: string;
  gsi2SortKey: string;
};

export type EventEntity = EventOffer & {
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

export class EventKeyBuilders {
  static readonly buildPartitionKey = (id: string): string => `${EVENT_PREFIX}${id}`;

  static readonly buildSortKey = (venueId: string): string => `${VENUE_PREFIX}${venueId}`;

  static readonly buildGsi1PartitionKey = (): string => 'EVENT';

  static readonly buildGsi1SortKey = (id: string): string => `${EVENT_PREFIX}${id}`;

  static readonly buildGsi2PartitionKey = (region: string): string => `${REGION_PREFIX}${region}`;

  static readonly buildGsi2SortKey = (venueId: string): string => `${VENUE_PREFIX}${venueId}`;
}
