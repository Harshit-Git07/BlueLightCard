export type SearchOfferType = {
  ID: number;
  OfferName: string;
  offerimg: string;
  CompID: number;
  CompanyName: string;
  OfferType: number;
};

export type SearchResultsType = {
  error?: string;
  results?: SearchOfferType[];
};
