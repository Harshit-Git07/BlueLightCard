export interface SearchResult {
  id: number;
  catid: number;
  compid: number;
  typeid: number;
  offername: string;
  companyname: string;
  logos: string;
  absoluteLogos: string;
  s3logos: string;
}
export interface OfferListItem {
  companyId: number;
  companyName: string;
  offerId: number;
  offerName: string;
  searchResultNumber: number;
}
export type SearchResults = SearchResult[];

export type SearchQuery = NativeAPICall.Parameters['parameters'];
