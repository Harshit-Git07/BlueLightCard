import { Company as SanityCompany } from '@bluelightcard/sanity-types';

import { Company } from '../../application/models/Company';

import { mapSanityCompanyToCompany } from './mapSanityCompanyToCompany';

describe('mapSanityCompanyToCompany', () => {
  it('should map a valid SanityCompany to a Company object correctly', () => {
    const expected: Company = {
      id: 'company-id',
      type: 'company',
      legacyCompanyId: 123,
      name: 'Test Company',
      logo: 'https://example.com/logo.jpg',
      ageRestrictions: '18+, 21+',
      alsoKnownAs: ['Alias 1', 'Alias 2'],
      includedTrusts: ['Service Restriction'],
      excludedTrusts: ['Service Restriction 2'],
      categories: [
        {
          id: 101,
          name: 'Category Item',
          parentCategoryIds: [],
          level: 1,
          updatedAt: expect.any(String),
        },
      ],
      local: false,
      locations: [],
      updatedAt: '2023-01-02T00:00:00Z',
    };

    const result = mapSanityCompanyToCompany(sanityCompany);

    expect(result).toStrictEqual(expected);
  });

  it('should map categories with default values', () => {
    const expected: Company = {
      id: 'company-id',
      type: 'company',
      legacyCompanyId: 123,
      name: 'Test Company',
      logo: 'https://example.com/logo.jpg',
      ageRestrictions: '18+, 21+',
      alsoKnownAs: ['Alias 1', 'Alias 2'],
      includedTrusts: ['Service Restriction'],
      excludedTrusts: ['Service Restriction 2'],
      categories: [
        {
          id: 0,
          name: '',
          parentCategoryIds: [],
          level: 0,
          updatedAt: expect.any(String),
        },
      ],
      local: false,
      locations: [],
      updatedAt: '2023-01-02T00:00:00Z',
    };

    const result = mapSanityCompanyToCompany({
      ...sanityCompany,
      categorySelection: [
        {
          _key: 'category-key',
          category1: {
            _id: 'category1-id',
            _type: 'category',
            _createdAt: '2023-01-01T00:00:00Z',
            _updatedAt: '2023-01-02T00:00:00Z',
            _rev: 'rev-id',
            level: undefined,
          },
          categoryItem: {
            _id: 'category-item-id',
            _type: 'category.item',
            _createdAt: '2023-01-01T00:00:00Z',
            _updatedAt: '2023-01-02T00:00:00Z',
            _rev: 'rev-id',
            id: undefined,
            name: undefined,
          },
        },
      ],
    });

    expect(result).toStrictEqual(expected);
  });

  it('should throw an error if brandCompanyDetails is missing', () => {
    const sanityCompanyWithoutBrandDetails: SanityCompany = {
      ...sanityCompany,
      brandCompanyDetails: undefined,
    };

    expect(() => mapSanityCompanyToCompany(sanityCompanyWithoutBrandDetails)).toThrow(
      'Missing sanity field: brandCompanyDetails',
    );
  });

  it('should throw an error if companyName is missing in brandCompanyDetails', () => {
    const sanityCompanyWithoutCompanyName: SanityCompany = {
      ...sanityCompany,
      brandCompanyDetails: [
        {
          _key: 'brand-key',
          companyLogo: {
            default: {
              _type: 'image',
              asset: {
                _id: 'logo-id',
                _type: 'sanity.imageAsset',
                _createdAt: '2023-01-01T00:00:00Z',
                _updatedAt: '2023-01-02T00:00:00Z',
                _rev: 'rev-id',
                url: 'https://example.com/logo.jpg',
              },
            },
          },
          ageRestrictions: [
            {
              _id: '1',
              _type: 'age.restriction',
              name: '18+',
              _createdAt: '2023-01-01T00:00:00Z',
              _updatedAt: '2023-01-02T00:00:00Z',
              _rev: 'rev-id',
            },
            {
              _id: '2',
              _type: 'age.restriction',
              name: '21+',
              _createdAt: '2023-01-01T00:00:00Z',
              _updatedAt: '2023-01-02T00:00:00Z',
              _rev: 'rev-id2',
            },
          ],
        },
      ],
    };

    expect(() => mapSanityCompanyToCompany(sanityCompanyWithoutCompanyName)).toThrow(
      'Missing sanity field: companyName',
    );
  });

  it('should throw an error if companyName is missing in brandCompanyDetails', () => {
    const sanityCompanyWithoutCompanyName: SanityCompany = {
      ...sanityCompany,
      brandCompanyDetails: [
        {
          _key: 'brand-key',
          companyName: 'company name',
          companyLogo: {
            default: {
              _type: 'image',
              asset: {
                _id: 'logo-id',
                _type: 'sanity.imageAsset',
                _createdAt: '2023-01-01T00:00:00Z',
                _updatedAt: '2023-01-02T00:00:00Z',
                _rev: 'rev-id',
                url: 'https://example.com/logo.jpg',
              },
            },
          },
          ageRestrictions: undefined,
        },
      ],
    };

    expect(() => mapSanityCompanyToCompany(sanityCompanyWithoutCompanyName)).toThrow(
      'Missing sanity field: ageRestrictions',
    );
  });
});

const sanityCompany: SanityCompany = {
  _id: 'company-id',
  _type: 'company',
  _createdAt: '2023-01-01T00:00:00Z',
  _updatedAt: '2023-01-02T00:00:00Z',
  _rev: 'rev-id',
  companyId: 123,
  brandCompanyDetails: [
    {
      _key: 'brand-key',
      companyName: 'Test Company',
      companyLogo: {
        default: {
          _type: 'image',
          asset: {
            _id: 'logo-id',
            _type: 'sanity.imageAsset',
            _createdAt: '2023-01-01T00:00:00Z',
            _updatedAt: '2023-01-02T00:00:00Z',
            _rev: 'rev-id',
            url: 'https://example.com/logo.jpg',
          },
        },
      },
      ageRestrictions: [
        {
          _id: '1',
          _type: 'age.restriction',
          name: '18+',
          _createdAt: '2023-01-01T00:00:00Z',
          _updatedAt: '2023-01-02T00:00:00Z',
          _rev: 'rev-id',
        },
        {
          _id: '2',
          _type: 'age.restriction',
          name: '21+',
          _createdAt: '2023-01-01T00:00:00Z',
          _updatedAt: '2023-01-02T00:00:00Z',
          _rev: 'rev-id2',
        },
      ],
    },
  ],
  alsoKnownAs: ['Alias 1', 'Alias 2'],
  includedTrust: [
    {
      _id: 'restriction-id',
      name: 'Service Restriction',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-02T00:00:00Z',
      _rev: 'rev-id',
      _type: 'trust',
      code: 'Service Restriction Code',
    },
  ],
  excludedTrust: [
    {
      _id: 'restriction-id',
      name: 'Service Restriction 2',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-02T00:00:00Z',
      _rev: 'rev-id',
      _type: 'trust',
      code: 'Service Restriction Code 2',
    },
  ],
  local: false,
  categorySelection: [
    {
      _key: 'category-key',
      category1: {
        _id: 'category1-id',
        _type: 'category',
        _createdAt: '2023-01-01T00:00:00Z',
        _updatedAt: '2023-01-02T00:00:00Z',
        _rev: 'rev-id',
        level: 1,
      },
      categoryItem: {
        _id: 'category-item-id',
        _type: 'category.item',
        _createdAt: '2023-01-01T00:00:00Z',
        _updatedAt: '2023-01-02T00:00:00Z',
        _rev: 'rev-id',
        id: 101,
        name: 'Category Item',
      },
    },
  ],
};
