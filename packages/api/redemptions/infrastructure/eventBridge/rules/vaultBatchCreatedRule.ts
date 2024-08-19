import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionsStackConfig } from '@blc-mono/redemptions/infrastructure/config/config';

import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsVaultBatchEvents } from '../events/vaultBatch';

const sendAdminEmailPolicyStatement = new PolicyStatement({
  actions: ['ses:SendEmail'],
  effect: Effect.ALLOW,
  resources: ['*'],
});

export function createVaultBatchCreatedRule(
  stack: Stack,
  config: RedemptionsStackConfig,
  database: IDatabase,
): EventBusRuleProps {
  const queue = new Queue(stack, 'vaultBatchCreatedDeadLetterQueue');
  const vaultBatchCreatedHandler = new SSTFunction(stack, 'vaultBatchCreatedHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/vaultBatch/vaultBatchCreatedHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    environment: {
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM]: config.redemptionsEmailFrom,
    },
    permissions: [sendAdminEmailPolicyStatement],
  });
  return {
    pattern: { source: [RedemptionsVaultBatchEvents.BATCH_CREATED] },
    targets: {
      vaultBatchCreatedHandler,
    },
  };
}
