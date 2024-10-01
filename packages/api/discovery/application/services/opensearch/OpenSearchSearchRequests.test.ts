import { QueryDslQueryContainer, SearchRequest } from '@opensearch-project/opensearch/api/types';

import * as getEnvModule from '@blc-mono/core/utils/getEnv';
jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());
import { OpenSearchSearchRequests } from '@blc-mono/discovery/application/services/opensearch/OpenSearchSearchRequests';

jest.mock('@blc-mono/discovery/application/models/AgeRestrictions', () => {
  return {
    getAgeRestrictions: jest.fn().mockImplementation(() => ['none', '16+']),
  };
});

describe('OpenSearchSearchRequests', () => {
  const indexName = 'index1';
  const dob = '2000-01-01';
  const offerType = 'online';
  const searchTerm = 'Nike';

  const expectedOfferTypeQuery: QueryDslQueryContainer = {
    match: {
      offer_type: offerType,
    },
  };

  const expectedAgeRestrictedQuery: QueryDslQueryContainer = {
    bool: {
      should: [
        {
          match: {
            age_restrictions: {
              query: '*none*',
            },
          },
        },
        {
          match: {
            age_restrictions: {
              query: '*16+*',
            },
          },
        },
      ],
    },
  };

  const expectedCompanyNameQuery: QueryDslQueryContainer = {
    match: {
      company_name_stripped: searchTerm,
    },
  };

  const expectedOfferExpiryRangeQuery: QueryDslQueryContainer = {
    range: {
      offer_expires: {
        gte: 'now',
        time_zone: '+00:00',
      },
    },
  };

  const expectedCompaniesAllQuery: QueryDslQueryContainer = {
    bool: {
      should: [
        {
          query_string: {
            fields: ['companies_all'],
            query: searchTerm,
          },
        },
        {
          match: {
            companies_all: {
              query: `*${searchTerm}*`,
            },
          },
        },
      ],
    },
  };

  const expectedTagsQuery: QueryDslQueryContainer = {
    bool: {
      should: [
        {
          query_string: {
            fields: ['offer_tags', 'offer_tags_space'],
            fuzziness: 1,
            query: `*${searchTerm}*`,
          },
        },
        {
          match: {
            offer_tags: {
              fuzziness: 1,
              query: searchTerm,
            },
          },
        },
        {
          match: {
            offer_tags_space: {
              fuzziness: 1,
              query: searchTerm,
            },
          },
        },
      ],
    },
  };

  const expectedOfferNameQuery: QueryDslQueryContainer = {
    match: {
      offer_name: searchTerm,
    },
  };

  const expectedCompanyNameFuzzyQuery: QueryDslQueryContainer = {
    match: {
      company_name_stripped: {
        fuzziness: 1,
        query: searchTerm,
      },
    },
  };

  const target = new OpenSearchSearchRequests(indexName, dob, searchTerm, offerType);

  const buildSearchRequest = (expectedQueries: QueryDslQueryContainer[]): SearchRequest => ({
    body: {
      query: {
        bool: {
          must: expectedQueries,
        },
      },
    },
    index: indexName,
  });

  it('should return a list of Search Requests', () => {
    const result = target.build();

    expect(result).toHaveLength(5);
  });

  it('should return an Active Offers And Company Name Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedCompanyNameQuery,
      expectedOfferExpiryRangeQuery,
    ]);

    const result = target.build();

    expect(result[0]).toEqual(expectedSearch);
  });

  it('should return a Company Name In Companies_All Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedCompaniesAllQuery,
    ]);

    const result = target.build();

    expect(result[1]).toEqual(expectedSearch);
  });

  it('should return an Offer Tag Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedTagsQuery,
      expectedOfferExpiryRangeQuery,
    ]);

    const result = target.build();

    expect(result[2]).toEqual(expectedSearch);
  });

  it('should return an Offer Name Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedOfferNameQuery,
      expectedOfferExpiryRangeQuery,
    ]);

    const result = target.build();

    expect(result[3]).toEqual(expectedSearch);
  });

  it('should return a Company Name Fuzzy Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedCompanyNameFuzzyQuery,
      expectedOfferExpiryRangeQuery,
    ]);

    const result = target.build();

    expect(result[4]).toEqual(expectedSearch);
  });
});
