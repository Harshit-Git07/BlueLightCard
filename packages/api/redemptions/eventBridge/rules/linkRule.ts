import { Queue, Stack, Table } from 'sst/constructs';

import { EventBridgePermissions } from '../eventBridgePermissions';

import { FunctionProps, Rule } from './rule';

export const createLinkRule = ({
  ruleName,
  events,
  permissions,
  stack,
  table,
}: {
  ruleName: string;
  events: string[];
  permissions: EventBridgePermissions[];
  stack: Stack;
  table: Table;
}): Rule => {
  const queue = new Queue(stack, 'linkDeadLetterQueue');

  const functionProps: FunctionProps = {
    functionName: 'linkHandler',
    permissions,
    handler: 'packages/api/redemptions/eventBridge/handlers/link/linkHandler.handler',
    environment: {
      SERVICE: 'redemption',
      TABLE_NAME: table.tableName,
    },
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    retryAttempts: 2,
  };
  return new Rule(ruleName, events, functionProps);
};
