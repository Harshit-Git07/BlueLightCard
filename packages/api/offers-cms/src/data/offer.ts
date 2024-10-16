import { type Offer } from '@bluelightcard/sanity-types';
import { Table } from 'sst/node/table';

import { createDbConnection } from '../lib/db';

const db = createDbConnection();

export async function getOffer(id: string) {
  const cmsTable = Table.cmsOffersData.tableName;

  const modernQueryCommand = {
    TableName: cmsTable,
    ExpressionAttributeNames: { '#id': '_id' },
    ExpressionAttributeValues: { ':modernId': id },
    KeyConditionExpression: '#id = :modernId',
  };

  const legacyQueryCommand = {
    TableName: cmsTable,
    IndexName: 'legacyId',
    ExpressionAttributeValues: { ':legacyId': id },
    KeyConditionExpression: 'offerId = :legacyId',
  };

  const query = isNaN(Number(id)) ? modernQueryCommand : legacyQueryCommand;

  const item = await db.query(query);

  if (!item.Items) {
    return null;
  }

  return item.Items[0] as Offer;
}
