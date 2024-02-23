import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { SSTFunction } from '../../constructs/SSTFunction';
import { RedemptionsDatasyncEvents } from '../events/datasync';

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
    pattern: { source: [RedemptionsDatasyncEvents.LINK_CREATED, RedemptionsDatasyncEvents.LINK_UPDATED] },
    targets: { linkHandler },
  };
}
