import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { VaultEvents } from '@blc-mono/redemptions/application/handlers/eventBridge/events';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';

export function createVaultRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'vaultDeadLetterQueue');
  const vaultHandler = new SSTFunction(stack, 'vaultHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/vault/vaultHandler.handler',
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
