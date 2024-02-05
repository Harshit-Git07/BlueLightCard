import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { PromotionEvents } from '../events';

export function createPromotionRule(stack: Stack): EventBusRuleProps {
  const queue = new Queue(stack, 'promotionDeadLetterQueue');
  return {
    pattern: { source: [PromotionEvents.PROMOTION_UPDATED] },
    targets: {
      promotionHandler: {
        function: {
          permissions: [],
          handler: 'packages/api/redemptions/src/eventBridge/handlers/promotions/promotionsHandler.handler',
          retryAttempts: 2,
          deadLetterQueueEnabled: true,
          deadLetterQueue: queue.cdk.queue,
        },
      },
    },
  };
}
