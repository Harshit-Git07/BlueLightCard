import { Company } from '@blc-mono/discovery/application/models/Company';

import { Boost } from './Boost';
import { Category } from './Category';
import { Discount } from './Discount';

export enum OfferType {
  GIFT_CARD = 'gift-card',
  IN_STORE = 'in-store',
  LOCAL = 'local',
  ONLINE = 'online',
  OTHER = 'other',
}

export type Offer = {
  id: string;
  legacyOfferId?: number;
  name: string;
  status: string;
  offerType: OfferType;
  offerDescription: string;
  image: string;
  offerStart?: string;
  offerEnd?: string;
  evergreen: boolean;
  tags: string[];
  includedTrusts: string[];
  excludedTrusts: string[];
  company: Company;
  categories: Category[];
  local: boolean;
  discount?: Discount;
  commonExclusions: string[];
  boost?: Boost;
  updatedAt: string;
};
