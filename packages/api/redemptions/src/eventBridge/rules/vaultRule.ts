import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { IDatabase } from '../../database/adapter';
import { SSTFunction } from '../../helpers/SSTFunction';
import { VaultEvents } from '../events';

export function createVaultRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'vaultDeadLetterQueue');
  const vaultHandler = new SSTFunction(stack, 'vaultHandler', {
    database,
    handler: 'packages/api/redemptions/src/eventBridge/handlers/vault/vaultHandler.handler',
    permissions: [],
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [VaultEvents.VAULT_CREATED, VaultEvents.VAULT_UPDATED] },
    targets: {
      vaultHandler,
    },
  };
}
