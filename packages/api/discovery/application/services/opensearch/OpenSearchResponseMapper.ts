import { AggregationsTermsAggregate, SearchHit, SearchResponse } from '@opensearch-project/opensearch/api/types';

import { CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';
import { OpenSearchBody } from '@blc-mono/discovery/application/models/OpenSearchType';

import { EventType, OfferType } from '../../models/Offer';

export interface OfferSearchResult {
  ID: string;
  LegacyID?: number;
  OfferName: string;
  OfferType: OfferType;
  offerimg: string;
  OfferDescription?: string;
  CompID: string;
  LegacyCompanyID?: number;
  CompanyName: string;
}

export interface EventSearchResult {
  ID: string;
  eventName: string;
  OfferType: EventType;
  eventImg: string;
  eventDescription?: string;
  venueID: string;
  venueName: string;
}

export interface NearestOfferSearchResultResponse {
  locationId: string;
  lat: number;
  lon: number;
  distance: number;
  storeName?: string;
  legacyCompanyId?: number;
  companyId: string;
  companyName: string;
  companyLogo: string;
}
export interface NearestOfferSearchResult extends NearestOfferSearchResultResponse {
  includedTrusts: string[];
  excludedTrusts: string[];
}

export type SearchResult = OfferSearchResult | EventSearchResult;

export type InternalSearchResult = SearchResult & {
  IncludedTrusts: string[];
  ExcludedTrusts: string[];
};

const mapSearchHitToEventInternalSearchResult = (hit: SearchHit<OpenSearchBody>): InternalSearchResult => ({
  ID: hit._source?.offer_id ?? '',
  eventName: hit._source?.offer_name ?? '',
  OfferType: hit._source?.offer_type as EventType,
  eventImg: hit._source?.offer_image ?? '',
  eventDescription: hit._source?.offer_description ?? '',
  venueID: hit._source?.venue_id ?? '',
  venueName: hit._source?.venue_name ?? '',
  IncludedTrusts: hit._source?.included_trusts ?? [],
  ExcludedTrusts: hit._source?.excluded_trusts ?? [],
});

const mapSearchHitToOfferInternalSearchResult = (hit: SearchHit<OpenSearchBody>): InternalSearchResult => ({
  ID: hit._source?.offer_id ?? '',
  LegacyID: hit._source?.legacy_offer_id,
  OfferName: hit._source?.offer_name ?? '',
  OfferType: hit._source?.offer_type as OfferType,
  OfferDescription: hit._source?.offer_description ?? '',
  offerimg: hit._source?.offer_image ?? '',
  CompID: hit._source?.company_id ?? '',
  LegacyCompanyID: hit._source?.legacy_company_id,
  CompanyName: hit._source?.company_name ?? '',
  IncludedTrusts: hit._source?.included_trusts ?? [],
  ExcludedTrusts: hit._source?.excluded_trusts ?? [],
});

export const mapSearchResults = (result: SearchResponse): InternalSearchResult[] => {
  let mappedResults: InternalSearchResult[] = [];
  if (result.hits?.hits) {
    const uniqueSearchResults = new Set<InternalSearchResult>();
    result.hits.hits.forEach((searchHit) => {
      const hit = searchHit as SearchHit<OpenSearchBody>;
      if (Object.values(EventType).includes(hit._source?.offer_type as EventType)) {
        uniqueSearchResults.add(mapSearchHitToEventInternalSearchResult(hit));
      } else {
        uniqueSearchResults.add(mapSearchHitToOfferInternalSearchResult(hit));
      }
    });

    mappedResults = [...uniqueSearchResults];
  }

  return mappedResults;
};

export const mapInternalSearchResult = (internalSearchResult: InternalSearchResult): SearchResult => {
  const { IncludedTrusts, ExcludedTrusts, ...rest } = internalSearchResult;
  return rest;
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

export interface NearestOffersSearchResponse {
  hits: {
    hits: Array<{
      _source: {
        offer_id: string;
        company_id: string;
        company_name: string;
        company_small_logo: string;
        legacy_company_id?: number;
        included_trusts: string[];
        excluded_trusts: string[];
      };
      inner_hits: {
        company_locations: {
          hits: {
            hits: Array<{
              _source: {
                location_id: string;
                store_name?: string;
                geo_point: {
                  lat: number;
                  lon: number;
                };
              };
              fields?: {
                distance?: number[];
              };
            }>;
          };
        };
      };
    }>;
  };
}

export const mapToNearestOfferSearchResult = (response: NearestOffersSearchResponse): NearestOfferSearchResult[] => {
  const uniqueCompanyLocations = new Map<string, NearestOfferSearchResult>();

  response.hits.hits.forEach((hit) => {
    hit.inner_hits?.company_locations?.hits?.hits.forEach((location) => {
      const locationId = location._source?.location_id ?? '';

      if (!uniqueCompanyLocations.has(locationId)) {
        uniqueCompanyLocations.set(locationId, {
          locationId,
          lon: location._source?.geo_point?.lon ?? 0,
          lat: location._source?.geo_point?.lat ?? 0,
          distance: location.fields?.distance?.[0] ?? 0,
          storeName: location._source?.store_name,
          legacyCompanyId: hit._source?.legacy_company_id,
          companyId: hit._source?.company_id,
          companyName: hit._source?.company_name,
          companyLogo: hit._source?.company_small_logo,
          includedTrusts: hit._source?.included_trusts || [],
          excludedTrusts: hit._source?.excluded_trusts || [],
        });
      }
    });
  });

  return [...uniqueCompanyLocations.values()].sort((a, b) => a.distance - b.distance);
};
