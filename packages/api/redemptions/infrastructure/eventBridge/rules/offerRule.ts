import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsDatasyncEvents } from '../events/datasync';

export function createOfferRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'offerDeadLetterQueue');
  const offerHandler = new SSTFunction(stack, 'offerHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/offers/offerHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [RedemptionsDatasyncEvents.OFFER_CREATED, RedemptionsDatasyncEvents.OFFER_UPDATED] },
    targets: { offerHandler },
  };
}
