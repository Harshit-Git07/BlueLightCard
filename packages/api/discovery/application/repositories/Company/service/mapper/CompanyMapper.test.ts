import { companyFactory } from '@blc-mono/discovery/application/factories/CompanyFactory';
import { COMPANY_PREFIX } from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';
import { CompanyEntity, CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';

import * as target from './CompanyMapper';

describe('Company Mapper', () => {
  it('should map a Company to a CompanyEntity', () => {
    const company = companyFactory.build();

    const result = target.mapCompanyToCompanyEntity(company);

    expect(result).toEqual({
      partitionKey: `${COMPANY_PREFIX}${company.id}`,
      sortKey: `${COMPANY_PREFIX}${company.id}`,
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
    });
  });

  it('should map a CompanyEntity to a Company', () => {
    const company = companyFactory.build();
    const companyEntity: CompanyEntity = {
      ...company,
      partitionKey: CompanyKeyBuilders.buildPartitionKey(company.id),
      sortKey: CompanyKeyBuilders.buildSortKey(company.id),
    };

    const result = target.mapCompanyEntityToCompany(companyEntity);

    expect(result).toEqual(company);
  });
});
