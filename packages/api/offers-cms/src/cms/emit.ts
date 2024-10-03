import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { WebhookEventResult } from '@bluelightcard/sanity-types';

import { type LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

import { createEBClient } from '../lib/eventbridge';

const EB_DETAIL_TYPE = 'sanityEvent';

const eb = createEBClient();

type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

const generateSource = (record: ArrayElement<WebhookEventResult>): string => {
  return `${record._type}.${record.operation}d`;
};

export async function publishToEventBus(
  record: ArrayElement<WebhookEventResult>,
  busName: string,
  logger: LambdaLogger,
) {
  const source = generateSource(record);
  const putOutput = await eb.send(
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
