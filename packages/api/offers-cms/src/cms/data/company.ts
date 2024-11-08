import { type Company } from '@bluelightcard/sanity-types';

import { COMPANY_DATA_TABLE_NAME } from '../../../infrastructure/dynamo';
import { dynamo } from '../../lib/dynamo';
import { env } from '../../lib/env';
import { coerceNumber } from '../../lib/utils';

async function _legacy_getCompany(id: number) {
  const res = await dynamo.query({
    TableName: COMPANY_DATA_TABLE_NAME,
    IndexName: 'legacyId',
    ExpressionAttributeValues: { ':legacyId': String(id) },
    KeyConditionExpression: 'companyId = :legacyId',
  });

  if (!res.Items || res.Items.length === 0) {
    return null;
  }
  return res.Items[0] as Company;
}

async function _modern_getCompany(id: string) {
  const res = await dynamo.get({
    TableName: COMPANY_DATA_TABLE_NAME,
    Key: {
      _id: id,
    },
  });

  if (!res.Item) {
    return null;
  }

  return res.Item as Company;
}

export async function getCompany(id: string | number) {
  const _id = coerceNumber(id);

  if (typeof _id === 'number') {
    return _legacy_getCompany(_id);
  }

  return _modern_getCompany(_id);
}

export const extractBrand = (company: Company) => {
  return company.brandCompanyDetails?.find((brand) => brand.brand?.code === env.BRAND);
};
