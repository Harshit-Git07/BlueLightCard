import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { OfferEvents } from '@blc-mono/redemptions/application/handlers/eventBridge/events';

import { SSTFunction } from '../../constructs/SSTFunction';

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
    pattern: { source: [OfferEvents.OFFER_CREATED, OfferEvents.OFFER_UPDATED] },
    targets: { offerHandler },
  };
}
