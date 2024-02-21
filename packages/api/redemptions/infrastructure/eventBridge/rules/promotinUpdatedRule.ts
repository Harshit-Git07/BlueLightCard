import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { PromotionEvents } from '@blc-mono/redemptions/application/handlers/eventBridge/events';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';

export function createPromotionUpdatedRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'promotionDeadLetterQueue');
  const promotionUpdatedHandler = new SSTFunction(stack, 'PromotionUpdatedEventHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/promotions/promotionUpdatedHandler.ts',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [PromotionEvents.PROMOTION_UPDATED] },
    targets: { promotionUpdatedHandler },
  };
}
