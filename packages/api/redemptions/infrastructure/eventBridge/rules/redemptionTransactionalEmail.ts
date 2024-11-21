import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { EventBusRuleProps, Queue, Stack } from 'sst/constructs';

import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '@blc-mono/core/constants/redemptions';
import { RedemptionsStackConfig } from '@blc-mono/redemptions/infrastructure/config/config';

import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';

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
      [RedemptionsStackEnvironmentKeys.SECRETS_MANAGER_NAME]: config.secretsManagerConfig.secretsManagerName,
      [RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID]:
        config.brazeEmailCampaignsConfig.brazeVaultEmailCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_GENERIC_EMAIL_CAMPAIGN_ID]:
        config.brazeEmailCampaignsConfig.brazeGenericEmailCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID]:
        config.brazeEmailCampaignsConfig.brazePreAppliedEmailCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_API_URL]: config.brazeConfig.brazeApiUrl,
      [RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST]: config.networkConfig.redemptionsWebHost,
      [RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID]:
        config.brazeEmailCampaignsConfig.brazeVaultQrCodeEmailCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_GIFT_CARD_EMAIL_CAMPAIGN_ID]:
        config.brazeEmailCampaignsConfig.brazeGiftCardEmailCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID]:
        config.brazeEmailCampaignsConfig.brazeShowCardEmailCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_CREDIT_CARD_EMAIL_CAMPAIGN_ID]:
        config.brazeEmailCampaignsConfig.brazeCreditCardEmailCampaignId,
      [RedemptionsStackEnvironmentKeys.BRAZE_VERIFY_EMAIL_CAMPAIGN_ID]:
        config.brazeEmailCampaignsConfig.brazeVerifyEmailCampaignId,
      // Datadog unified service tracking
      DD_SERVICE: 'redemptions',
    },
    permissions: [getSecretValueSecretsManager],
  });
  return {
    pattern: {
      source: [REDEMPTIONS_EVENT_SOURCE],
      detailType: [RedemptionEventDetailType.MEMBER_REDEMPTION],
      detail: {
        redemptionDetails: {
          redemptionType: ['vault', 'generic', 'preApplied', 'vaultQR', 'showCard', 'giftCard', 'creditCard', 'verify'],
        },
      },
    },
    targets: { redeemedTransactionalEmailHandler: redemptionTransactionalEmailHandler },
  };
}
