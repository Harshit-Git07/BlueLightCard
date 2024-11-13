import { getPathFromUrl, getBrandedOffersPath } from '../pathUtils';

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

describe('getBrandedOffersPath', () => {
  const originalEnv = process.env;

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('when the brand is BLC UK', () => {
    beforeEach(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: 'blc-uk' };
    });

    it('should return /eu/offers', () => {
      expect(getBrandedOffersPath()).toBe('/eu/offers');
    });
  });

  describe('when the brand is BLC AU', () => {
    beforeEach(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: 'blc-au' };
    });

    it('should return /au/offers', () => {
      expect(getBrandedOffersPath()).toBe('/au/offers');
    });
  });

  describe('when the brand is DDS', () => {
    beforeEach(() => {
      process.env = { ...originalEnv, NEXT_PUBLIC_APP_BRAND: 'dds-uk' };
    });

    it('should return /eu/offers/dds', () => {
      expect(getBrandedOffersPath()).toBe('/eu/offers/dds');
    });
  });
});
