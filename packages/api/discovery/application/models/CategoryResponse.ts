export type CategoryOffer = {
  ID: string;
  LegacyID?: number;
  OfferName: string;
  OfferType: string;
  offerimg: string;
  CompID: string;
  LegacyCompanyID?: number;
  CompanyName: string;
};

export type CategoryResponse = {
  id: string;
  name: string;
  data: CategoryOffer[];
};
