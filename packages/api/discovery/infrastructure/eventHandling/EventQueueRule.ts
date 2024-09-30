import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { Events } from './Events';

export function EventRule(stack: Stack, queue: Queue): EventBusRuleProps {
  const eventRuleDeadLetterQueue = new Queue(stack, 'discoveryEventRule-deadLetterQueue');

  return {
    pattern: {
      source: [
        Events.OFFER_CREATED,
        Events.OFFER_UPDATED,
        Events.OFFER_DELETED,
        Events.COMPANY_CREATED,
        Events.COMPANY_UPDATED,
      ],
    },
    targets: {
      eventQueue: {
        type: 'queue',
        queue,
        cdk: {
          target: {
            deadLetterQueue: eventRuleDeadLetterQueue.cdk.queue,
            retryAttempts: 5,
          },
        },
      },
    },
  };
}
