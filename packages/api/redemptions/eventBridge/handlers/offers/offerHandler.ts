import { Logger } from '@blc-mono/core/src/utils/logger/logger';
import { IEventBridge } from '../../types/event';
import { OfferEvents } from '../../events/';

import { offerCreatedHandler, offerUpdatedHandler } from './offerEventHandlers';

const service: string = process.env.service as string;
const logger = new Logger();
logger.init({ serviceName: `${service}-offer-event-handler` });

export const handler = async (event: IEventBridge): Promise<void> => {
  const { source } = event;


  switch (source) {
    case OfferEvents.OFFER_CREATED:
      offerCreatedHandler();
      break;
    case OfferEvents.OFFER_UPDATED:
      offerUpdatedHandler();
      break;
    default:
      logger.error({ message: `Invalid Event  ${source}` });
      throw new Error('Invalid event source');
  }
};
