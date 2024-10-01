import * as getEnvModule from '@blc-mono/core/utils/getEnv';
import { AgeRestriction } from '@blc-mono/discovery/application/models/AgeRestrictions';
jest.spyOn(getEnvModule, 'getEnv').mockImplementation((input: string) => input.toLowerCase());
import {
  ageRestrictionsQuery,
  companyNameFuzzyQuery,
  companyNameInCompaniesAllQuery,
  companyNameQuery,
  offerNameQuery,
  offerNotExpiredQuery,
  offerTagQuery,
  offerTypeQuery,
} from '@blc-mono/discovery/application/services/opensearch/OpenSearchQueries';

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
      match: {
        offer_name: searchTerm,
      },
    };
    const query = offerNameQuery(searchTerm);

    expect(query).toEqual(expectedQuery);
  });

  it('should build an offer not expired query', () => {
    const expectedQuery = {
      range: {
        offer_expires: {
          time_zone: '+00:00',
          gte: 'now',
        },
      },
    };
    const query = offerNotExpiredQuery();

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
});
