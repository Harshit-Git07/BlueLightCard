import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import type { EventBridgeEvent } from 'aws-lambda/trigger/eventbridge';
import { extractRecord } from 'src/cms/ingest';

import { env } from '../src/lib/env';
import type { SanityChangeEvent } from '../src/lib/events';

const client = new FirehoseClient();

export async function handler(event: EventBridgeEvent<'SanityChangeEvent', SanityChangeEvent>) {
  const record = extractRecord(event.detail);

  if (
    record._type === 'menu.offer' ||
    record._type === 'menu.campaign' ||
    record._type === 'menu.company'
  ) {
    const offerId =
      record.inclusions?.map((inclusion) => {
        return inclusion._id;
      }) ?? [];

    const messageBody = {
      menu_id: record._id,
      menu_name: record.title,
      brand: env.BRAND,
      menu_order: '',
      menu_type: record._type.replace('menu.', ''),
      offer_id: offerId,
      offer_name: record.title,
      start_date: record.start,
      end_date: record.end,
      menu_extras: {},
      update_time: record._updatedAt,
    };

    const command = new PutRecordCommand({
      DeliveryStreamName: env.DWH_FIREHOSE_MENU_STREAM_NAME,
      Record: {
        Data: Buffer.from(JSON.stringify(messageBody)),
      },
    });

    await client.send(command);
  }
}
