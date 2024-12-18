import type { EventBridgeEvent } from 'aws-lambda/trigger/eventbridge';

import { LambdaLogger } from '@blc-mono/core/utils/logger';

import { publishToEventBus } from '../src/cms/emit';
import {
  extractRecord,
  ingestCompany,
  ingestCompanyLocation,
  ingestEvent,
  ingestOffer,
  ingestRawRecord,
  purgeCmsRecord,
  purgeOffer,
} from '../src/cms/ingest';
import { env } from '../src/lib/env';
import type { SanityChangeEvent } from '../src/lib/events';

const UNPUBLISHED_WARNING = 'Discovery event bus not set. Event not published.';

const logger = new LambdaLogger({ serviceName: 'offers-cms-consumer' });

export async function handler(event: EventBridgeEvent<'SanityChangeEvent', SanityChangeEvent>) {
  logger.info({ message: 'Received request:', body: event });
  const record = extractRecord(event.detail);

  await ingestRawRecord(record);

  if (record._type === 'event') {
    await ingestEvent(record);
  }

  if (record._type === 'offer') {
    if (event.detail.headers['sanity-operation'] === 'delete') {
      await purgeCmsRecord(record._id);
      await purgeOffer(record._id);
    } else {
      await ingestOffer(record, logger);
    }
  }

  if (record._type === 'company') {
    await ingestCompany(record, logger);
  }

  if (record._type === 'company.location.batch') {
    await ingestCompanyLocation(record, logger);
  }

  if (env.OFFERS_DISCOVERY_EVENT_BUS_NAME) {
    await publishToEventBus(record, env.OFFERS_DISCOVERY_EVENT_BUS_NAME, logger);
  } else {
    logger.warn({ message: UNPUBLISHED_WARNING });
  }
}
