import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { type CompanyLocationBatch, type WebhookResultRecord } from 'src/lib/events';
import invariant from 'tiny-invariant';

import { type ILogger } from '@blc-mono/core/utils/logger';

import { eventBridge } from '../lib/eventbridge';

const EB_DETAIL_TYPE = 'sanityEvent';

export async function publishToEventBus(
  record: WebhookResultRecord | CompanyLocationBatch,
  busName: string,
  logger: ILogger,
) {
  invariant('operation' in record, 'Published record requires operation');

  const source = `${record._type}.${record.operation}d`;
  const putOutput = await eventBridge.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: busName,
          Source: source,
          Detail: JSON.stringify(record),
          DetailType: EB_DETAIL_TYPE,
        },
      ],
    }),
  );

  const entries = putOutput.Entries || [];
  for (const entry of entries) {
    if (entry.ErrorCode) {
      logger.error({ message: `Error ${entry.ErrorCode}: ${entry.ErrorMessage}` });
    }
    logger.info({ message: `Published "${source}" event with ID: ${entry.EventId}` });
  }
}
