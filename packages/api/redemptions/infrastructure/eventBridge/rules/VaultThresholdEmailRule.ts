import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '@blc-mono/core/constants/redemptions';
import { RedemptionsStackConfig } from '@blc-mono/redemptions/infrastructure/config/config';

import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../../database/adapter';

/**
 * Creates a rule which is triggered when a vault or vaultQR redeemded event is emitted.
 * Once the event is emitted, the rule will trigger and send an email to the admin if the vault threshold is reached.
 */
export function createVaultThresholdEmailRule(
  stack: Stack,
  config: RedemptionsStackConfig,
  database: IDatabase,
): EventBusRuleProps {
  const queue = new Queue(stack, 'VaultThresholdEmail');
  const getSecretValueSecretsManagerPolicy = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const sendEmailAmazonSESPolicy = new PolicyStatement({
    actions: ['ses:SendEmail'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });

  const vaultThresholdEmailHandler = new SSTFunction(stack, 'vaultThresholdEmailHandler', {
    handler: 'packages/api/redemptions/application/handlers/eventBridge/email/VaultThresholdEmailHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    database,
    environment: {
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM]: config.sesConfig.redemptionsEmailFrom,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]:
        config.lambdaScriptsConfig.redemptionsLambdaScriptsHost,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]:
        config.lambdaScriptsConfig.redemptionsLambdaScriptsEnvironment,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH]:
        config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsRetrieveAllVaultsPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH]:
        config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsCodeAmountIssuedPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]:
        config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsAssignUserCodesRedeemedPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH]:
        config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsCodeRedeemedPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH]:
        config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsViewVaultBatchesPath,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH]:
        config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsCheckVaultStockPath,
    },
    permissions: [sendEmailAmazonSESPolicy, getSecretValueSecretsManagerPolicy],
  });

  return {
    pattern: {
      source: [REDEMPTIONS_EVENT_SOURCE],
      detailType: [RedemptionEventDetailType.MEMBER_REDEMPTION],
      detail: {
        redemptionDetails: {
          redemptionType: ['vault', 'vaultQR'],
        },
      },
    },
    targets: { vaultThresholdEmailHandler },
  };
}
