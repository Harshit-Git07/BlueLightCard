import { FunctionProps, Rule } from './rule';
import { Queue, Stack, Table } from 'sst/constructs';
import { EventBridgePermissions } from '../eventBridgePermissions';

export const createPromotionRule = ({
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
  const queue = new Queue(stack, 'promotionDeadLetterQueue');

  const functionProps: FunctionProps = {
    functionName: 'promotionHandler',
    permissions,
    handler: 'packages/api/redemptions/eventBridge/handlers/promotions/promotionsHandler.handler',
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
