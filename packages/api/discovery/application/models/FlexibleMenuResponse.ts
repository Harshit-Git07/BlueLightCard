import { OfferResponse } from './OfferResponse';

export type FlexibleMenuResponse = {
  title: string;
  description: string;
  imageURL: string;
  offers: OfferResponse[];
};
