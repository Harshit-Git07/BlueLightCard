import * as Factory from 'factory.ts';

import { CompanyLocation } from '../models/CompanyLocation';

export const companyLocationFactory = Factory.Sync.makeFactory<CompanyLocation>({
  id: Factory.each((i) => (i + 1).toString()),
  type: 'company-location',
  companyId: Factory.each((i) => `company-${(i + 1).toString()}`),
  batchIndex: 1,
  location: {
    lat: 51.5074,
    lon: -0.1278,
  },
  totalBatches: 2,
  updatedAt: '2024-09-01T00:00:00',
  addressLine1: '123 Fake Street',
  addressLine2: 'Fake Town',
  country: 'UK',
  postcode: 'AB1 2CD',
  region: 'London',
  storeName: 'Fake Store',
  telephone: '0123456789',
  townCity: 'Fake City',
});
