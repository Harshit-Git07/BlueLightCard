import { WebhookEventResult } from '@bluelightcard/sanity-types';
import { Table } from 'sst/node/table';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

import { createDbConnection } from '../lib/db';
import { SanityChangeEvent } from '../lib/events';

const db = createDbConnection();

type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export async function ingestOffer(
  record: Extract<ArrayElement<WebhookEventResult>, { _type: 'offer' }>,
  logger: LambdaLogger,
) {
  const brand = record.brands?.find((brand) => brand?.code === process.env.OFFERS_BRAND);

  if (!brand) {
    logger.warn({
      message: `offer ${record._id} doesn't exist for brand ${process.env.OFFERS_BRAND}`,
    });
    return;
  }

  record._id = record.offerId ? record.offerId.toString() : record._id;

  await db.put({
    TableName: Table.cmsData.tableName,
    Item: record,
  });
}

export async function ingestCompany(
  record: Extract<ArrayElement<WebhookEventResult>, { _type: 'company' }>,
  logger: LambdaLogger,
) {
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
    TableName: Table.cmsData.tableName,
    Item: record,
  });
}

export async function ingestRawRecord(record: ArrayElement<WebhookEventResult>) {
  await db.put({
    TableName: Table.cmsRawData.tableName,
    Item: record,
  });
}

export function extractEvent(event: SanityChangeEvent) {
  return JSON.parse(event.body) as ArrayElement<WebhookEventResult>;
}
