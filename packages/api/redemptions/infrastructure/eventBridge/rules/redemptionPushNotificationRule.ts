import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '@blc-mono/core/constants/redemptions';
import { RedemptionsStackConfig } from '@blc-mono/redemptions/infrastructure/config/config';

import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';

/**
 * Creates a rule which is triggered when a redemption is successful and sends a push notification to the user
 */
export function createRedemptionPushNotificationRule(stack: Stack, config: RedemptionsStackConfig): EventBusRuleProps {
  const queue = new Queue(stack, 'DLQRedemptionPushNotification');
  const getSecretValueSecretsManager = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const redemptionPushNotificationHandler = new SSTFunction(stack, 'redemptionPushNotificationHandler', {
    handler:
      'packages/api/redemptions/application/handlers/eventBridge/redemptionPushNotification/redemptionPushNotificationHandler.handler',
    retryAttempts: 2,
    deadLetterQueueEnabled: true,
    deadLetterQueue: queue.cdk.queue,
    environment: {
      [RedemptionsStackEnvironmentKeys.BRAZE_API_URL]: config.brazeApiUrl,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST]: config.redemptionsWebHost,
      [RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_PUSH_NOTIFICATION_CAMPAIGN_ID]:
        config.brazeRedemptionVaultPushNotificationCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_QR_PUSH_NOTIFICATION_CAMPAIGN_ID]:
        config.brazeRedemptionVaultQRPushNotificationCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_PRE_APPLIED_PUSH_NOTIFICATION_CAMPAIGN_ID]:
        config.brazeRedemptionPreAppliedPushNotificationCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GENERIC_PUSH_NOTIFICATION_CAMPAIGN_ID]:
        config.brazeRedemptionGenericPushNotificationCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_SHOW_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID]:
        config.brazeRedemptionShowCardPushNotificationCampaignId,
    },
    permissions: [getSecretValueSecretsManager],
  });
  return {
    pattern: {
      source: [REDEMPTIONS_EVENT_SOURCE],
      detailType: [RedemptionEventDetailType.MEMBER_REDEMPTION],
      detail: {
        redemptionDetails: {
          redemptionType: ['vault', 'vaultQR', 'generic', 'preApplied', 'showCard'],
        },
      },
    },
    targets: { redemptionPushNotificationHandler },
  };
}
