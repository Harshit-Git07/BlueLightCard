import { getPathFromUrl } from '../getPathFromUrl';

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
