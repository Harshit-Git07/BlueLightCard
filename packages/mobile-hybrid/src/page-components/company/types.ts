import { OfferTypeStrLiterals, offerTypeParser } from '@bluelightcard/shared-ui';

// Model
export type OfferModel = {
  id: number;
  description: string;
  name: string;
  type: OfferTypeStrLiterals;
  expiry: string;
  terms: string;
  image: string;
};

export type OffersAPIResponse = {
  message: string;
  data: {
    offers: OfferModel[];
  };
};

export type CompanyModel = {
  companyId: number;
  companyName: string;
  companyDescription: string;
  offers: OfferModel[];
};

// Pill/Filter types
export type filtersType = 'All' | keyof typeof offerTypeParser;
