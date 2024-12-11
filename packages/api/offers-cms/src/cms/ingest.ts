import { PutRecordBatchCommand } from '@aws-sdk/client-firehose';
import { type CompanyLocation } from '@bluelightcard/sanity-types';
import { Table } from 'sst/node/table';

import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { type ILogger } from '@blc-mono/core/utils/logger';

import { dynamo } from '../lib/dynamo';
import { env } from '../lib/env';
import { type Record, type SanityChangeEvent, type WebhookResultRecord } from '../lib/events';
import { firehose } from '../lib/firehose';

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

export async function ingestCompanyLocation(
  record: Record<'company.location.batch'>,
  logger: ILogger,
) {
  const records = record.locations?.map((location: CompanyLocation) => {
    return Buffer.from(
      JSON.stringify({
        company_id: record._id.toString(),
        updated_at: record._updatedAt.toString(),
        company_location: [
          location.location?.lat?.toString() + ',' + location.location?.lng?.toString(),
        ],
        brand: getBrandFromEnv(),
      }),
    );
  });

  const command = new PutRecordBatchCommand({
    DeliveryStreamName: env.DWH_FIREHOSE_COMPANY_LOCATION_STREAM_NAME,
    Records: records.map((record: Buffer) => {
      return {
        Data: record,
      };
    }),
  });
  logger.info({
    message: `company.location.batch ${record._id} ingested`,
  });
  await firehose.send(command);
}
