import { MenuOfferResponse } from './MenuOfferResponse';

export type FlexibleMenuResponse = {
  title: string;
  description: string;
  imageURL: string;
  offers: MenuOfferResponse[];
};
