import { SearchHit, SearchResponse } from '@opensearch-project/opensearch/api/types';

import { OpenSearchBody } from '@blc-mono/discovery/application/models/OpenSearchType';

export interface SearchResult {
  ID: string;
  LegacyID?: number;
  OfferName: string;
  OfferType: string;
  offerimg: string;
  CompID: string;
  CompanyName: string;
}

export const mapSearchResults = (result: SearchResponse): SearchResult[] => {
  let mappedResults: SearchResult[] = [];
  if (result.hits?.hits) {
    const uniqueSearchResults = new Set<SearchResult>();
    result.hits.hits.forEach((searchHit) => {
      const hit = searchHit as SearchHit<OpenSearchBody>;
      uniqueSearchResults.add({
        ID: hit._source?.offer_id ?? '',
        LegacyID: hit._source?.legacy_offer_id,
        OfferName: hit._source?.offer_name ?? '',
        OfferType: hit._source?.offer_type ?? '',
        offerimg: hit._source?.offer_image ?? '',
        CompID: hit._source?.company_id ?? '',
        CompanyName: hit._source?.company_name ?? '',
      });
    });

    mappedResults = [...uniqueSearchResults];
  }

  return mappedResults;
};
