import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { Events } from './events';

export function eventRule(stack: Stack, queue: Queue): EventBusRuleProps {
  const eventRuleDeadLetterQueue = new Queue(stack, 'discoveryEventRule-deadLetterQueue');

  return {
    pattern: {
      source: [
        Events.OFFER_CREATED,
        Events.OFFER_UPDATED,
        Events.EVENT_CREATED,
        Events.EVENT_UPDATED,
        Events.OFFER_DELETED,
        Events.EVENT_DELETED,
        Events.COMPANY_CREATED,
        Events.COMPANY_UPDATED,
        Events.COMPANY_LOCATION_BATCH_CREATED,
        Events.COMPANY_LOCATION_BATCH_UPDATED,
        Events.MARKETPLACE_MENUS_CREATED,
        Events.MARKETPLACE_MENUS_UPDATED,
        Events.MARKETPLACE_MENUS_DELETED,
        Events.DEALS_OF_THE_WEEK_CREATED,
        Events.DEALS_OF_THE_WEEK_UPDATED,
        Events.DEALS_OF_THE_WEEK_DELETED,
        Events.FEATURED_CREATED,
        Events.FEATURED_UPDATED,
        Events.FEATURED_DELETED,
        Events.WAYS_TO_SAVE_CREATED,
        Events.WAYS_TO_SAVE_UPDATED,
        Events.WAYS_TO_SAVE_DELETED,
        Events.MENU_THEMED_OFFER_CREATED,
        Events.MENU_THEMED_OFFER_UPDATED,
        Events.MENU_THEMED_OFFER_DELETED,
        Events.MENU_THEMED_EVENT_CREATED,
        Events.MENU_THEMED_EVENT_UPDATED,
        Events.MENU_THEMED_EVENT_DELETED,
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
