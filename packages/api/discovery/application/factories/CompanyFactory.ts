import * as Factory from 'factory.ts';

import { Company } from '../models/Company';

import { categoryFactory } from './CategoryFactory';

export const companyFactory = Factory.Sync.makeFactory<Company>({
  id: Factory.each((i) => (i + 1).toString()),
  type: 'company',
  legacyCompanyId: 201,
  name: 'Sample Company',
  logo: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
  ageRestrictions: '18+',
  alsoKnownAs: ['Alias1', 'Alias2'],
  includedTrusts: ['companyTrustRestriction1', 'companyTrustRestriction2'],
  excludedTrusts: [],
  categories: [categoryFactory.build()],
  local: true,
  updatedAt: '2024-09-01T00:00:00',
  locations: [],
});
