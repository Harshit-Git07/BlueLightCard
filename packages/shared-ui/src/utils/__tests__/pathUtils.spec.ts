import {
  getPathFromUrl,
  getBrandedOffersPath,
  getBrandedIdentityPath,
  getBrandedRedemptionsPath,
  getBrandedDiscoveryPath,
} from '../pathUtils';

describe('getPathFromUrl', () => {
  const errorCases = [
    'foo.com/bar.php',
    'foo/bar',
    '/bar.php?q=123abc',
    'bar',
    '?q=123abc',
    '',
    undefined,
    null,
    false,
    true,
    '\n',
  ];

  it.each(errorCases)('throws an error for malformed URL %s', (url) => {
    expect(() => getPathFromUrl(url as string)).toThrow();
  });

  const testCases = ['https://www.foo.com/bar.php', 'http://www.foo.com/bar.php'];

  it.each(testCases)('returns path from URL %s', (url) => {
    const result = getPathFromUrl(url);
    expect(result).toEqual('/bar.php');
  });

  it('returns path from a URL that does not include a file type', () => {
    const result = getPathFromUrl('https://www.foo.com/bar');
    expect(result).toEqual('/bar');
  });

  it('returns path and query parameters from URL with query parameters', () => {
    const result = getPathFromUrl('https://www.foo.com/bar.php?q=123abc');
    expect(result).toEqual('/bar.php?q=123abc');
  });

  it('returns path and query parameters from URL with query parameters that include another URL', () => {
    const result = getPathFromUrl('https://www.foo.com/bar.php?url=https://www.google.com');
    expect(result).toEqual('/bar.php?url=https://www.google.com');
  });
});

describe.each([
  ['blc-uk', false, '/eu/offers'],
  ['blc-au', false, '/au/offers'],
  ['dds-uk', false, '/eu/offers/dds'],
  ['blc-uk', true, '/eu/offers/v2/v2'],
  ['blc-au', true, '/au/offers/v2/v2'],
  ['dds-uk', true, '/eu/offers/dds/v2/v2'],
])('getBrandedOffersPath', (brand, useCms, expected) => {
  const originalEnv = process.env;

  afterAll(() => {
    process.env = originalEnv;
  });

  describe(`when the brand is '${brand}' and useCms is ${useCms}`, () => {
    beforeEach(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: brand };
    });

    it(`should return ${expected}`, () => {
      expect(getBrandedOffersPath(useCms)).toBe(expected);
    });
  });
});

describe.each([
  ['blc-uk', '/eu/redemptions'],
  ['blc-au', '/au/redemptions'],
  ['dds-uk', '/eu/redemptions/dds'],
])('getBrandedRedemptionsPath', (brand, expected) => {
  const originalEnv = process.env;

  afterAll(() => {
    process.env = originalEnv;
  });

  describe(`when the brand is '${brand}'`, () => {
    beforeEach(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: brand };
    });

    it(`should return ${expected}`, () => {
      expect(getBrandedRedemptionsPath()).toBe(expected);
    });
  });
});

describe.each([
  ['blc-uk', '/eu/identity'],
  ['blc-au', '/au/identity'],
  ['dds-uk', '/eu/identity'],
])('getBrandedIdentityPath', (brand, expected) => {
  const originalEnv = process.env;

  afterAll(() => {
    process.env = originalEnv;
  });

  describe(`when the brand is '${brand}'`, () => {
    beforeEach(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: brand };
    });

    it(`should return ${expected}`, () => {
      expect(getBrandedIdentityPath()).toBe(expected);
    });
  });
});

describe.each([
  ['blc-uk', '/eu/discovery'],
  ['blc-au', '/au/discovery'],
  ['dds-uk', '/eu/discovery/dds'],
])('getBrandedDiscoveryPath', (brand, expected) => {
  const originalEnv = process.env;

  afterAll(() => {
    process.env = originalEnv;
  });

  describe(`when the brand is '${brand}'`, () => {
    beforeEach(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: brand };
    });

    it(`should return ${expected}`, () => {
      expect(getBrandedDiscoveryPath()).toBe(expected);
    });
  });
});
