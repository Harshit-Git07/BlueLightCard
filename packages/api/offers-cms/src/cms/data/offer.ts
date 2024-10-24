import { type Offer } from '@bluelightcard/sanity-types';
import { Table } from 'sst/node/table';

import { dynamo } from '../../lib/dynamo';

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

  const item = await dynamo.query(query);

  if (!item.Items) {
    return null;
  }

  return item.Items[0] as Offer;
}

export async function getOffersByCompanyId(companyId: string) {
  const res = await dynamo.query({
    TableName: Table.cmsOffersData.tableName,
    IndexName: 'companyId',
    ExpressionAttributeValues: { ':id': companyId },
    KeyConditionExpression: 'companyId = :id',
  });

  return res.Items as Offer[];
}
