import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';

import { AgeRestriction } from '@blc-mono/discovery/application/models/AgeRestrictions';

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

export const offerNotExpiredAndEvergreenQuery = (): QueryDslQueryContainer => {
  return {
    bool: {
      should: [offerEvergreenQuery(), offerNotExpiredQuery()],
    },
  };
};

export const offerEvergreenQuery = (): QueryDslQueryContainer => {
  return {
    bool: {
      must_not: {
        exists: {
          field: 'offer_expires', // Condition for documents without offer_expires
        },
      },
    },
  };
};

export const offerNotExpiredQuery = (): QueryDslQueryContainer => {
  return {
    bool: {
      filter: [
        {
          range: {
            offer_expires: {
              gte: 'now', // Condition for future dates
            },
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
