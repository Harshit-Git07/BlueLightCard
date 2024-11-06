import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';

export type CategoryResponse = {
  id: string;
  name: string;
  data: OfferResponse[];
};
