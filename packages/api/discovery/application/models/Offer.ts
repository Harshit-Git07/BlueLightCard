import { Boost } from './Boost';
import { Category } from './Category';
import { Company } from './Company';
import { Discount } from './Discount';

export type Offer = {
  id: number;
  legacyOfferId: number;
  name: string;
  status: string;
  offerType: string;
  offerDescription: string;
  image: string;
  offerStart: string;
  offerEnd: string;
  evergreen: boolean;
  tags: string[];
  serviceRestrictions: string[];
  company: Company;
  categories: Category[];
  local: boolean;
  discount: Discount;
  commonExclusions: string[];
  boost: Boost;
  updatedAt: string;
};
