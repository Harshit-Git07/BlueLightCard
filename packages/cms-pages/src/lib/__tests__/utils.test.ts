import { getRevalidationValue, mapToNavLinks, SanityMenuLinks } from '../utils';

describe('Utils', () => {
  describe('getRevalidationValue', () => {
    it('should return number value', () => {
      process.env.NEXT_PUBLIC_REVALIDATE = '0';
      const value = getRevalidationValue();
      expect(value).toBe(0);
    });

    it('should return false if value is not a number', () => {
      process.env.NEXT_PUBLIC_REVALIDATE = 'not a number';
      const value = getRevalidationValue();
      expect(value).toBe(false);
    });
  });

  describe('mapToNavLinks', () => {
    it('should map external links to the url property as a string when type is set to "external"', () => {
      const externalLink1 = 'http://external-1.link.com';
      const externalLink2 = 'http://external-2.link.com';

      const sanityMenuLinks: SanityMenuLinks = [
        {
          _type: 'link',
          label: 'Link 1',
          type: 'external',
          external: externalLink1,
        },
        {
          _type: 'link',
          label: 'Link 2',
          type: 'external',
          external: externalLink2,
        },
      ];

      const newMappedLinks = mapToNavLinks(sanityMenuLinks);

      expect(newMappedLinks[0].url).toBe(externalLink1);
      expect(newMappedLinks[1].url).toBe(externalLink2);
    });

    it('should map internal links to the url property as a string when type is set to "internal"', () => {
      const sanityMenuLinks: SanityMenuLinks = [
        {
          _type: 'link',
          label: 'Link 1',
          type: 'internal',
          internal: {
            metadata: {
              slug: {
                current: '/internal-1',
              },
            },
          } as Sanity.Link['internal'],
        },
        {
          _type: 'link',
          label: 'Link 2',
          type: 'internal',
          internal: {
            metadata: {
              slug: {
                current: '/internal-2',
              },
            },
          } as Sanity.Link['internal'],
        },
      ];

      const newMappedLinks = mapToNavLinks(sanityMenuLinks);

      expect(newMappedLinks[0].url).toBe('/internal-1');
      expect(newMappedLinks[1].url).toBe('/internal-2');
    });

    it('should add "/" prefix to url if missing on internal link', () => {
      const sanityMenuLinks: SanityMenuLinks = [
        {
          _type: 'link',
          label: 'Link 1',
          type: 'internal',
          internal: {
            metadata: {
              slug: {
                current: 'internal',
              },
            },
          } as Sanity.Link['internal'],
        },
      ];

      const newMappedLinks = mapToNavLinks(sanityMenuLinks);

      expect(newMappedLinks[0].url).toBe('/internal');
    });

    it('should NOT add "/" prefix to url if url is already prefixed with "/" on internal link', () => {
      const sanityMenuLinks: SanityMenuLinks = [
        {
          _type: 'link',
          label: 'Link 1',
          type: 'internal',
          internal: {
            metadata: {
              slug: {
                current: '/internal',
              },
            },
          } as Sanity.Link['internal'],
        },
      ];

      const newMappedLinks = mapToNavLinks(sanityMenuLinks);

      expect(newMappedLinks[0].url).toBe('/internal');
    });
  });
});
