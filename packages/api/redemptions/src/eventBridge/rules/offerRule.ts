import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { OfferEvents } from '../events';

export function createOfferRule(stack: Stack): EventBusRuleProps {
  const queue = new Queue(stack, 'offerDeadLetterQueue');
  return {
    pattern: { source: [OfferEvents.OFFER_CREATED, OfferEvents.OFFER_UPDATED] },
    targets: {
      offerHandler: {
        function: {
          permissions: [],
          handler: 'packages/api/redemptions/src/eventBridge/handlers/offers/offerHandler.handler',
          retryAttempts: 2,
          deadLetterQueueEnabled: true,
          deadLetterQueue: queue.cdk.queue,
        },
      },
    },
  };
}
