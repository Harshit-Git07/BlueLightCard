import { SearchRequest } from '@opensearch-project/opensearch/api/types';

import { AgeRestriction, getAgeRestrictions } from '@blc-mono/discovery/application/models/AgeRestrictions';
import {
  ageGatedQuery,
  companyNameFuzzyQuery,
  companyNameInCompaniesAllQuery,
  companyNameQuery,
  offerNameQuery,
  offerNotExpiredQuery,
  offerTagQuery,
  offerTypeQuery,
} from '@blc-mono/discovery/application/services/opensearch/OpenSearchQueries';

const MAX_RESULTS = 10000;

export class OpenSearchSearchRequests {
  private readonly index: string;
  private readonly searchTerm: string;
  private readonly offerType?: string;
  private readonly ageRestrictions: AgeRestriction[];

  constructor(index: string, dob: string, searchTerm: string, offerType?: string) {
    this.index = index;
    this.offerType = offerType;
    this.searchTerm = searchTerm;
    this.ageRestrictions = getAgeRestrictions(dob);
  }

  public build(): SearchRequest[] {
    return [
      this.buildActiveOffersAndCompanyNameSearch(),
      this.buildCompanyNameInCompaniesAllSearch(),
      this.buildOfferTagSearch(),
      this.buildOfferNameSearch(),
      this.buildCompanyNameFuzzySearch(),
    ];
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
      ageGatedQuery(this.ageRestrictions),
      companyNameQuery(this.searchTerm),
      offerNotExpiredQuery(),
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

  private buildCompanyNameInCompaniesAllSearch(): SearchRequest {
    const mustQueries = [ageGatedQuery(this.ageRestrictions), companyNameInCompaniesAllQuery(this.searchTerm)];

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
    const mustQueries = [ageGatedQuery(this.ageRestrictions), offerTagQuery(this.searchTerm), offerNotExpiredQuery()];

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
    const mustQueries = [ageGatedQuery(this.ageRestrictions), offerNameQuery(this.searchTerm), offerNotExpiredQuery()];

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
      ageGatedQuery(this.ageRestrictions),
      companyNameFuzzyQuery(this.searchTerm),
      offerNotExpiredQuery(),
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
}
