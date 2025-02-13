import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import type { EventBridgeEvent } from 'aws-lambda/trigger/eventbridge';
import { extractRecord } from 'src/cms/ingest';

import { env } from '../src/lib/env';
import type { SanityChangeEvent, WebhookResultRecord } from '../src/lib/events';

type ReceivedEvent = EventBridgeEvent<'SanityChangeEvent', SanityChangeEvent>;

const client = new FirehoseClient();

const extractIds = (record: WebhookResultRecord) => {
  if (record._type === 'menu.campaign') {
    return record.inclusions?.map((inclusion) => inclusion.campaign?._id) ?? [];
  }

  if (record._type === 'menu.company') {
    return record.inclusions?.map((inclusion) => ({
      old_company_id: null,
      new_company_id: inclusion.reference?._id,
    }));
  }

  if (record._type === 'menu.offer') {
    return record.inclusions?.map((inclusion) => ({
      new_offer_id: inclusion.offer?._id,
      old_offer_id: inclusion.offer?.offerId,
    }));
  }

  throw new Error(`Unrecognised menu type: ${record._type}`);
};

export async function handler(event: ReceivedEvent) {
  const record = extractRecord(event.detail);

  if (
    record._type === 'menu.offer' ||
    record._type === 'menu.campaign' ||
    record._type === 'menu.company'
  ) {
    const offerId = extractIds(record);

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

  throw new Error(`Unrecognised menu type: ${record._type}`);
}
