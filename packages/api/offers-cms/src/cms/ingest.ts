import { type WebhookEventResult } from '@bluelightcard/sanity-types';
import { Table } from 'sst/node/table';

import { type ILogger } from '@blc-mono/core/utils/logger';

import { createDbConnection } from '../lib/db';
import { type SanityChangeEvent } from '../lib/events';

const db = createDbConnection();

type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

type WebhookResultRecord = ArrayElement<WebhookEventResult>;

type RecordType = WebhookResultRecord['_type'];

type Record<type extends RecordType> = Extract<
  WebhookResultRecord,
  {
    _type: type;
  }
>;

export async function ingestOffer(record: Record<'offer'>, logger: ILogger) {
  const brand = record.brands?.find((brand) => brand?.code === process.env.OFFERS_BRAND);

  if (!brand) {
    logger.warn({
      message: `offer ${record._id} doesn't exist for brand ${process.env.OFFERS_BRAND}`,
    });
    return;
  }

  await db.put({
    TableName: Table.cmsOffersData.tableName,
    Item: {
      ...record,
      companyId: record.company?._id.toString() ?? '',
    },
  });
}

export async function ingestCompany(record: Record<'company'>, logger: ILogger) {
  const brand = record.brandCompanyDetails?.find(
    (company) => company.brand?.code === process.env.OFFERS_BRAND,
  );

  if (!brand) {
    logger.warn({
      message: `company ${record._id} doesn't exist for brand ${process.env.OFFERS_BRAND}`,
    });
    return;
  }

  await db.put({
    TableName: Table.cmsCompanyData.tableName,
    Item: {
      ...record,
      companyId: brand.companyId?.toString() ?? '',
    },
  });
}

export async function ingestRawRecord(record: WebhookResultRecord) {
  await db.put({
    TableName: Table.cmsRawData.tableName,
    Item: record,
  });
}

export function extractEvent(event: SanityChangeEvent) {
  return JSON.parse(event.body) as WebhookResultRecord;
}
