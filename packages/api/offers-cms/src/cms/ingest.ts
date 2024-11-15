import { Table } from 'sst/node/table';

import { type ILogger } from '@blc-mono/core/utils/logger';

import { dynamo } from '../lib/dynamo';
import { env } from '../lib/env';
import { type Record, type SanityChangeEvent, type WebhookResultRecord } from '../lib/events';

export async function ingestOffer(record: Record<'offer'>, logger: ILogger) {
  const brand = record.brands?.find((brand) => brand?.code === env.BRAND);

  if (!brand) {
    logger.warn({
      message: `offer ${record._id} doesn't exist for brand ${env.BRAND}`,
    });
    return;
  }

  await dynamo.put({
    TableName: Table.cmsOffer.tableName,
    Item: {
      ...record,
      offerId: record.offerId?.toString(),
      companyId: record.company?._id.toString(),
    },
  });
}

export async function ingestCompany(record: Record<'company'>, logger: ILogger) {
  const brand = record.brandCompanyDetails?.find((company) => company.brand?.code === env.BRAND);

  if (!brand) {
    logger.warn({
      message: `company ${record._id} doesn't exist for brand ${env.BRAND}`,
    });
    return;
  }

  await dynamo.put({
    TableName: Table.cmsCompany.tableName,
    Item: {
      ...record,
      companyId: record.companyId?.toString(),
    },
  });
}

export async function ingestRawRecord(record: WebhookResultRecord) {
  await dynamo.put({
    TableName: Table.cmsAll.tableName,
    Item: record,
  });
}

export function extractEvent(event: SanityChangeEvent) {
  // TODO: Remove following if clause once JSON format has been fully cutover
  if (typeof event.body === 'string') {
    return JSON.parse(event.body) as WebhookResultRecord;
  }
  return event.body;
}
