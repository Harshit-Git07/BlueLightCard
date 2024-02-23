import { EventBridgeEvent } from 'aws-lambda';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { linkCreatedHandler, linkUpdatedHandler } from './linkEventHandlers';

const logger = new LambdaLogger({ serviceName: 'redemption-link-event-handler' });

export const handler = async (event: EventBridgeEvent<string, unknown>): Promise<void> => {
  const { source } = event;
  switch (source) {
    case RedemptionsDatasyncEvents.LINK_CREATED:
      linkCreatedHandler();
      break;
    case RedemptionsDatasyncEvents.LINK_UPDATED:
      linkUpdatedHandler();
      break;
    default:
      logger.error({ message: `Invalid Event  ${source}` });
      throw new Error('Invalid event source');
  }
};
