import { v4 } from 'uuid';

import { SanityCompanyLocationEventBody } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyLocationToCompanyLocation';

const defaultTestSanityCompanyLocation: SanityCompanyLocationEventBody = {
  _id: v4().toString(),
  _type: 'company.location.batch',
  _updatedAt: new Date().toISOString(),
  batchIndex: 1,
  locations: [
    {
      _type: 'company.location',
      addressLine1: '1 Charing Cross',
      addressLine2: '',
      storeName: 'Mock Store',
      telephone: '+44712345678',
      townCity: 'Strand',
      region: 'London',
      country: 'UK',
      location: {
        _type: 'geopoint',
        lat: 51.50735,
        lng: -0.12776,
      },
      postcode: 'SW1A 2DR',
    },
    {
      _type: 'company.location',
      addressLine1: 'Syston Road',
      addressLine2: '',
      storeName: 'Charnwood Edge',
      telephone: '+44712345678',
      townCity: 'Leciester',
      region: 'Leicestershire',
      country: 'UK',
      location: {
        _type: 'geopoint',
        lat: 52.71044,
        lng: -1.09585,
      },
      postcode: 'LE7 4UZ',
    },
  ],
  operation: 'update',
  totalBatches: 1,
};

export function buildTestSanityCompanyLocation(
  overrides?: Partial<SanityCompanyLocationEventBody>,
): SanityCompanyLocationEventBody {
  return {
    ...defaultTestSanityCompanyLocation,
    ...overrides,
  };
}
