import { MenuMarketplace as SanityMenuMarketplace, MenuOffer as SanityMenuOffer } from '@bluelightcard/sanity-types';

import { IngestedMenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

import { mapSanityMarketPlaceMenusToMenuOffers } from './mapSanityMarketplaceMenusToMenus';
import { validSanityMenuOffer } from './mapSanityMenuOfferToMenuOffer.test';

const sanityMenuOffer: SanityMenuOffer = {
  _id: 'menu1',
  _type: 'menu.offer',
  _rev: 'rev1',
  title: 'Test Menu',
  start: '2023-01-01T00:00:00Z',
  end: '2023-12-31T00:00:00Z',
  _updatedAt: '2023-01-02T00:00:00Z',
  _createdAt: '2023-01-02T00:00:00Z',
  inclusions: [
    {
      ...validSanityMenuOffer,
      start: '2023-01-01T00:00:00Z',
      end: '2023-12-31T00:00:00Z',
      overrides: {
        description: 'Override description',
        image: {
          default: {
            asset: {
              url: 'http://test.com',
              _id: '',
              _type: 'sanity.imageAsset',
              _createdAt: '',
              _updatedAt: '',
              _rev: '',
            },
            _type: 'image',
          },
        },
        title: 'Override title',
      },
    },
  ],
};

const validSanityMarketplace: SanityMenuMarketplace = {
  _createdAt: '2023-01-02T00:00:00Z',
  _id: '123',
  _rev: '123',
  _type: 'menu.marketplace',
  _updatedAt: '2023-01-02T00:00:00Z',
  menus: [{ offerMenu: sanityMenuOffer, _key: 'offerMenu' }],
};

describe('mapSanityMarketplaceMenusToMenus', () => {
  it('should map a valid sanity marketplace event to an array of IngestedMenuOffers', () => {
    const expctedIngestedMenuOffer: IngestedMenuOffer[] = [
      {
        id: 'menu1',
        name: 'Test Menu',
        startTime: '2023-01-01T00:00:00Z',
        endTime: '2023-12-31T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
        menuType: MenuType.MARKETPLACE,
        offers: [
          {
            id: '1',
            company: { id: 'company1' },
            position: 0,
            start: '2023-01-01T00:00:00Z',
            end: '2023-12-31T00:00:00Z',
            overrides: {
              title: 'Override title',
              image: 'http://test.com',
              description: 'Override description',
            },
          },
        ],
        position: 0,
      },
    ];

    const expectedResponse = {
      updatedAt: '2023-01-02T00:00:00Z',
      ingestedMenuOffers: expctedIngestedMenuOffer,
    };

    const result = mapSanityMarketPlaceMenusToMenuOffers(validSanityMarketplace);
    expect(result).toStrictEqual(expectedResponse);
  });

  const errorCases = [
    {
      error: 'Missing sanity field: title',
      offerMenu: {
        ...sanityMenuOffer,
        title: undefined,
      },
    },
    {
      error: 'Missing sanity field: offer',
      offerMenu: {
        ...sanityMenuOffer,
        inclusions: [
          {
            ...validSanityMenuOffer,
            offer: undefined,
          },
        ],
      },
    },
    {
      error: 'Missing sanity field: company',
      offerMenu: {
        ...sanityMenuOffer,
        inclusions: [
          {
            ...validSanityMenuOffer,
            offer: {
              ...validSanityMenuOffer.offer,
              company: undefined,
            },
          },
        ],
      },
    },
    {
      error: 'Missing sanity field: company',
      offerMenu: {
        ...sanityMenuOffer,
        inclusions: [
          {
            ...validSanityMenuOffer,
            offer: {
              ...validSanityMenuOffer.offer,
              company: undefined,
            },
          },
        ],
      },
    },
    {
      error: 'Invalid sanity menu item passed',
      offerMenu: {
        ...sanityMenuOffer,
        _type: 'menu.themed.offer',
      },
    },
  ];
  it.each(errorCases)('should throw an error if %s is not present', async ({ error, offerMenu }) => {
    const invalidSanityMarketplace = { ...validSanityMarketplace, menus: [{ offerMenu, _key: 'mock-key' }] };
    expect(() => mapSanityMarketPlaceMenusToMenuOffers(invalidSanityMarketplace as SanityMenuMarketplace)).toThrow(
      error,
    );
  });
});
