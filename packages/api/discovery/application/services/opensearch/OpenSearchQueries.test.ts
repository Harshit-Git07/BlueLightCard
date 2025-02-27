import * as getEnvModule from '@blc-mono/core/utils/getEnv';
import { AgeRestriction } from '@blc-mono/discovery/application/models/AgeRestrictions';
import {
  ageRestrictionsQuery,
  categoryIdQuery,
  companyIdQuery,
  companyLocationQuery,
  companyNameFuzzyQuery,
  companyNameInCompaniesAllQuery,
  companyNameQuery,
  offerEvergreenQuery,
  offerNameQuery,
  offerStatusLiveQuery,
  offerTagQuery,
  offerTypeQuery,
  offerWithinExpiryRangeQuery,
} from '@blc-mono/discovery/application/services/opensearch/OpenSearchQueries';

import { DistanceUnit } from '../../handlers/locations/locations.enum';

jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());

describe('OpenSearchQueries', () => {
  const searchTerm = 'Nike';

  it('should build an offer type query', () => {
    const offerType = 'online';
    const expectedOfferTypeQuery = {
      match: {
        offer_type: offerType,
      },
    };
    const query = offerTypeQuery(offerType);

    expect(query).toEqual(expectedOfferTypeQuery);
  });

  it('should build an age gated query', () => {
    const ageRestrictions: AgeRestriction[] = ['none', '16+', '18+'];
    const expectedAgeGatedQuery = {
      bool: {
        minimum_should_match: 1,
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
          {
            match: {
              age_restrictions: {
                query: '*18+*',
              },
            },
          },
        ],
      },
    };

    const query = ageRestrictionsQuery(ageRestrictions);

    expect(query).toEqual(expectedAgeGatedQuery);
  });

  it('should build a company name in all companies query', () => {
    const expectedQuery = {
      bool: {
        should: [
          {
            query_string: {
              query: searchTerm,
              fields: ['companies_all'],
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
    const query = companyNameInCompaniesAllQuery(searchTerm);

    expect(query).toEqual(expectedQuery);
  });

  it('should build a company name query', () => {
    const expectedQuery = {
      match: {
        company_name_stripped: searchTerm,
      },
    };
    const query = companyNameQuery(searchTerm);

    expect(query).toEqual(expectedQuery);
  });

  it('should build an offer tag query', () => {
    const expectedQuery = {
      bool: {
        should: [
          {
            query_string: {
              query: `*${searchTerm}*`,
              fields: ['offer_tags', 'offer_tags_space'],
              fuzziness: 1,
            },
          },
          {
            match: {
              offer_tags: {
                query: searchTerm,
                fuzziness: 1,
              },
            },
          },
          {
            match: {
              offer_tags_space: {
                query: searchTerm,
                fuzziness: 1,
              },
            },
          },
        ],
      },
    };
    const query = offerTagQuery(searchTerm);

    expect(query).toEqual(expectedQuery);
  });

  it('should build an offer name query', () => {
    const expectedQuery = {
      term: {
        offer_name: { value: searchTerm },
      },
    };
    const query = offerNameQuery(searchTerm);

    expect(query).toEqual(expectedQuery);
  });

  it('should build an offer within valid expiry range query', () => {
    const expectedQuery = {
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
    };
    const query = offerWithinExpiryRangeQuery();

    expect(query).toEqual(expectedQuery);
  });

  it('should build an offer evergreen query', () => {
    const expectedQuery = {
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
    };
    const query = offerEvergreenQuery();

    expect(query).toEqual(expectedQuery);
  });

  it('should build an offer_status live query', () => {
    const expectedQuery = {
      bool: {
        filter: [
          {
            term: {
              offer_status: 'live',
            },
          },
        ],
      },
    };
    const query = offerStatusLiveQuery();

    expect(query).toEqual(expectedQuery);
  });

  it('should build a company name fuzzy query', () => {
    const expectedQuery = {
      match: {
        company_name_stripped: {
          query: searchTerm,
          fuzziness: 1,
        },
      },
    };
    const query = companyNameFuzzyQuery(searchTerm);

    expect(query).toEqual(expectedQuery);
  });

  it('should build a category ID query', () => {
    const categoryId = '1';
    const expectedQuery = {
      match: {
        category_id: categoryId,
      },
    };
    const query = categoryIdQuery(categoryId);

    expect(query).toEqual(expectedQuery);
  });

  it('should build a company ID query', () => {
    const companyId = '1';
    const expectedQuery = {
      term: {
        company_id: companyId,
      },
    };
    const query = companyIdQuery(companyId);
    expect(query).toEqual(expectedQuery);
  });

  describe('Company Locations Query', () => {
    const lon = 1;
    const lat = -2;
    const distance = 0;
    const milesDistanceUnit = DistanceUnit.MILES;
    const kilometresDistanceUnit = DistanceUnit.KILOMETERS;
    const limit = 10;
    const milesExpectedQuery = {
      nested: {
        path: 'company_locations',
        ignore_unmapped: true,
        query: {
          geo_distance: {
            distance: `${distance}${DistanceUnit.MILES}`,
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
                source: `doc['company_locations.geo_point'].arcDistance(params.lat, params.lon) * 0.000621371`,
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
    const kilometresExpectedQuery = {
      nested: {
        path: 'company_locations',
        ignore_unmapped: true,
        query: {
          geo_distance: {
            distance: `${distance}${DistanceUnit.KILOMETERS}`,
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
                source: `doc['company_locations.geo_point'].arcDistance(params.lat, params.lon)`,
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

    it('should build the correct company location query for a km distance unit', () => {
      const query = companyLocationQuery(lon, lat, distance, kilometresDistanceUnit, limit);
      expect(query).toEqual(kilometresExpectedQuery);
    });

    it('should build the correct company location query for a mile distance unit', () => {
      const query = companyLocationQuery(lon, lat, distance, milesDistanceUnit, limit);
      expect(query).toEqual(milesExpectedQuery);
    });
  });
});
