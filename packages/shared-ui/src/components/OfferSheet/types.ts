export type OfferMeta = {
  offerId: string;
  companyId: string;
  companyName: string;
};

export type OfferDetails = {
  id: number | undefined;
  companyId: number | undefined;
  companyLogo: string | undefined;
  description: string | undefined;
  expiry: string | undefined;
  name: string | undefined;
  terms: string | undefined;
  type: string | undefined;
};

export type OfferStatus = 'pending' | 'error' | 'success';

export interface style {
  textColor: string;
  backgroundColor: string;
}

export interface config {
  [key: string]: style;
}
