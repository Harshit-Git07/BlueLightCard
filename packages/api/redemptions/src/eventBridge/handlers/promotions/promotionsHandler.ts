import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

import { PromotionEvents } from '../../events/';
import { IEventBridge } from '../../types/event';

import { promotionUpdatedHandler } from './promotionEventHandlers';

const service: string = process.env.service as string;
const logger = new LambdaLogger({ serviceName: `${service}-promotions-event-handler` });

export const handler = async (event: IEventBridge): Promise<void> => {
  const { source } = event;

  switch (source) {
    case PromotionEvents.PROMOTION_UPDATED:
      promotionUpdatedHandler();
      break;
    default:
      logger.error({ message: `Invalid Event  ${source}` });
      throw new Error('Invalid event source');
  }
};
