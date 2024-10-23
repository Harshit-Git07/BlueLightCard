import { OfferType } from './Offer';

export type MenuOfferResponse = {
  offerID: string;
  offerName: string;
  offerDescription: string;
  offerType: OfferType;
  imageURL: string;
  companyID: string;
  companyName: string;
};
