import { Company } from '@blc-mono/discovery/application/models/Company';
import { CompanyEntity, CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';

export function mapCompanyToCompanyEntity(company: Company): CompanyEntity {
  return {
    partitionKey: CompanyKeyBuilders.buildPartitionKey(company.id),
    sortKey: CompanyKeyBuilders.buildSortKey(company.id),
    id: company.id,
    legacyCompanyId: company.legacyCompanyId,
    name: company.name,
    logo: company.logo,
    ageRestrictions: company.ageRestrictions,
    alsoKnownAs: company.alsoKnownAs,
    serviceRestrictions: company.serviceRestrictions,
    categories: company.categories,
    local: company.local,
    updatedAt: company.updatedAt,
  };
}

export function mapCompanyEntityToCompany(companyEntity: CompanyEntity): Company {
  return {
    id: companyEntity.id,
    legacyCompanyId: companyEntity.legacyCompanyId,
    name: companyEntity.name,
    logo: companyEntity.logo,
    ageRestrictions: companyEntity.ageRestrictions,
    alsoKnownAs: companyEntity.alsoKnownAs,
    serviceRestrictions: companyEntity.serviceRestrictions,
    categories: companyEntity.categories,
    local: companyEntity.local,
    updatedAt: companyEntity.updatedAt,
  };
}
