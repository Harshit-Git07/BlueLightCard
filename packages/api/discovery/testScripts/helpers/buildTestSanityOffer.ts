import {
  AgeRestriction as SanityAgeRestriction,
  Offer as SanityOffer,
  Trust as SanityTrust,
} from '@bluelightcard/sanity-types';
import { addMonths, subMonths } from 'date-fns';
import { v4 } from 'uuid';

export interface TestOfferConfig {
  id?: string;
  companyId?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  includedTrusts?: string[];
  excludedTrusts?: string[];
  evergreen?: boolean;
  status?: 'live' | 'expired' | 'deactivated';
  ageRestrictions?: string[];
}

export function buildTestSanityOffer(testOfferConfig?: TestOfferConfig): SanityOffer {
  const companyId = testOfferConfig?.companyId ?? v4().toString();
  const offerId = testOfferConfig?.id ?? v4().toString();
  return {
    tags: [],
    _createdAt: '2024-07-30T09:36:14Z',
    _id: offerId,
    _rev: 'HxAzVxEm31DYQTCb4WY0L5',
    _type: 'offer',
    _updatedAt: new Date().toISOString(),
    offerId: 1,
    boostDetails: {
      _type: 'boost.type',
      boosted: false,
      boost: {
        _rev: '37a0497b-9acc-4725-847e-ce707ffbe8de',
        _id: '37a0497b-9acc-4725-847e-ce707ffbe8de',
        _type: 'boost',
        _createdAt: '',
        _updatedAt: '',
      },
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
      _id: companyId,
      companyId: 1,
      brandCompanyDetails: [
        {
          _key: '',
          companyName: `Test Company ${companyId}`,
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
          ageRestrictions: testOfferConfig?.ageRestrictions
            ? buildSanityAgeRestrictions(testOfferConfig?.ageRestrictions)
            : [],
        },
      ],
    },
    discountDetails: {
      _type: 'discount.type',
      discountCoverage: 'all-site',
      discountType: 'reduction',
    },
    evergreen: testOfferConfig?.evergreen ?? false,
    expires: testOfferConfig?.endDate ?? addMonths(new Date(), 1).toISOString(),
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
    name: testOfferConfig?.name ?? `Test Offer ${offerId}`,
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
    includedTrusts: testOfferConfig?.includedTrusts ? buildTestSanityTrusts(testOfferConfig.includedTrusts) : [],
    excludedTrusts: testOfferConfig?.excludedTrusts ? buildTestSanityTrusts(testOfferConfig.excludedTrusts) : [],
    start: testOfferConfig?.startDate ?? subMonths(new Date(), 1).toISOString(),
    status: testOfferConfig?.status ?? 'live',
    termsAndConditions: {
      _type: 'richtext-module',
      tableOfContents: false,
      tocPosition: 'right',
    },
  };
}

const buildTestSanityTrusts = (trusts: string[]): SanityTrust[] => {
  return trusts.map((trust) => ({
    _id: v4(),
    _rev: v4(),
    _type: 'trust',
    _createdAt: '',
    _updatedAt: '',
    name: trust,
  }));
};

const buildSanityAgeRestrictions = (ageRestrictions: string[]): SanityAgeRestriction[] => {
  return ageRestrictions.map((ageRestriction) => ({
    _id: v4(),
    _rev: v4(),
    _type: 'age.restriction',
    _createdAt: '',
    _updatedAt: '',
    name: ageRestriction,
  }));
};
