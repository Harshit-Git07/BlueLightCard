import {
  BoostType as SanityBoostType,
  DiscountType as SanityDiscountType,
  MenuOffer as SanityMenuOffer,
  Offer as SanityOffer,
} from '@bluelightcard/sanity-types';

import { getSiteConfig } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/SiteEventHandler';
import { MenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { Site } from '@blc-mono/discovery/application/models/Site';

import { determineMenuType, mapSanityMenuOfferToMenuOffer } from './mapSanityMenuOfferToMenuOffer';

jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/SiteEventHandler');

const getSiteConfigMock = jest.mocked(getSiteConfig);

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

export const validSanityOffer: SanityOffer = {
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
  tags: [
    {
      _key: 'tag1',
      _type: 'tag.category',
      tagCategoryName: 'Category 1',
      tags: [
        {
          _id: 'tag-id-1',
          _type: 'tag',
          tagName: 'Tag 1',
          _createdAt: '2023-01-01',
          _updatedAt: '2023-01-01',
          _rev: 'rev1',
        },
        {
          _id: 'tag-id-2',
          _type: 'tag',
          tagName: 'Tag 2',
          _createdAt: '2023-01-01',
          _updatedAt: '2023-01-01',
          _rev: 'rev2',
        },
      ],
    },
    {
      _key: 'tag2',
      _type: 'tag.category',
      tagCategoryName: 'Category 2',
      tags: [
        {
          _id: 'tag-id-3',
          _type: 'tag',
          tagName: 'Tag 3',
          _createdAt: '2023-01-01',
          _updatedAt: '2023-01-01',
          _rev: 'rev3',
        },
      ],
    },
  ],
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
};

const sanityMenuOffer: SanityMenuOffer = {
  _id: 'menu1',
  _type: 'menu.offer',
  _rev: 'rev1',
  title: 'Test Menu',
  start: '2023-01-01T00:00:00Z',
  end: '2023-12-31T00:00:00Z',
  _updatedAt: '2023-01-02T00:00:00Z',
  _createdAt: '2023-01-02T00:00:00Z',
  inclusions: [validSanityOffer],
};

describe('mapSanityMenuOfferToOffer', () => {
  getSiteConfigMock.mockResolvedValue(undefined);
  const expectedDefaultResponse: MenuOffer = {
    id: 'menu1',
    name: 'Test Menu',
    startTime: '2023-01-01T00:00:00Z',
    endTime: '2023-12-31T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    menuType: MenuType.MARKETPLACE,
    offers: [
      {
        id: '1',
        company: {
          id: 'company1',
        },
      },
    ],
  };

  it('should map sanity menu offer to menu offer correctly', async () => {
    const result = await mapSanityMenuOfferToMenuOffer(sanityMenuOffer);

    expect(result).toEqual(expectedDefaultResponse);
  });

  const errorCases = [
    {
      field: 'title',
      menuOffer: {
        ...sanityMenuOffer,
        title: undefined,
      },
    },
    {
      field: 'company',
      menuOffer: {
        ...sanityMenuOffer,
        inclusions: [
          {
            ...validSanityOffer,
            company: undefined,
          },
        ],
      },
    },
  ];
  it.each(errorCases)('should throw an error if %s is not present', async ({ field, menuOffer }) => {
    await expect(mapSanityMenuOfferToMenuOffer(menuOffer)).rejects.toThrow(`Missing sanity field: ${field}`);
  });

  it('should return an empty array if inclusions are undefined', async () => {
    const sanityMenuOfferWithoutInclusions = {
      ...sanityMenuOffer,
      inclusions: undefined,
    };
    const expected = {
      ...expectedDefaultResponse,
      offers: [],
    };

    const result = await mapSanityMenuOfferToMenuOffer(sanityMenuOfferWithoutInclusions);

    expect(result).toEqual(expected);
  });
});

describe('determineMenuType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return DEALS_OF_THE_WEEK when menu offer matches id stored within the site config', async () => {
    const siteConfig: Site = {
      dealsOfTheWeekMenu: {
        id: 'deals-of-the-week-id',
      },
      featuredOffersMenu: {},
      id: 'site_id_1',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    getSiteConfigMock.mockResolvedValue(siteConfig);
    const menuOffer: SanityMenuOffer = {
      ...sanityMenuOffer,
      _id: 'deals-of-the-week-id',
    } as SanityMenuOffer;

    const result = await determineMenuType(menuOffer);

    expect(result).toEqual(MenuType.DEALS_OF_THE_WEEK);
  });
  it('should return FEATURED when menu offer matches id stored within the site config', async () => {
    const siteConfig: Site = {
      dealsOfTheWeekMenu: {},
      featuredOffersMenu: {
        id: 'featured-id',
      },
      id: 'site_id_1',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    getSiteConfigMock.mockResolvedValue(siteConfig);
    const menuOffer: SanityMenuOffer = {
      ...sanityMenuOffer,
      _id: 'featured-id',
    } as SanityMenuOffer;

    const result = await determineMenuType(menuOffer);

    expect(result).toEqual(MenuType.FEATURED);
  });

  it('should return MARKETPLACE when menu offer does not match any id stored within the site config', async () => {
    const siteConfig: Site = {
      dealsOfTheWeekMenu: {
        id: 'deals-of-the-week-id',
      },
      featuredOffersMenu: {
        id: 'featured-id',
      },
      id: 'site_id_1',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    getSiteConfigMock.mockResolvedValue(siteConfig);

    const result = await determineMenuType(sanityMenuOffer);

    expect(result).toEqual(MenuType.MARKETPLACE);
  });

  it('should return MARKETPLACE when site config is not found', async () => {
    getSiteConfigMock.mockResolvedValue(undefined);

    const result = await determineMenuType(sanityMenuOffer);

    expect(result).toEqual(MenuType.MARKETPLACE);
  });
});
