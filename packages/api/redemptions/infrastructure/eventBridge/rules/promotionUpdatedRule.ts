import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionsStackConfig } from '@blc-mono/redemptions/infrastructure/config/config';

import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
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
      // Lambda Script Integration
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_NAME]:
        config.redemptionsLambdaScriptsSecretName,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]:
        config.redemptionsLambdaScriptsEnvironment,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: config.redemptionsLambdaScriptsHost,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH]:
        config.redemptionsLambdaScriptsRetrieveAllVaultsPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH]:
        config.redemptionsLambdaScriptsCodeRedeemedPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]:
        config.redemptionsLambdaScriptsAssignUserCodesRedeemedPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH]:
        config.redemptionsLambdaScriptsCodeAmountIssuedPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH]:
        config.redemptionsLambdaScriptsViewVaultBatchesPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH]:
        config.redemptionsLambdaScriptsCheckVaultStockPath,
      // Datadog unified service tracking
      DD_SERVICE: 'redemptions',
    },
  });
  return {
    pattern: { source: [RedemptionsDatasyncEvents.PROMOTION_UPDATED] },
    targets: { promotionUpdatedHandler },
  };
}
