export interface SearchResult {
  id: number;
  catid?: number;
  compid: number;
  typeid: number;
  offername: string;
  companyname: string;
  logos: string;
  absoluteLogos: string;
  s3logos: string;
}

export interface SearchResultV5 {
  ID: number;
  CatID: number;
  CompID: number;
  TypeID: number;
  OfferName: string;
  CompanyName: string;
  Logos: string;
  AbsoluteLogos: string;
  S3Logos: string;
}

export interface OfferListItem {
  companyId: number;
  companyName: string;
  offerId: number;
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
