import { companyFactory } from './CompanyFactory';

describe('Company Factory', () => {
  it('should build a default Company object', () => {
    const company = companyFactory.build();
    expect(company).toEqual({
      id: '1',
      type: 'company',
      legacyCompanyId: 201,
      name: 'Sample Company',
      logo: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
      ageRestrictions: '18+',
      alsoKnownAs: ['Alias1', 'Alias2'],
      includedTrusts: ['companyTrustRestriction1', 'companyTrustRestriction2'],
      excludedTrusts: [],
      categories: expect.any(Array),
      local: true,
      locations: [],
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build a Company object with overridden name', () => {
    const company = companyFactory.build({ name: 'Custom Company' });
    expect(company.name).toBe('Custom Company');
  });
});
