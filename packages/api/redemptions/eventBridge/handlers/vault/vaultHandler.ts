import { Logger } from '@blc-mono/core/src/utils/logger/logger';
import { IEventBridge } from '../../types/event';
import { OfferEvents } from '../../events/';

import { vaultUpdatedHandler, vaultCreatedHandler } from './vualtEventHandlers';

const service: string = process.env.service as string;
const logger = new Logger();
logger.init({ serviceName: `${service}-offer-event-handler` });

export const handler = async (event: IEventBridge): Promise<void> => {
  const { source } = event;

  switch (source) {
    case OfferEvents.OFFER_CREATED:
      vaultCreatedHandler();
      break;
    case OfferEvents.OFFER_UPDATED:
      vaultUpdatedHandler();
      break;
    default:
      logger.error({ message: `Invalid Event  ${source}` });
      throw new Error('Invalid event source');
  }
};
