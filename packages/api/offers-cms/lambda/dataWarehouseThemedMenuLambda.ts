import { FirehoseClient, PutRecordBatchCommand } from '@aws-sdk/client-firehose';
import type { EventBridgeEvent } from 'aws-lambda/trigger/eventbridge';
import { extractRecord } from 'src/cms/ingest';

import { env } from '../src/lib/env';
import type { SanityChangeEvent } from '../src/lib/events';

const client = new FirehoseClient();

export async function handler(event: EventBridgeEvent<'SanityChangeEvent', SanityChangeEvent>) {
  const record = extractRecord(event.detail);

  if (record._type === 'menu.themed.offer') {
    const baseFields = {
      menu_id: record._id,
      menu_name: record.title,
      brand: env.BRAND,
      create_time: record._createdAt,
      update_time: record._updatedAt,
    };

    const records = record.inclusions?.flatMap((item) => {
      const baseRecord = {
        ...baseFields,
        collection_name: item.collectionName,
        collection_description: item.collectionDescription,
      };

      return (
        item.contents?.map((content) => ({
          ...baseRecord,
          offer_id:
            content._type === 'offerReference'
              ? {
                  old_offer_id: null,
                  new_offer_id: content.reference?._id,
                }
              : null,
          company_id:
            content._type === 'companyOfferReference'
              ? {
                  old_company_id: null,
                  new_company_id: content.reference?._id,
                }
              : null,
        })) ?? [baseRecord]
      );
    }) ?? [baseFields];

    const command = new PutRecordBatchCommand({
      DeliveryStreamName: env.DWH_FIREHOSE_THEMED_MENU_STREAM_NAME,
      Records: records?.map((record) => {
        return {
          Data: Buffer.from(JSON.stringify(record)),
        };
      }),
    });

    await client.send(command);
  }
}
