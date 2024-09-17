import { Company } from '@blc-mono/discovery/application/models/Company';
import { COMPANY_PREFIX } from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';

export type CompanyEntity = Company & {
  partitionKey: string;
  sortKey: string;
};

export class CompanyKeyBuilders {
  static readonly buildPartitionKey = (companyId: string): string => `${COMPANY_PREFIX}${companyId}`;

  static readonly buildSortKey = (companyId: string): string => `${COMPANY_PREFIX}${companyId}`;
}
