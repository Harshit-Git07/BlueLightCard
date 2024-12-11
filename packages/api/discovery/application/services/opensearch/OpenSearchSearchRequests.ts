import { SearchRequest } from '@opensearch-project/opensearch/api/types';

import { AgeRestriction, getAgeRestrictions } from '@blc-mono/discovery/application/models/AgeRestrictions';
import {
  ageRestrictionsQuery,
  categoryIdQuery,
  companyNameFuzzyQuery,
  companyNameInCompaniesAllQuery,
  companyNameQuery,
  offerIsLiveQuery,
  offerNameQuery,
  offerTagQuery,
  offerTypeQuery,
} from '@blc-mono/discovery/application/services/opensearch/OpenSearchQueries';

const MAX_RESULTS = 10000;

export class OpenSearchSearchRequests {
  private readonly index: string;
  private searchTerm: string;
  private offerType?: string;
  private readonly ageRestrictions: AgeRestriction[];

  constructor(index: string, dob: string) {
    this.index = index;
    this.searchTerm = '';
    this.ageRestrictions = getAgeRestrictions(dob);
  }

  public buildSearchRequest(searchTerm: string, offerType?: string): SearchRequest[] {
    this.offerType = offerType;
    this.searchTerm = searchTerm;

    return [
      this.buildActiveOffersAndCompanyNameSearch(),
      this.buildCompanyNameInCompaniesAllSearch(),
      this.buildOfferTagSearch(),
      this.buildOfferNameSearch(),
      this.buildCompanyNameFuzzySearch(),
    ];
  }

  public buildAllCompaniesRequest(): SearchRequest {
    return this.buildAllCompaniesSearch();
  }

  public buildCategorySearch(categoryId: string): SearchRequest {
    return this.buildCategoryIdSearch(categoryId);
  }

  private buildBaseSearch(): SearchRequest {
    return {
      index: this.index,
      body: {
        size: MAX_RESULTS,
        query: {},
      },
    };
  }

  private buildActiveOffersAndCompanyNameSearch(): SearchRequest {
    const mustQueries = [
      ageRestrictionsQuery(this.ageRestrictions),
      companyNameQuery(this.searchTerm),
      offerIsLiveQuery(),
    ];

    if (this.offerType) {
      mustQueries.unshift(offerTypeQuery(this.offerType));
    }
    return {
      ...this.buildBaseSearch(),
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    };
  }

  private buildAllCompaniesSearch(): SearchRequest {
    const mustQueries = [ageRestrictionsQuery(this.ageRestrictions), offerIsLiveQuery()];

    return {
      index: this.index,
      body: {
        size: 0,
        query: {
          bool: {
            must: mustQueries,
          },
        },
        aggs: {
          companies: {
            terms: { field: 'company_name.raw', size: MAX_RESULTS },
            aggs: {
              company: {
                top_hits: { size: 1, _source: { includes: ['company_id', 'legacy_company_id', 'company_name'] } },
              },
            },
          },
        },
      },
    };
  }

  private buildCompanyNameInCompaniesAllSearch(): SearchRequest {
    const mustQueries = [ageRestrictionsQuery(this.ageRestrictions), companyNameInCompaniesAllQuery(this.searchTerm)];

    if (this.offerType) {
      mustQueries.unshift(offerTypeQuery(this.offerType));
    }
    return {
      ...this.buildBaseSearch(),
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    };
  }

  private buildOfferTagSearch(): SearchRequest {
    const mustQueries = [
      ageRestrictionsQuery(this.ageRestrictions),
      offerTagQuery(this.searchTerm),
      offerIsLiveQuery(),
    ];

    if (this.offerType) {
      mustQueries.unshift(offerTypeQuery(this.offerType));
    }
    return {
      ...this.buildBaseSearch(),
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    };
  }

  private buildOfferNameSearch(): SearchRequest {
    const mustQueries = [
      ageRestrictionsQuery(this.ageRestrictions),
      offerNameQuery(this.searchTerm),
      offerIsLiveQuery(),
    ];

    if (this.offerType) {
      mustQueries.unshift(offerTypeQuery(this.offerType));
    }
    return {
      ...this.buildBaseSearch(),
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    };
  }

  private buildCompanyNameFuzzySearch(): SearchRequest {
    const mustQueries = [
      ageRestrictionsQuery(this.ageRestrictions),
      companyNameFuzzyQuery(this.searchTerm),
      offerIsLiveQuery(),
    ];

    if (this.offerType) {
      mustQueries.unshift(offerTypeQuery(this.offerType));
    }
    return {
      ...this.buildBaseSearch(),
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    };
  }

  private buildCategoryIdSearch(categoryId: string): SearchRequest {
    const mustQueries = [ageRestrictionsQuery(this.ageRestrictions), offerIsLiveQuery(), categoryIdQuery(categoryId)];
    return {
      ...this.buildBaseSearch(),
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    };
  }
}
