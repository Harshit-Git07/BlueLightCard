import { Company } from '../application/models/Company';
import { Company as SanityCompany } from '../application/models/SanityTypes';

import { mapSanityCompanyToCompany } from './mapSanityCompanyToCompany';

describe('mapSanityCompanyToCompany', () => {
  it('should map a valid SanityCompany to a Company object correctly', () => {
    const sanityCompany: SanityCompany = {
      _id: 'company-id',
      _type: 'company',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-02T00:00:00Z',
      _rev: 'rev-id',
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
          companyId: 123,
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
      restrictions: [
        {
          _id: 'restriction-id',
          name: 'Service Restriction',
          _createdAt: '2023-01-01T00:00:00Z',
          _updatedAt: '2023-01-02T00:00:00Z',
          _rev: 'rev-id',
          _type: 'trust.service',
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

    const expected: Company = {
      id: 'company-id',
      legacyCompanyId: 123,
      name: 'Test Company',
      logo: 'https://example.com/logo.jpg',
      ageRestrictions: '18+, 21+',
      alsoKnownAs: ['Alias 1', 'Alias 2'],
      serviceRestrictions: ['Service Restriction'],
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
      updatedAt: '2023-01-02T00:00:00Z',
    };

    const result = mapSanityCompanyToCompany(sanityCompany);

    expect(result).toStrictEqual(expected);
  });

  it('should throw an error if brandCompanyDetails is missing', () => {
    const sanityCompanyWithoutBrandDetails: SanityCompany = {
      _id: 'company-id',
      _type: 'company',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-02T00:00:00Z',
      _rev: 'rev-id',
    };

    expect(() => mapSanityCompanyToCompany(sanityCompanyWithoutBrandDetails)).toThrow(
      'Missing sanity field: brandCompanyDetails',
    );
  });

  it('should throw an error if companyName is missing in brandCompanyDetails', () => {
    const sanityCompanyWithoutCompanyName: SanityCompany = {
      _id: 'company-id',
      _type: 'company',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-02T00:00:00Z',
      _rev: 'rev-id',
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
          companyId: 123,
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

  it('should throw an error if companyLogo.default.asset.url is missing', () => {
    const sanityCompanyWithoutLogoUrl: SanityCompany = {
      _id: 'company-id',
      _type: 'company',
      _createdAt: '2023-01-01T00:00:00Z',
      _updatedAt: '2023-01-02T00:00:00Z',
      _rev: 'rev-id',
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
              },
            },
          },
          companyId: 123,
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

    expect(() => mapSanityCompanyToCompany(sanityCompanyWithoutLogoUrl)).toThrow(
      'Missing sanity field: companyLogo.default.asset.url',
    );
  });
});
