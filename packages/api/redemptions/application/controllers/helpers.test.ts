import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';

import { getCorsHeaders } from './helpers';

const baseHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};
describe('Controller helpers', () => {
  describe('Get CORS Headers', () => {
    it('does not return CORS headers for a non-matching origin', () => {
      const result = getCorsHeaders(['https://nowhere.matched'], as({ headers: { origin: faker.internet.url() } }));

      expect(result).toStrictEqual({});
    });

    it.each(['https://any.domain', 'https://hello.world', faker.internet.url()])(
      'returns CORS headers for any origin when a wildcard match is used (%s)',
      (origin) => {
        const result = getCorsHeaders(['*'], as({ headers: { origin: origin } }));

        expect(result).toStrictEqual({
          ...baseHeaders,
          'Access-Control-Allow-Origin': '*',
        });
      },
    );

    it.each(['https://match.one', 'https://another.origin', 'https://third.entry'])(
      'matches any of multiple origins when specified (%s)',
      (matchingOrigin) => {
        const result = getCorsHeaders(
          ['https://match.one', 'https://another.origin', 'https://third.entry'],
          as({ headers: { origin: matchingOrigin } }),
        );

        expect(result).toStrictEqual({
          ...baseHeaders,
          'Access-Control-Allow-Origin': matchingOrigin,
        });
      },
    );
  });
});
