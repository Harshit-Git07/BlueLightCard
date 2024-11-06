import { OfferType } from './Offer';

export type OfferResponse = {
  offerID: string;
  legacyOfferID?: number;
  offerName: string;
  offerDescription: string;
  offerType: OfferType;
  imageURL: string;
  companyID: string;
  legacyCompanyID?: number;
  companyName: string;
};
