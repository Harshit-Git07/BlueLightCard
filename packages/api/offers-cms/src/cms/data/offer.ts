import { type Offer } from '@bluelightcard/sanity-types';

import { OFFERS_DATA_TABLE_NAME } from '../../../infrastructure/dynamo';
import { dynamo } from '../../lib/dynamo';
import { coerceNumber } from '../../lib/utils';

async function _legacy_getOffer(id: number) {
  const res = await dynamo.query({
    TableName: OFFERS_DATA_TABLE_NAME,
    IndexName: 'legacyId',
    ExpressionAttributeValues: { ':legacyId': String(id) },
    KeyConditionExpression: 'offerId = :legacyId',
  });

  if (!res.Items) {
    return null;
  }

  return res.Items[0] as Offer;
}

async function _modern_getOffer(id: string) {
  const res = await dynamo.query({
    TableName: OFFERS_DATA_TABLE_NAME,
    ExpressionAttributeNames: { '#id': '_id' },
    ExpressionAttributeValues: { ':modernId': id },
    KeyConditionExpression: '#id = :modernId',
  });

  if (!res.Items || res.Items.length === 0) {
    return null;
  }

  return res.Items[0] as Offer;
}

export async function getOffer(id: string | number) {
  const _id = coerceNumber(id);

  if (typeof _id === 'number') {
    return _legacy_getOffer(_id);
  }

  return _modern_getOffer(_id);
}

export async function getOffersByCompanyId(companyId: string) {
  const res = await dynamo.query({
    TableName: OFFERS_DATA_TABLE_NAME,
    IndexName: 'companyId',
    ExpressionAttributeValues: { ':id': companyId },
    KeyConditionExpression: 'companyId = :id',
  });

  if (!res.Items || res.Items.length === 0) {
    return null;
  }

  return res.Items as Offer[];
}
