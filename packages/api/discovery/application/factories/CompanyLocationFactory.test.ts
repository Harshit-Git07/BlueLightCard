import { companyLocationFactory } from './CompanyLocationFactory';

describe('Company Location Factory', () => {
  it('should build a default company location object', () => {
    const companyLocation = companyLocationFactory.build();
    expect(companyLocation).toEqual({
      addressLine1: '123 Fake Street',
      addressLine2: 'Fake Town',
      batchIndex: 1,
      companyId: 'company-1',
      country: 'UK',
      id: '1',
      location: {
        lat: 51.5074,
        lon: -0.1278,
      },
      postcode: 'AB1 2CD',
      region: 'London',
      storeName: 'Fake Store',
      telephone: '0123456789',
      totalBatches: 2,
      townCity: 'Fake City',
      type: 'company-location',
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build a company location object with overridden addressLine1', () => {
    const companyLocation = companyLocationFactory.build({ addressLine1: 'Custom Address Line 1' });
    expect(companyLocation.addressLine1).toBe('Custom Address Line 1');
  });
});
