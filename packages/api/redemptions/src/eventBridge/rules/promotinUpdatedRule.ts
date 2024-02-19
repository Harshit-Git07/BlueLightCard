import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';
import { Function } from 'sst/constructs';

import { IDatabase } from '../../database/adapter';
import { PromotionEvents } from '../events';

export function createPromotionUpdatedRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'promotionDeadLetterQueue');
  const promotionUpdatedHandler = new Function(
    stack,
    'PromotionUpdatedEventHandler',
    database.getFunctionProps({
      handler: 'packages/api/redemptions/src/eventBridge/handlers/promotions/promotionUpdatedHandler.handler',
      retryAttempts: 2,
      deadLetterQueueEnabled: true,
      deadLetterQueue: queue.cdk.queue,
    }),
  );
  return {
    pattern: { source: [PromotionEvents.PROMOTION_UPDATED] },
    targets: { promotionUpdatedHandler },
  };
}
