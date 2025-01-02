import { Company } from '@blc-mono/discovery/application/models/Company';

import { Boost } from './Boost';
import { Category } from './Category';
import { Discount } from './Discount';
import { Redemption } from './Redemption';
import { Venue } from './Venue';

export enum OfferType {
  GIFT_CARD = 'gift-card',
  IN_STORE = 'in-store',
  LOCAL = 'local',
  ONLINE = 'online',
  OTHER = 'other',
}

export enum OfferStatus {
  LIVE = 'live',
  EXPIRED = 'expired',
  DEACTIVATED = 'deactivated',
}

export enum EventStatus {
  LIVE = 'live',
  EXPIRED = 'expired',
}

export enum EventType {
  TICKET = 'ticket',
}

type CommonOffer = {
  id: string;
  name: string;
  image: string;
  offerStart?: string;
  offerEnd?: string;
  includedTrusts: string[];
  excludedTrusts: string[];
  categories: Category[];
  updatedAt: string;
};

export type DiscountOffer = CommonOffer & { offerType: OfferType } & {
  offerDescription: string;
  legacyOfferId?: number;
  evergreen: boolean;
  status: OfferStatus;
  tags: string[];
  company: Company;
  local: boolean;
  discount?: Discount;
  commonExclusions: string[];
  boost?: Boost;
};

export type Offer = DiscountOffer;

export type EventOffer = CommonOffer & { offerType: EventType } & {
  eventDescription: string;
  venue: Venue;
  status: EventStatus;
  redemption?: Redemption;
  ticketFaceValue: string;
  guestlistCompleteByDate: string;
  ageRestrictions: string;
};
