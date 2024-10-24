import { Offer as SanityOffer } from '@bluelightcard/sanity-types';
import { v4 } from 'uuid';

export function buildTestSanityOffer(): SanityOffer {
  return {
    tags: [],
    _createdAt: '2024-07-30T09:36:14Z',
    _id: v4(),
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _type: 'offer',
    _updatedAt: new Date().toISOString(),
    offerId: 1,
    boostDetails: {
      _type: 'boost.type',
      boost: {
        _rev: '37a0497b-9acc-4725-847e-ce707ffbe8de',
        _id: '37a0497b-9acc-4725-847e-ce707ffbe8de',
        _type: 'boost',
        _createdAt: '',
        _updatedAt: '',
      },
      expires: '2024-07-22T09:15:00.000Z',
      start: '2024-07-15T09:00:58.658Z',
    },
    brands: [
      {
        _rev: '17223d8b-b581-4a37-b0fc-7b6d8da5fb61',
        _id: '17223d8b-b581-4a37-b0fc-7b6d8da5fb61',
        _type: 'brand',
        _createdAt: '',
        _updatedAt: '',
      },
    ],
    categorySelection: [],
    commonExclusions: {
      _type: 'common.exclusion.type',
      commonExclusions: [
        {
          _rev: '285b44f4-a140-4c7c-a358-4c0a38f5d1cc',
          _id: '285b44f4-a140-4c7c-a358-4c0a38f5d1cc',
          _createdAt: '',
          _updatedAt: '',
          _type: 'common.exclusion',
        },
      ],
    },
    company: {
      _type: 'company',
      _createdAt: '',
      _updatedAt: '2024-08-05T16:50:14Z',
      _rev: '',
      _id: v4().toString(),
      companyId: 1,
      brandCompanyDetails: [
        {
          _key: '',
          companyName: `Test Company ${v4().toString()}`,
          companyLogo: {
            default: {
              _type: 'image',
              asset: {
                _id: '589379db93d824a373b45991d19a4ea231196aa4',
                url: 'https://testimage.com',
                _type: 'sanity.imageAsset',
                _rev: '589379db93d824a373b45991d19a4ea231196aa4',
                _createdAt: '',
                _updatedAt: '',
              },
            },
          },
          ageRestrictions: [],
        },
      ],
    },
    discountDetails: {
      _type: 'discount.type',
      discountCoverage: 'all-site',
      discountType: 'reduction',
    },
    evergreen: false,
    expires: '2025-08-05',
    image: {
      default: {
        _type: 'image',
        asset: {
          _id: '589379db93d824a373b45991d19a4ea231196aa4',
          url: 'https://testimage.com',
          _type: 'sanity.imageAsset',
          _rev: '589379db93d824a373b45991d19a4ea231196aa4',
          _createdAt: '',
          _updatedAt: '',
        },
      },
    },
    name: `Test Offer ${v4().toString()}`,
    offerDescription: {
      _type: 'richtext-module',
      content: [
        {
          _key: '4fb6768e6fd0',
          _type: 'block',
          children: [
            {
              _key: '472d42ff43d7',
              _type: 'span',
              marks: [],
              text: 'Test to see if all linked to webhook - attempt n',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      tableOfContents: false,
      tocPosition: 'right',
    },
    offerType: {
      _type: 'offer.type',
      offerType: 'online',
    },
    includedTrusts: [],
    excludedTrusts: [],
    start: '2024-08-04',
    status: 'live',
    termsAndConditions: {
      _type: 'richtext-module',
      tableOfContents: false,
      tocPosition: 'right',
    },
  };
}
