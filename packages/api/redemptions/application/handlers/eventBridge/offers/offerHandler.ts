import { EventBridgeEvent } from 'aws-lambda';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { withConnection } from '@blc-mono/redemptions/libs/database/connectionHelpers';

import { offerCreatedHandler } from './offerCreatedHandler';
import { offerUpdatedHandler } from './offerUpdatedHandler';

type OfferCreatedHandler = typeof offerCreatedHandler;
type OfferUpdatedHandler = typeof offerUpdatedHandler;

export function createHandler(
  logger: ILogger,
  offerCreatedHandler: OfferCreatedHandler,
  offerUpdatedHandler: OfferUpdatedHandler,
) {
  return async function offerHandler(
    connection: DatabaseConnection,
    event: EventBridgeEvent<string, unknown>,
  ): Promise<void> {
    const { source } = event;

    switch (source) {
      case RedemptionsDatasyncEvents.OFFER_CREATED:
        await offerCreatedHandler(connection, logger, event);
        break;
      case RedemptionsDatasyncEvents.OFFER_UPDATED:
        offerUpdatedHandler();
        break;
      default:
        logger.error({ message: `Invalid Event  ${source}` });
        throw new Error('Invalid event source');
    }
  };
}

const logger = new LambdaLogger({ serviceName: 'redemption-offer-event-handler' });

export const handler = withConnection(
  DatabaseConnectionType.READ_WRITE,
  createHandler(logger, offerCreatedHandler, offerUpdatedHandler),
);
