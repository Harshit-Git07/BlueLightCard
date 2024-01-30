import { Queue, Stack } from 'sst/constructs';

import { EventBridgePermissions } from '../eventBridgePermissions';

import { FunctionProps, Rule } from './rule';

export const createPromotionRule = ({
  ruleName,
  events,
  permissions,
  stack,
}: {
  ruleName: string;
  events: string[];
  permissions: EventBridgePermissions[];
  stack: Stack;
}): Rule => {
  const queue = new Queue(stack, 'promotionDeadLetterQueue');

  const functionProps: FunctionProps = {
    functionName: 'promotionHandler',
    permissions,
    handler: 'packages/api/redemptions/src/eventBridge/handlers/promotions/promotionsHandler.handler',
    environment: {
      SERVICE: 'redemption',
    },
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    retryAttempts: 2,
  };
  return new Rule(ruleName, events, functionProps);
};
