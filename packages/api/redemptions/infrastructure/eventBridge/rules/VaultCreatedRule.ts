import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsDatasyncEvents } from '../events/datasync';

export function createVaultCreatedRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'vaultCreatedDeadLetterQueue');
  const vaultCreatedHandler = new SSTFunction(stack, 'vaultCreatedHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/vault/vaultCreatedHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [RedemptionsDatasyncEvents.VAULT_CREATED] },
    targets: {
      vaultCreatedHandler,
    },
  };
}
