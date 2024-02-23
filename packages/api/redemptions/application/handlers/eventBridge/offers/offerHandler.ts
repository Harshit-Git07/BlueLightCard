import { EventBridgeEvent } from 'aws-lambda';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { offerCreatedHandler, offerUpdatedHandler } from './offerEventHandlers';

const logger = new LambdaLogger({ serviceName: 'redemption-offer-event-handler' });

export const handler = async (event: EventBridgeEvent<string, unknown>): Promise<void> => {
  const { source } = event;

  switch (source) {
    case RedemptionsDatasyncEvents.OFFER_CREATED:
      offerCreatedHandler();
      break;
    case RedemptionsDatasyncEvents.OFFER_UPDATED:
      offerUpdatedHandler();
      break;
    default:
      logger.error({ message: `Invalid Event  ${source}` });
      throw new Error('Invalid event source');
  }
};
