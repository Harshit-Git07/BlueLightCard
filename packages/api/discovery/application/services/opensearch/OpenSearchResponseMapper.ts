import { AggregationsTermsAggregate, SearchHit, SearchResponse } from '@opensearch-project/opensearch/api/types';

import { CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';
import { OpenSearchBody } from '@blc-mono/discovery/application/models/OpenSearchType';

export interface SearchResult {
  ID: string;
  LegacyID?: number;
  OfferName: string;
  OfferType: string;
  offerimg: string;
  OfferDescription?: string;
  CompID: string;
  LegacyCompanyID?: number;
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
        OfferDescription: hit._source?.offer_description ?? '',
        offerimg: hit._source?.offer_image ?? '',
        CompID: hit._source?.company_id ?? '',
        LegacyCompanyID: hit._source?.legacy_company_id,
        CompanyName: hit._source?.company_name ?? '',
      });
    });

    mappedResults = [...uniqueSearchResults];
  }

  return mappedResults;
};

interface AggregateCompanyResult {
  key: string;
  company: {
    hits: {
      hits: { _source: { legacy_company_id?: number; company_name: string; company_id: string } }[];
    };
  };
}

export const mapAllCompanies = (result: SearchResponse): CompanySummary[] => {
  let mappedResults: CompanySummary[] = [];

  if (result.aggregations?.['companies']) {
    const uniqueCompanies = new Set<CompanySummary>();
    const aggregations = result.aggregations['companies'] as AggregationsTermsAggregate<AggregateCompanyResult>;
    aggregations.buckets.forEach((bucket) => {
      uniqueCompanies.add({
        companyID: bucket.company.hits.hits[0]._source?.company_id ?? '',
        legacyCompanyID: bucket.company.hits.hits[0]._source?.legacy_company_id,
        companyName: bucket.company.hits.hits[0]._source.company_name ?? '',
      });
    });

    mappedResults = [...uniqueCompanies];
  }

  return mappedResults;
};
