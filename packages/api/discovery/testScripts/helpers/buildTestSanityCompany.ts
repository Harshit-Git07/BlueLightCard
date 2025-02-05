import { Company as SanityCompany } from '@bluelightcard/sanity-types';
import { v4 } from 'uuid';

export interface TestCompanyConfig {
  id?: string;
}

export function buildTestSanityCompany(testCompanyConfig?: TestCompanyConfig): SanityCompany {
  const companyId = testCompanyConfig?.id ?? v4().toString();
  return {
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
        ageRestrictions: [],
      },
    ],
  };
}
