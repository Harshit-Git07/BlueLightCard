import {
  BoostType as SanityBoostType,
  DiscountType as SanityDiscountType,
  MenuDealsOfTheWeek as SanityMenuDealsOfTheWeek,
  MenuFeaturedOffers as SanityMenuFeaturedOffers,
  Offer as SanityOffer,
} from '@bluelightcard/sanity-types';

import { IngestedMenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

import { mapSanityMenuOfferToMenuOffer } from './mapSanityMenuOfferToMenuOffer';

const richTextModuleData = {
  _type: 'richtext-module' as const,
  content: [
    {
      _key: 'block1',
      children: [
        {
          _key: 'span1',
          text: 'This is a heading',
          marks: [] as string[],
          _type: 'span' as const,
        },
      ],
      style: 'h1' as const,
      listItem: 'number' as const,
      markDefs: [] as never[],
      level: 1,
      _type: 'block' as const,
    },
    {
      _key: 'block2',
      children: [
        {
          _key: 'span2',
          text: 'This is a paragraph.',
          marks: [] as string[],
          _type: 'span' as const,
        },
      ],
      style: 'normal' as const,
      markDefs: [
        {
          _key: 'link1',
          _type: 'link' as const,
          href: 'https://example.com',
        },
      ],
      level: 1,
      _type: 'block' as const,
    },
    {
      _key: 'image1',
      asset: {
        _id: 'image-asset-id',
        _type: 'sanity.imageAsset' as const,
        _createdAt: '2023-01-01',
        _updatedAt: '2023-01-02',
        _rev: 'image-revision-id',
        originalFilename: 'example.jpg',
        url: 'https://example.com/image.jpg',
      },
      hotspot: {
        _type: 'sanity.imageHotspot' as const,
        x: 0.5,
        y: 0.5,
        height: 1,
        width: 1,
      },
      crop: {
        _type: 'sanity.imageCrop' as const,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      alt: 'Example Image',
      caption: 'This is an example image.',
      _type: 'image' as const,
    },
  ],
  tableOfContents: true,
  tocPosition: 'left' as const,
};

export const validSanityMenuOffer: {
  offer?: SanityOffer;
  start?: string;
  end?: string;
  _key: string;
} = {
  _key: 'mock-key',
  offer: {
    _id: '1',
    offerId: 123,
    _type: 'offer',
    _createdAt: '2023-01-01T00:00:00Z',
    _updatedAt: '2023-01-02T00:00:00Z',
    _rev: 'rev-id',
    name: 'Test Offer',
    status: 'live',
    offerType: { _type: 'offer.type', offerType: 'online' },
    offerDescription: richTextModuleData,
    image: {
      default: {
        asset: {
          _id: 'image-id',
          url: 'https://example.com/image.jpg',
          _type: 'sanity.imageAsset',
          _createdAt: '2023-01-01T00:00:00Z',
          _updatedAt: '2023-01-02T00:00:00Z',
          _rev: 'image-revision-id',
        },
        _type: 'image',
      },
    },
    start: '2023-01-01',
    expires: '2023-12-31',
    evergreen: true,
    tags: ['tag1', 'tag2'],
    company: {
      _id: 'company1',
      _type: 'company',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-02T00:00:00Z',
      _rev: 'rev-id',
      includedTrust: [
        {
          _id: 'service-id',
          _type: 'trust',
          _createdAt: '2023-01-01T00:00:00Z',
          _updatedAt: '2023-01-02T00:00:00Z',
          _rev: 'rev-id',
          name: 'Trust Service Name',
          code: 'trust-service-code',
        },
      ],
      excludedTrust: [],
      brandCompanyDetails: [
        {
          _key: 'unique-key-1',
          companyName: 'Test Company',
          companyLogo: {
            default: {
              _type: 'image',
              asset: {
                _id: 'logo-asset-id',
                _type: 'sanity.imageAsset',
                _createdAt: '2023-01-01T00:00:00Z',
                _updatedAt: '2023-01-02T00:00:00Z',
                _rev: 'rev-id',
                url: 'logo-ref',
              },
            },
          },
          ageRestrictions: [],
        },
      ],
    },
    categorySelection: [
      {
        _key: 'key',
        category1: {
          _id: 'category-id',
          _type: 'category',
          _createdAt: '2023-01-01',
          _updatedAt: '2023-01-01',
          _rev: 'rev-id',
          level: 1,
        },
        categoryItem: {
          _id: 'item-id',
          _type: 'category.item',
          _createdAt: '2023-01-01T00:00:00Z',
          _updatedAt: '2023-01-02T00:00:00Z',
          _rev: 'rev-id',
          id: 1,
          name: 'Category Item Name',
        },
      },
    ],
    local: false,
    discountDetails: {
      discountType: 'percentage',
      discountDescription: 'free-entry',
      discountCoverage: 'all-site',
    } as SanityDiscountType,
    commonExclusions: {
      _type: 'common.exclusion.type',
      commonExclusions: [
        {
          _id: 'exclusion-id',
          _type: 'common.exclusion',
          _createdAt: '2023-01-01T00:00:00Z',
          _updatedAt: '2023-01-02T00:00:00Z',
          _rev: 'rev-id',
          name: 'Exclusion Name',
        },
      ],
    },
    boostDetails: {
      _type: 'boost.type',
      start: '2023-01-01',
      expires: '2023-12-31',
    } as SanityBoostType,
  },
};

const sanityFeaturedMenuOffer: SanityMenuFeaturedOffers = {
  _id: 'menu1',
  _type: 'menu.featuredOffers',
  _rev: 'rev1',
  title: 'Test Menu',
  start: '2023-01-01T00:00:00Z',
  end: '2023-12-31T00:00:00Z',
  _updatedAt: '2023-01-02T00:00:00Z',
  _createdAt: '2023-01-02T00:00:00Z',
  inclusions: [validSanityMenuOffer],
};

const sanityDOTWMenuOffer: SanityMenuDealsOfTheWeek = {
  _id: 'menu1',
  _type: 'menu.dealsOfTheWeek',
  _rev: 'rev1',
  title: 'Test Menu',
  start: '2023-01-01T00:00:00Z',
  end: '2023-12-31T00:00:00Z',
  _updatedAt: '2023-01-02T00:00:00Z',
  _createdAt: '2023-01-02T00:00:00Z',
  inclusions: [validSanityMenuOffer],
};

describe('mapSanityMenuOfferToOffer', () => {
  const expectedDefaultResponse = (menuType: MenuType): IngestedMenuOffer => ({
    id: 'menu1',
    name: 'Test Menu',
    startTime: '2023-01-01T00:00:00Z',
    endTime: '2023-12-31T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    menuType,
    offers: [
      {
        id: '1',
        company: {
          id: 'company1',
        },
        position: 0,
        overrides: {},
      },
    ],
  });

  const testCases = [
    {
      input: sanityFeaturedMenuOffer,
      menuType: MenuType.FEATURED,
    },
    { input: sanityDOTWMenuOffer, menuType: MenuType.DEALS_OF_THE_WEEK },
  ];

  it.each(testCases)('should map sanity menu offer to menu offer correctly', ({ input, menuType }) => {
    const expected = expectedDefaultResponse(menuType);
    const result = mapSanityMenuOfferToMenuOffer(input);

    expect(result).toEqual(expected);
  });

  const errorCases = [
    {
      field: 'title',
      menuOffer: {
        ...sanityDOTWMenuOffer,
        title: undefined,
      },
    },
    {
      field: 'offer',
      menuOffer: {
        ...sanityDOTWMenuOffer,
        inclusions: [
          {
            ...validSanityMenuOffer,
            offer: undefined,
          },
        ],
      },
    },
    {
      field: 'company',
      menuOffer: {
        ...sanityDOTWMenuOffer,
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
  ];
  it.each(errorCases)('should throw an error if %s is not present', ({ field, menuOffer }) => {
    // @ts-expect-error menu offer dereferencing not ideal
    expect(() => mapSanityMenuOfferToMenuOffer(menuOffer)).toThrow(`Missing sanity field: ${field}`);
  });

  it('should return an empty array if inclusions are undefined', () => {
    const sanityMenuOfferWithoutInclusions = {
      ...sanityDOTWMenuOffer,
      inclusions: undefined,
    };
    const expected = {
      ...expectedDefaultResponse(MenuType.DEALS_OF_THE_WEEK),
      offers: [],
    };

    const result = mapSanityMenuOfferToMenuOffer(sanityMenuOfferWithoutInclusions);

    expect(result).toEqual(expected);
  });
});
