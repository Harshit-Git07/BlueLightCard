import { companyLocationFactory } from '@blc-mono/discovery/application/factories/CompanyLocationFactory';

import { CompanyLocationKeyBuilders } from '../../../schemas/CompanyLocationEntity';

import {
  mapCompanyLocationEntityToCompanyLocation,
  mapCompanyLocationToCompanyLocationEntity,
} from './CompanyLocationMapper';

describe('Company Location Mapper', () => {
  it('should map a CompanyLocation to a CompanyLocationEntity', () => {
    const companyLocation = companyLocationFactory.build();

    const result = mapCompanyLocationToCompanyLocationEntity(companyLocation);

    expect(result).toEqual({
      partitionKey: CompanyLocationKeyBuilders.buildPartitionKey(companyLocation.companyId),
      sortKey: CompanyLocationKeyBuilders.buildSortKey(companyLocation.id),
      id: companyLocation.id,
      type: 'company-location',
      companyId: companyLocation.companyId,
      location: companyLocation.location,
      updatedAt: companyLocation.updatedAt,
      batchIndex: companyLocation.batchIndex,
      totalBatches: companyLocation.totalBatches,
      addressLine1: companyLocation.addressLine1,
      addressLine2: companyLocation.addressLine2,
      country: companyLocation.country,
      postcode: companyLocation.postcode,
      region: companyLocation.region,
      storeName: companyLocation.storeName,
      telephone: companyLocation.telephone,
      townCity: companyLocation.townCity,
    });
  });

  it('should map a CompanyLocationEntity to a CompanyLocation', () => {
    const companyLocation = companyLocationFactory.build();
    const companyLocationEntity = {
      ...companyLocation,
      partitionKey: CompanyLocationKeyBuilders.buildPartitionKey(companyLocation.companyId),
      sortKey: CompanyLocationKeyBuilders.buildSortKey(companyLocation.id),
    };

    const result = mapCompanyLocationEntityToCompanyLocation(companyLocationEntity);

    expect(result).toEqual(companyLocation);
  });
});
