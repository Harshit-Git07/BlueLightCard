import { Queue, Stack } from 'sst/constructs';

import { EventBridgePermissions } from '../eventBridgePermissions';

import { FunctionProps, Rule } from './rule';

export const createOfferRule = ({
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
  const queue = new Queue(stack, 'offerDeadLetterQueue');

  const functionProps: FunctionProps = {
    functionName: 'offerHandler',
    permissions,
    handler: 'packages/api/redemptions/src/eventBridge/handlers/offers/offerHandler.handler',
    environment: {
      SERVICE: 'redemption',
    },
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    retryAttempts: 2,
  };
  return new Rule(ruleName, events, functionProps);
};
