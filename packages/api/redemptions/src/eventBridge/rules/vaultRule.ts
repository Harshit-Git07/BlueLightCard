import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';
import { Function } from 'sst/constructs';

import { IDatabase } from '../../database/adapter';
import { VaultEvents } from '../events';

export function createVaultRule(stack: Stack, database: IDatabase): EventBusRuleProps {
  const queue = new Queue(stack, 'vaultDeadLetterQueue');
  const vaultHandler = new Function(
    stack,
    'RedemptionsVaultEventHandler',
    database.getFunctionProps({
      handler: 'packages/api/redemptions/src/eventBridge/handlers/vault/vaultHandler.handler',
      permissions: [],
      retryAttempts: 2,
      deadLetterQueueEnabled: true,
      deadLetterQueue: queue.cdk.queue,
    }),
  );
  database.grantConnect(vaultHandler);
  return {
    pattern: { source: [VaultEvents.VAULT_CREATED, VaultEvents.VAULT_UPDATED] },
    targets: { vaultHandler },
  };
}
