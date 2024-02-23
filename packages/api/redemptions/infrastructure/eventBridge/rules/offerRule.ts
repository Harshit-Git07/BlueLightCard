import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { SSTFunction } from '../../constructs/SSTFunction';
import { RedemptionsDatasyncEvents } from '../events/datasync';

export function createOfferRule(stack: Stack): EventBusRuleProps {
  const queue = new Queue(stack, 'offerDeadLetterQueue');
  const offerHandler = new SSTFunction(stack, 'offerHandler', {
    permissions: [],
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
