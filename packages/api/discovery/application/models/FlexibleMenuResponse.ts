import { EventResponse } from './EventResponse';
import { OfferResponse } from './OfferResponse';

export type FlexibleMenuResponse = {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  offers: OfferResponse[];
  events: EventResponse[];
};
