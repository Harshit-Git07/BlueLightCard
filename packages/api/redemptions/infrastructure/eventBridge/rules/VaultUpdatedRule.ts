import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsDatasyncEvents } from '../events/datasync';

export function createVaultUpdatedRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'vaultUpdatedDeadLetterQueue');
  const vaultUpdatedHandler = new SSTFunction(stack, 'vaultUpdatedHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/vault/vaultUpdatedHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [RedemptionsDatasyncEvents.VAULT_UPDATED] },
    targets: {
      vaultUpdatedHandler,
    },
  };
}
