import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { eventBusMiddleware, logger } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export const unwrappedHandler = async (
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_SYSTEM) !== 'true') {
    logger.info({ message: 'System events disabled, skipping...' });
    return;
  }

  switch (event['detail-type']) {
    case MemberEvent.SYSTEM_APPLICATION_APPROVED:
      // TODO - create the card!  finalise card# generation format for diff brands?
      // approved application - create a card item in member profiles
      break;
    case MemberEvent.SYSTEM_APPLICATION_PAYMENT:
      // TODO - pending payments team to finalise stripe callback method for payment updates
      // system triggered payment notification (from payment subsystem? tbc)
      break;
  }
};

export const handler = eventBusMiddleware(unwrappedHandler);
