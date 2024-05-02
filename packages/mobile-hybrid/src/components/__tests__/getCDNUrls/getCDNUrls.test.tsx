import getCDNUrl from '@/utils/getCDNUrl';
import { CDN_URL } from '@/globals';

describe('getCDNUrl', () => {
  it('should return the same url if it starts with https', () => {
    const url = 'https://example.com/test.jpg';
    expect(getCDNUrl(url)).toBe(url);
  });

  it('should prepend CDN_URL if the url does not start with https', () => {
    const relativePath = '/test.jpg';
    expect(getCDNUrl(relativePath)).toBe(`${CDN_URL}${relativePath}`);
  });

  it('should add a slash between CDN_URL and the relative path if it does not start with a slash', () => {
    const relativePath = 'test.jpg';
    expect(getCDNUrl(relativePath)).toBe(`${CDN_URL}/${relativePath}`);
  });
});
