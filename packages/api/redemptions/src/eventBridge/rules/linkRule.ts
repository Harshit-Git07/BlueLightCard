import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { LinkEvents } from '../events';

export function createLinkRule(stack: Stack): EventBusRuleProps {
  const queue = new Queue(stack, 'linkDeadLetterQueue');
  return {
    pattern: { source: [LinkEvents.LINK_CREATED, LinkEvents.LINK_UPDATED] },
    targets: {
      linkHandler: {
        function: {
          permissions: [],
          handler: 'packages/api/redemptions/src/eventBridge/handlers/link/linkHandler.handler',
          retryAttempts: 2,
          deadLetterQueueEnabled: true,
          deadLetterQueue: queue.cdk.queue,
        },
      },
    },
  };
}
