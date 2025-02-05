import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

import { AgeRestriction } from '@blc-mono/discovery/application/models/AgeRestrictions';

import { DistanceUnit } from '../../handlers/locations/locations.enum';

export const offerTypeQuery = (offerType?: string): QueryDslQueryContainer => {
  if (offerType) {
    return {
      match: {
        offer_type: offerType,
      },
    };
  }

  return {};
};

export const ageRestrictionsQuery = (ageRestrictions: AgeRestriction[]): QueryDslQueryContainer => {
  const shouldClauses = ageRestrictions.map((ageRestriction) => {
    return {
      match: {
        age_restrictions: {
          query: `*${ageRestriction}*`,
        },
      },
    };
  });
  return {
    bool: {
      should: shouldClauses,
    },
  };
};
export const companyNameInCompaniesAllQuery = (searchTerm: string): QueryDslQueryContainer => {
  return {
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
};

export const companyNameQuery = (searchTerm: string): QueryDslQueryContainer => {
  return {
    match: {
      company_name_stripped: searchTerm,
    },
  };
};

export const offerTagQuery = (searchTerm: string): QueryDslQueryContainer => {
  return {
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
};

export const offerNameQuery = (searchTerm: string): QueryDslQueryContainer => {
  return {
    match: {
      offer_name: searchTerm,
    },
  };
};

export const offerIsLiveQuery = (): QueryDslQueryContainer => {
  return {
    bool: {
      must: [offerStatusLiveQuery(), offerNotExpiredAndEvergreenQuery()],
    },
  };
};

export const eventOfferIsLiveQuery = (): QueryDslQueryContainer => {
  return {
    bool: {
      must: [offerStatusLiveQuery(), eventOfferNotExpired()],
    },
  };
};

const eventOfferNotExpired = (): QueryDslQueryContainer => {
  return {
    bool: {
      must: [offerNotExpired()],
    },
  };
};

export const offerNotExpiredAndEvergreenQuery = (): QueryDslQueryContainer => {
  return {
    bool: {
      should: [offerEvergreenQuery(), offerWithinExpiryRangeQuery()],
    },
  };
};

export const offerEvergreenQuery = (): QueryDslQueryContainer => {
  return {
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
};

export const offerNotExpired = (): QueryDslQueryContainer => {
  return {
    bool: {
      filter: [
        {
          range: {
            offer_expires: {
              gte: 'now',
            },
          },
        },
      ],
    },
  };
};

export const offerWithinExpiryRangeQuery = (): QueryDslQueryContainer => {
  return {
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
};

export const offerStatusLiveQuery = (): QueryDslQueryContainer => {
  return {
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
};

export const companyNameFuzzyQuery = (searchTerm: string): QueryDslQueryContainer => {
  return {
    match: {
      company_name_stripped: {
        query: searchTerm,
        fuzziness: 1,
      },
    },
  };
};

export const companyIdQuery = (companyId: string): QueryDslQueryContainer => {
  return {
    term: {
      company_id: companyId,
    },
  };
};

export const categoryIdQuery = (categoryId: string): QueryDslQueryContainer => {
  return {
    match: {
      category_id: categoryId,
    },
  };
};

export const companyLocationQuery = (
  lon: number,
  lat: number,
  distance: number,
  distanceUnit: DistanceUnit,
  limit: number,
): QueryDslQueryContainer => {
  return {
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
};
