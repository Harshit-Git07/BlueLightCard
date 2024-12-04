import { Category } from './Category';
import { Geopoint } from './CompanyLocation';

export type Location = {
  id: string;
  location: Geopoint;
  storeName?: string;
  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  region?: string;
  postcode?: string;
  country?: 'UK' | 'AU';
  telephone?: string;
};

export type Company = {
  id: string;
  type: 'company';
  legacyCompanyId?: number;
  name: string;
  logo: string;
  ageRestrictions: string;
  alsoKnownAs: string[];
  includedTrusts: string[];
  excludedTrusts: string[];
  categories: Category[];
  locations: Location[];
  local: boolean;
  updatedAt: string;
};
