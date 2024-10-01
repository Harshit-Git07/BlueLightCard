import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { AgeRestriction } from '@blc-mono/discovery/application/models/AgeRestrictions';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

const TIMEZONE_OFFSET = getEnvOrDefault(DiscoveryStackEnvironmentKeys.TIMEZONE_OFFSET, '+00:00');

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

export const offerNotExpiredQuery = (): QueryDslQueryContainer => {
  return {
    range: {
      offer_expires: {
        time_zone: TIMEZONE_OFFSET,
        gte: 'now',
      },
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
