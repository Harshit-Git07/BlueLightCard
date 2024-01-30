import { Queue, Stack } from 'sst/constructs';

import { EventBridgePermissions } from '../eventBridgePermissions';

import { FunctionProps, Rule } from './rule';

export const createVaultRule = ({
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
  const queue = new Queue(stack, 'vaultDeadLetterQueue');

  const functionProps: FunctionProps = {
    functionName: 'vaultHandler',
    permissions,
    handler: 'packages/api/redemptions/src/eventBridge/handlers/vault/vaultHandler.handler',
    environment: {
      SERVICE: 'redemption',
    },
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    retryAttempts: 2,
  };
  return new Rule(ruleName, events, functionProps);
};
