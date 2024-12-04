import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { Events } from './events';

export function eventRule(stack: Stack, queue: Queue): EventBusRuleProps {
  const eventRuleDeadLetterQueue = new Queue(stack, 'discoveryEventRule-deadLetterQueue');

  return {
    pattern: {
      source: [
        Events.OFFER_CREATED,
        Events.OFFER_UPDATED,
        Events.OFFER_DELETED,
        Events.COMPANY_CREATED,
        Events.COMPANY_UPDATED,
        Events.COMPANY_LOCATION_BATCH_CREATED,
        Events.COMPANY_LOCATION_BATCH_UPDATED,
        Events.MENU_OFFER_CREATED,
        Events.MENU_OFFER_UPDATED,
        Events.MENU_OFFER_DELETED,
        Events.MENU_THEMED_OFFER_CREATED,
        Events.MENU_THEMED_OFFER_UPDATED,
        Events.MENU_THEMED_OFFER_DELETED,
        Events.SITE_CREATED,
        Events.SITE_UPDATED,
        Events.SITE_DELETED,
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
