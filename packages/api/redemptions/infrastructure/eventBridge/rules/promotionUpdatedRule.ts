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
      REDEMPTIONS_LAMBDA_SCRIPTS_HOST: config.redemptionsLambdaScriptsHost,
      REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH: config.redemptionsLambdaScriptsRetrieveAllVaultsPath,
      REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT: config.redemptionsLambdaScriptsEnvironment,
      REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH: config.redemptionsLambdaScriptsCodeAmountIssuedPath,
      REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH: config.redemptionsLambdaScriptsAssignUserCodesRedeemedPath,
      REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH: config.redemptionsLambdaScriptsCodeRedeemedPath,
    },
  });
  return {
    pattern: { source: [RedemptionsDatasyncEvents.PROMOTION_UPDATED] },
    targets: { promotionUpdatedHandler },
  };
}
