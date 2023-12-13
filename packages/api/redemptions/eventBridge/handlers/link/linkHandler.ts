import { Logger } from '@blc-mono/core/src/utils/logger/logger';
import { IEventBridge } from '../../types/event';
import { LinkEvents } from '../../events/';

import { linkCreatedHandler, linkUpdatedHandler } from './linkEventHandlers';

const service: string = process.env.service as string;
const logger = new Logger();
logger.init({ serviceName: `${service}-link-event-handler` });

export const handler = async (event: IEventBridge): Promise<void> => {
  const { source } = event;
  switch (source) {
    case LinkEvents.LINK_CREATED:
      linkCreatedHandler();
      break;
    case LinkEvents.LINK_UPDATED:
      linkUpdatedHandler();
      break;
    default:
      logger.error({ message: `Invalid Event  ${source}` });
      throw new Error('Invalid event source');
  }
};
