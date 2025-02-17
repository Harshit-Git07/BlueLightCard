import { EventBridgeEvent } from 'aws-lambda';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';
import { eventBusMiddleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export const unwrappedHandler = async (event: EventBridgeEvent<string, unknown>): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_PAYMENT) !== 'true') {
    logger.info({ message: 'Payment events disabled, skipping...' });
    return;
  }

  logger.info({ message: 'Got event', event });
};

export const handler = eventBusMiddleware(unwrappedHandler);
