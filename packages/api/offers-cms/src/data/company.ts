import { type Company } from '@bluelightcard/sanity-types';
import { Table } from 'sst/node/table';

import { createDbConnection } from '../lib/db';

const db = createDbConnection();

export async function getCompany(id: string) {
  const cmsTable = Table.cmsCompanyData.tableName;
  const item = await db.get({
    TableName: cmsTable,
    Key: {
      _id: id,
      _type: 'company',
    },
  });

  if (!item.Item) {
    return null;
  }

  return item.Item as Company;
}
