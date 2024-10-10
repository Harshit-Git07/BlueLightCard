import type { EventBridgeEvent } from 'aws-lambda/trigger/eventbridge';

import { LambdaLogger } from '@blc-mono/core/utils/logger';

import { publishToEventBus } from '../src/cms/emit';
import {
  extractEvent,
  ingestCompany,
  ingestOffer,
  ingestRawCompany,
  ingestRawOffer,
} from '../src/cms/ingest';
import type { SanityChangeEvent } from '../src/lib/events';

const UNPUBLISHED_WARNING = 'Discovery event bus not set. Event not published.';

const logger = new LambdaLogger({ serviceName: 'offers-cms-consumer' });

export async function handler(event: EventBridgeEvent<'SanityChangeEvent', SanityChangeEvent>) {
  logger.info({ message: 'Received request:', body: event });
  const record = extractEvent(event.detail);

  if (record._type === 'offer') {
    await Promise.all([ingestRawOffer(record), ingestOffer(record, logger)]);
  }

  if (record._type === 'company') {
    await Promise.all([ingestRawCompany(record), ingestCompany(record, logger)]);
  }

  if (process.env.DISCOVERY_EVENT_BUS_NAME) {
    await publishToEventBus(record, process.env.DISCOVERY_EVENT_BUS_NAME, logger);
  } else {
    logger.warn({ message: UNPUBLISHED_WARNING });
  }
}
