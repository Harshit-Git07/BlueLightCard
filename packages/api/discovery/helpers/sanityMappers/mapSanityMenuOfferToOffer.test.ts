import {
  BoostType as SanityBoostType,
  DiscountType as SanityDiscountType,
  MenuOffer,
  Offer as SanityOffer,
} from '@bluelightcard/sanity-types';

import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { mapSanityOfferToOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityOfferToOffer';

import { mapSanityMenuOfferToOffer } from './mapSanityMenuOfferToOffer';

jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityOfferToOffer');

describe('mapSanityMenuOfferToOffer', () => {
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

  const validSanityOffer: SanityOffer = {
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

  it('should map inclusions correctly', () => {
    const sanityMenuOffer: MenuOffer = {
      _id: 'menu1',
      _type: 'menu.offer',
      _rev: 'rev1',
      _updatedAt: '2023-01-02T00:00:00Z',
      _createdAt: '2023-01-02T00:00:00Z',
      inclusions: [validSanityOffer],
    };

    const expected: Offer[] = [
      {
        id: '1',
        legacyOfferId: 123,
        name: 'Test Offer',
        status: 'live',
        offerType: 'online',
        offerDescription: 'This is a heading↵ This is a paragraph.↵ ',
        image: 'https://example.com/image.jpg',
        offerStart: '2023-01-01',
        offerEnd: '2023-12-31',
        evergreen: true,
        tags: ['tag1', 'tag2'],
        includedTrusts: [],
        excludedTrusts: [],
        company: {
          id: 'company1',
          name: 'Test Company',
          legacyCompanyId: undefined,
          logo: 'logo-ref',
          ageRestrictions: 'none',
          alsoKnownAs: [],
          includedTrusts: ['trust-service-code'],
          excludedTrusts: [],
          categories: [],
          local: false,
          updatedAt: expect.any(String),
        },
        categories: [
          {
            id: 1,
            name: 'Category Item Name',
            parentCategoryIds: [],
            level: 1,
            updatedAt: expect.any(String),
          },
        ],
        local: false,
        discount: {
          type: 'percentage',
          description: 'free-entry',
          coverage: 'all-site',
          updatedAt: expect.any(String),
        },
        commonExclusions: ['Exclusion Name'],
        boost: {
          type: 'boost.type',
          boostStart: '2023-01-01',
          boostEnd: '2023-12-31',
          updatedAt: expect.any(String),
        },
        updatedAt: '2023-01-02T00:00:00Z',
      },
    ];

    (mapSanityOfferToOffer as jest.Mock).mockReturnValue(expected[0]);

    const result = mapSanityMenuOfferToOffer(sanityMenuOffer);

    expect(result).toEqual(expected);
  });

  it('should return an empty array if inclusions are not present', () => {
    const sanityMenuOffer: MenuOffer = {
      _id: 'menu2',
      _type: 'menu.offer',
      _rev: 'rev2',
      _updatedAt: '2023-01-02T00:00:00Z',
      _createdAt: '2023-01-02T00:00:00Z',
    };

    const result = mapSanityMenuOfferToOffer(sanityMenuOffer);

    expect(result).toEqual([]);
  });
});
