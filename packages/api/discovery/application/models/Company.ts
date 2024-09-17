import { Category } from './Category';

export type Company = {
  id: string;
  legacyCompanyId: number;
  name: string;
  logo: string;
  ageRestrictions: string;
  alsoKnownAs: string[];
  serviceRestrictions: string[];
  categories: Category[];
  local: boolean;
  updatedAt: string;
};
