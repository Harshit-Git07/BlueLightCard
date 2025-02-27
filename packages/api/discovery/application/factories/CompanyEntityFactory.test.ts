import { companyEntityFactory } from '@blc-mono/discovery/application/factories/CompanyEntityFactory';

describe('Company Entity Factory', () => {
  it('should build a default Company Entity object', () => {
    const companyEntity = companyEntityFactory.build();
    expect(companyEntity).toEqual({
      partitionKey: 'COMPANY-1',
      sortKey: 'COMPANY-1',
      type: 'company',
      id: '1',
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

  it('should build a Company Entity object with overridden name', () => {
    const companyEntity = companyEntityFactory.build({ name: 'Custom Company' });
    expect(companyEntity.name).toBe('Custom Company');
  });
});
