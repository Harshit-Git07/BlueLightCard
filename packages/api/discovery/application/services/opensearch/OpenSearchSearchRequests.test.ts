import { QueryDslQueryContainer, SearchRequest } from '@opensearch-project/opensearch/api/types';

import * as getEnvModule from '@blc-mono/core/utils/getEnv';
import { OpenSearchSearchRequests } from '@blc-mono/discovery/application/services/opensearch/OpenSearchSearchRequests';

jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());

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

  const expectedOfferIsLive: QueryDslQueryContainer = {
    bool: {
      must: [
        {
          bool: {
            filter: [
              {
                term: {
                  offer_status: 'live',
                },
              },
            ],
          },
        },
        {
          bool: {
            should: [
              {
                bool: {
                  must_not: [
                    {
                      exists: {
                        field: 'offer_expires',
                      },
                    },
                    {
                      exists: {
                        field: 'offer_start',
                      },
                    },
                  ],
                },
              },
              {
                bool: {
                  filter: [
                    {
                      bool: {
                        should: [
                          {
                            range: {
                              offer_expires: {
                                gte: 'now',
                              },
                            },
                          },
                          {
                            bool: {
                              must_not: {
                                exists: {
                                  field: 'offer_expires',
                                },
                              },
                            },
                          },
                        ],
                        minimum_should_match: 1,
                      },
                    },
                  ],
                  should: [
                    {
                      range: {
                        offer_start: {
                          lte: 'now',
                        },
                      },
                    },
                    {
                      bool: {
                        must_not: {
                          exists: {
                            field: 'offer_start',
                          },
                        },
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
      ],
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

  const target = new OpenSearchSearchRequests(indexName, dob);

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
    const result = target.buildSearchRequest(searchTerm, offerType);

    expect(result).toHaveLength(5);
  });

  it('should return an Active Offers And Company Name Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedCompanyNameQuery,
      expectedOfferIsLive,
    ]);

    const result = target.buildSearchRequest(searchTerm, offerType);

    expect(result[0]).toEqual(expectedSearch);
  });

  it('should return a Company Name In Companies_All Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedCompaniesAllQuery,
    ]);

    const result = target.buildSearchRequest(searchTerm, offerType);

    expect(result[1]).toEqual(expectedSearch);
  });

  it('should return an Offer Tag Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedTagsQuery,
      expectedOfferIsLive,
    ]);

    const result = target.buildSearchRequest(searchTerm, offerType);

    expect(result[2]).toEqual(expectedSearch);
  });

  it('should return an Offer Name Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedOfferNameQuery,
      expectedOfferIsLive,
    ]);

    const result = target.buildSearchRequest(searchTerm, offerType);

    expect(result[3]).toEqual(expectedSearch);
  });

  it('should return a Company Name Fuzzy Search', () => {
    const expectedSearch = buildSearchRequest([
      expectedOfferTypeQuery,
      expectedAgeRestrictedQuery,
      expectedCompanyNameFuzzyQuery,
      expectedOfferIsLive,
    ]);

    const result = target.buildSearchRequest(searchTerm, offerType);

    expect(result[4]).toEqual(expectedSearch);
  });

  describe('Category Search', () => {
    it('should return a Category Search Request', () => {
      const categoryId = '123';
      const expectedSearchRequest = buildSearchRequest([
        expectedAgeRestrictedQuery,
        expectedOfferIsLive,
        {
          match: {
            category_id: categoryId,
          },
        },
      ]);

      const result = target.buildCategorySearch(categoryId);

      expect(result).toEqual(expectedSearchRequest);
    });
  });

  describe('buildAllCompaniesRequest', () => {
    const expectedSearch: SearchRequest = {
      index: indexName,
      body: {
        query: {
          bool: {
            must: [expectedAgeRestrictedQuery, expectedOfferIsLive],
          },
        },
        size: 0,
        aggs: {
          companies: {
            terms: { field: 'company_name.raw', size: 10000 },
            aggs: {
              company: {
                top_hits: { size: 1, _source: { includes: ['company_id', 'legacy_company_id', 'company_name'] } },
              },
            },
          },
        },
      },
    };

    it('should return an All Companies Search', () => {
      const result = target.buildAllCompaniesRequest();

      expect(result).toEqual(expectedSearch);
    });
  });
});
