import { type Company } from '@bluelightcard/sanity-types';
import { Table } from 'sst/node/table';

import { dynamo } from '../../lib/dynamo';
import { env } from '../../lib/env';

export async function getCompany(id: string) {
  const cmsTable = Table.cmsCompanyData.tableName;
  const item = await dynamo.get({
    TableName: cmsTable,
    Key: {
      companyId: id,
    },
  });

  if (!item.Item) {
    return null;
  }

  return item.Item as Company;
}

export const extractBrand = (company: Company) => {
  return company.brandCompanyDetails?.find((brand) => brand.brand?.code === env.BRAND);
};
