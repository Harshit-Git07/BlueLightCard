import { Company } from '@blc-mono/discovery/application/models/Company';

import { Boost } from './Boost';
import { Category } from './Category';
import { Discount } from './Discount';

export type Offer = {
  id: string;
  legacyOfferId?: number;
  name: string;
  status: string;
  offerType: string;
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
