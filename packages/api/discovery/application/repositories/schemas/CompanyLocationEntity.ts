import { CompanyLocation } from '../../models/CompanyLocation';
import { COMPANY_LOCATION_PREFIX, COMPANY_PREFIX } from '../constants/PrimaryKeyPrefixes';

export type CompanyLocationEntity = CompanyLocation & {
  partitionKey: string;
  sortKey: string;
};

export class CompanyLocationKeyBuilders {
  static readonly buildPartitionKey = (companyId: string) => `${COMPANY_PREFIX}${companyId}`;

  static readonly buildSortKey = (locationId: string) => `${COMPANY_LOCATION_PREFIX}${locationId}`;
}
