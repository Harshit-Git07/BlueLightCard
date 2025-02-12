export interface SearchResult {
  id: number | string;
  catid?: number;
  compid: number | string;
  typeid: number;
  offername: string;
  companyname: string;
  logos: string;
  absoluteLogos: string;
  s3logos: string;
}

export interface SearchResultV5 {
  ID: number | string;
  LegacyID?: number;
  CatID: number;
  CompID: number | string;
  LegacyCompanyID?: number;
  TypeID: number;
  OfferName: string;
  CompanyName: string;
  offerimg: string;
}

export interface OfferListItem {
  companyId: number | string;
  companyName: string;
  offerId: number | string;
  offerName: string;
  searchResultNumber: number;
}
export type SearchResults = SearchResult[];
export type SearchResultsV5 = SearchResultV5[];
export type SearchResultsWrapper = {
  results: SearchResults;
  term: string | undefined;
};

export type SearchQuery = NativeAPICall.Parameters['parameters'];
