import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionsStackConfig } from '@blc-mono/redemptions/infrastructure/config/config';

import { SSTFunction } from '../../constructs/SSTFunction';
import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '../events/redemptions';

/**
 * Creates a rule which is triggered when a redemption is successful and sends a transactional email
 */
export function createRedemptionTransactionalEmailRule(
  stack: Stack,
  config: RedemptionsStackConfig,
): EventBusRuleProps {
  const queue = new Queue(stack, 'DLQRedemptionTransactionalEmail');
  const getSecretValueSecretsManager = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const redemptionTransactionalEmailHandler = new SSTFunction(stack, 'redemptionTransactionalEmailHandler', {
    handler:
      'packages/api/redemptions/application/handlers/eventBridge/redemptionTransactionalEmail/rdmTransactionalEmailHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    environment: {
      BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID: config.brazeVaultRedemptionVaultCampaignId,
      BRAZE_API_URL: config.brazeApiUrl,
    },
    permissions: [getSecretValueSecretsManager],
  });
  return {
    pattern: {
      source: [REDEMPTIONS_EVENT_SOURCE],
      detailType: [
        RedemptionEventDetailType.REDEEMED_GENERIC,
        RedemptionEventDetailType.REDEEMED_PRE_APPLIED,
        RedemptionEventDetailType.REDEEMED_SHOW_CARD,
        RedemptionEventDetailType.REDEEMED_VAULT_QR,
        RedemptionEventDetailType.REDEEMED_VAULT,
      ],
    },
    targets: { redeemedTransactionalEmailHandler: redemptionTransactionalEmailHandler },
  };
}
