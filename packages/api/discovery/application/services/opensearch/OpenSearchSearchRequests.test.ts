import { QueryDslQueryContainer, SearchRequest } from '@opensearch-project/opensearch/api/types';

import * as getEnvModule from '@blc-mono/core/utils/getEnv';
import { OpenSearchSearchRequests } from '@blc-mono/discovery/application/services/opensearch/OpenSearchSearchRequests';

import { DistanceUnit } from '../../handlers/locations/locations.enum';

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

  const expectedCompanyIDQuery: QueryDslQueryContainer = {
    term: {
      company_id: '1',
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

  describe('buildLocationSearchRequest', () => {
    const lat = 51.5074;
    const lon = -0.1278;
    const distance = 30;
    const distanceUnit = DistanceUnit.MILES;
    const limit = 10;
    const companyId = '1';
    const companyName = searchTerm;

    const expectedLocationQuery = {
      nested: {
        path: 'company_locations',
        ignore_unmapped: true,
        query: {
          geo_distance: {
            distance: `${distance}${distanceUnit}`,
            'company_locations.geo_point': {
              lat,
              lon,
            },
          },
        },
        inner_hits: {
          _source: {
            includes: ['company_locations.location_id', 'company_locations.geo_point', 'company_locations.store_name'],
          },
          script_fields: {
            distance: {
              script: {
                source: `doc['company_locations.geo_point'].arcDistance(params.lat, params.lon)${distanceUnit === DistanceUnit.MILES ? ' * 0.000621371' : ''}`,
                params: {
                  lat,
                  lon,
                },
              },
            },
          },
          size: limit < 100 ? limit : 100,
        },
      },
    };

    const expectedLocationSearch = (mustQueries: QueryDslQueryContainer[]) => ({
      index: indexName,
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
        size: limit,
        _source: [
          'company_id',
          'legacy_company_id',
          'company_name',
          'company_small_logo',
          'included_trusts',
          'excluded_trusts',
        ],
      },
    });

    it('should return a Company Location Search Request', () => {
      const result = target.buildLocationSearchRequest({ limit, lon, lat, distance, distanceUnit });

      expect(result).toEqual(
        expectedLocationSearch([expectedLocationQuery, expectedAgeRestrictedQuery, expectedOfferIsLive]),
      );
    });

    it('should return company name query if company name is passed', () => {
      const result = target.buildLocationSearchRequest({ limit, lon, lat, distance, distanceUnit, companyName });

      expect(result).toEqual(
        expectedLocationSearch([
          expectedLocationQuery,
          expectedAgeRestrictedQuery,
          expectedOfferIsLive,
          expectedCompanyNameFuzzyQuery,
        ]),
      );
    });

    it('should return company id query if company id is passed', () => {
      const result = target.buildLocationSearchRequest({ limit, lon, lat, distance, distanceUnit, companyId });

      expect(result).toEqual(
        expectedLocationSearch([
          expectedLocationQuery,
          expectedAgeRestrictedQuery,
          expectedOfferIsLive,
          expectedCompanyIDQuery,
        ]),
      );
    });
  });
});
