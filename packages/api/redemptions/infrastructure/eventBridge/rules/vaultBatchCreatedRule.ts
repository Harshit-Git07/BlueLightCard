import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { SSTFunction } from '../../constructs/SSTFunction';
import { RedemptionsVaultBatchEvents } from '../events/vaultBatch';

export function createVaultBatchCreatedRule(stack: Stack): EventBusRuleProps {
  /*
   * data will be pushed to event bus for this rule when a batch of codes has been inserted to
   * redemptions DB (services/vault/VaultCodesUploadService)
   *
   * todo: this a stub and will require further dev: https://bluelightcard.atlassian.net/browse/TR-630
   * may require:
   * secret values and policy statement for sending emails
   * environment and permission values for const vaultBatchCreatedHandler
   * further pattern values
   * requirements will be established by dev and test above ticket
   */

  const queue = new Queue(stack, 'vaultBatchCreatedDeadLetterQueue');
  const vaultBatchCreatedHandler = new SSTFunction(stack, 'vaultBatchCreatedHandler', {
    handler: 'packages/api/redemptions/application/handlers/eventBridge/vaultBatch/vaultBatchCreatedHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
  });
  return {
    pattern: { source: [RedemptionsVaultBatchEvents.BATCH_CREATED] },
    targets: {
      vaultBatchCreatedHandler,
    },
  };
}
