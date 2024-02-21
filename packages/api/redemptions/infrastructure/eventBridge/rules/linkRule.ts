import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { LinkEvents } from '@blc-mono/redemptions/application/handlers/eventBridge/events';

import { SSTFunction } from '../../constructs/SSTFunction';

export function createLinkRule(stack: Stack): EventBusRuleProps {
  const queue = new Queue(stack, 'linkDeadLetterQueue');
  const linkHandler = new SSTFunction(stack, 'linkHandler', {
    permissions: [],
    handler: 'packages/api/redemptions/application/handlers/eventBridge/link/linkHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [LinkEvents.LINK_CREATED, LinkEvents.LINK_UPDATED] },
    targets: { linkHandler },
  };
}
