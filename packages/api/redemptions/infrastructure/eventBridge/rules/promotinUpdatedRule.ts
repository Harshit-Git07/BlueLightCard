import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionsStackConfig } from '@blc-mono/redemptions/infrastructure/config/config';

import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';
import { RedemptionsDatasyncEvents } from '../events/datasync';

export function createPromotionUpdatedRule(
  stack: Stack,
  database: IDatabase,
  config: RedemptionsStackConfig,
): EventBusRuleProps {
  const queue = new Queue(stack, 'promotionDeadLetterQueue');
  const promotionUpdatedHandler = new SSTFunction(stack, 'PromotionUpdatedEventHandler', {
    database,
    handler: 'packages/api/redemptions/application/handlers/eventBridge/promotions/PromotionUpdatedHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    permissions: [
      new PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        effect: Effect.ALLOW,
        resources: ['*'],
      }),
    ],
    environment: {
      REDEMPTIONS_RETRIEVE_ALL_VAULTS_HOST: config.vaultRedeemHost,
      REDEMPTIONS_RETRIEVE_ALL_VAULTS_PATH: config.vaultRedeemPath,
      REDEMPTIONS_RETRIEVE_ALL_ENVIRONMENT: config.vaultRedeemEnvironment,
    },
  });
  return {
    pattern: { source: [RedemptionsDatasyncEvents.PROMOTION_UPDATED] },
    targets: { promotionUpdatedHandler },
  };
}
