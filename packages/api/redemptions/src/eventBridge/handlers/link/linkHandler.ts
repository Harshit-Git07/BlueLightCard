import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

import { LinkEvents } from '../../events/';
import { IEventBridge } from '../../types/event';

import { linkCreatedHandler, linkUpdatedHandler } from './linkEventHandlers';

const service: string = process.env.service as string;
const logger = new LambdaLogger({ serviceName: `${service}-link-event-handler` });

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
