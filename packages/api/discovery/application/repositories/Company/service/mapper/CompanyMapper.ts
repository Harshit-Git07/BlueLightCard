import { Company, Location } from '@blc-mono/discovery/application/models/Company';
import { CompanyLocation } from '@blc-mono/discovery/application/models/CompanyLocation';
import { CompanyEntity, CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';

export function mapCompanyToCompanyEntity(company: Company): CompanyEntity {
  return {
    partitionKey: CompanyKeyBuilders.buildPartitionKey(company.id),
    type: 'company',
    sortKey: CompanyKeyBuilders.buildSortKey(company.id),
    id: company.id,
    legacyCompanyId: company.legacyCompanyId,
    name: company.name,
    logo: company.logo,
    ageRestrictions: company.ageRestrictions,
    alsoKnownAs: company.alsoKnownAs,
    includedTrusts: company.includedTrusts,
    excludedTrusts: company.excludedTrusts,
    categories: company.categories,
    local: company.local,
    updatedAt: company.updatedAt,
    locations: company.locations,
  };
}

export function mapCompanyEntityToCompany(companyEntity: CompanyEntity): Company {
  return {
    id: companyEntity.id,
    type: 'company',
    legacyCompanyId: companyEntity.legacyCompanyId,
    name: companyEntity.name,
    logo: companyEntity.logo,
    ageRestrictions: companyEntity.ageRestrictions,
    alsoKnownAs: companyEntity.alsoKnownAs,
    includedTrusts: companyEntity.includedTrusts,
    excludedTrusts: companyEntity.excludedTrusts,
    categories: companyEntity.categories,
    local: companyEntity.local,
    updatedAt: companyEntity.updatedAt,
    locations: companyEntity.locations,
  };
}

// Company Location is the company location type that is stored in the database
// Location is the type that is stored within the company and offers object
export function mapCompanyLocationToLocation(companyLocation: CompanyLocation): Location {
  return {
    id: companyLocation.id,
    location: companyLocation.location,
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
