import { CompanyLocation } from '@blc-mono/discovery/application/models/CompanyLocation';

import { CompanyLocationEntity, CompanyLocationKeyBuilders } from '../../../schemas/CompanyLocationEntity';

export function mapCompanyLocationToCompanyLocationEntity(companyLocation: CompanyLocation): CompanyLocationEntity {
  return {
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
  };
}

export function mapCompanyLocationEntityToCompanyLocation(
  companyLocationEntity: CompanyLocationEntity,
): CompanyLocation {
  return {
    id: companyLocationEntity.id,
    companyId: companyLocationEntity.companyId,
    type: 'company-location',
    location: companyLocationEntity.location,
    updatedAt: companyLocationEntity.updatedAt,
    batchIndex: companyLocationEntity.batchIndex,
    totalBatches: companyLocationEntity.totalBatches,
    addressLine1: companyLocationEntity.addressLine1,
    addressLine2: companyLocationEntity.addressLine2,
    country: companyLocationEntity.country,
    postcode: companyLocationEntity.postcode,
    region: companyLocationEntity.region,
    storeName: companyLocationEntity.storeName,
    telephone: companyLocationEntity.telephone,
    townCity: companyLocationEntity.townCity,
  };
}
