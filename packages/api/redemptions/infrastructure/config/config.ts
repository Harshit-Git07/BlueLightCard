import { Stack } from 'sst/constructs';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';

export type RedemptionsStackConfig = {
  redemptionsLambdaScriptsSecretName: string;
  redemptionsLambdaScriptsEnvironment: string;
  redemptionsLambdaScriptsHost: string;
  redemptionsLambdaScriptsRetrieveAllVaultsPath: string;
  redemptionsLambdaScriptsCodeRedeemedPath: string;
  redemptionsLambdaScriptsAssignUserCodesRedeemedPath: string;
  redemptionsLambdaScriptsCodeAmountIssuedPath: string;
  redemptionsLambdaScriptsViewVaultBatchesPath: string;
  redemptionsLambdaScriptsCheckVaultStockPath: string;
  apiDefaultAllowedOrigins: string[];
  brazeVaultEmailCampaignId: string;
  brazeGenericEmailCampaignId: string;
  brazePreAppliedEmailCampaignId: string;
  brazeVaultQrCodeEmailCampaignId: string;
  brazeShowCardEmailCampaignId: string;
  brazeApiUrl: string;
  redemptionsWebHost: string;
  redemptionsEmailFrom: string;
  redemptionsEmailDomain: string;
  brazeRedemptionVaultPushNotificationCampaignId: string;
  brazeRedemptionVaultQRPushNotificationCampaignId: string;
  brazeRedemptionPreAppliedPushNotificationCampaignId: string;
  brazeRedemptionGenericPushNotificationCampaignId: string;
  brazeRedemptionShowCardPushNotificationCampaignId: string;
};

export class RedemptionsStackConfigResolver {
  public static for(stack: Stack): RedemptionsStackConfig {
    switch (true) {
      case PRODUCTION_STAGE === stack.stage:
        return this.forProductionStage();
      case STAGING_STAGE === stack.stage:
        return this.forStagingStage();
      case PR_STAGE_REGEX.test(stack.stage):
        return this.forStagingStage();
      default:
        return this.fromEnvironmentVariables();
    }
  }

  public static forProductionStage(): RedemptionsStackConfig {
    return {
      redemptionsLambdaScriptsSecretName: 'blc-mono-redemptions/NewVaultSecrets',
      redemptionsLambdaScriptsEnvironment: 'production',
      redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
      redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
      redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
      redemptionsLambdaScriptsViewVaultBatchesPath: 'NewVault/viewBatches',
      redemptionsLambdaScriptsCheckVaultStockPath: 'NewVault/checkVaultStock',
      apiDefaultAllowedOrigins: [
        'https://www.bluelightcard.co.uk',
        'https://www.bluelightcard.com.au',
        'https://www.defencediscountservice.co.uk',
      ],
      brazeVaultEmailCampaignId: '23555377-445a-838a-74a0-0c274c8ae2f8',
      brazeGenericEmailCampaignId: '091d0923-b2a8-4884-9955-df72b8993e64',
      brazePreAppliedEmailCampaignId: 'ab5691a2-0504-4099-88ef-56ac7ef5f03c',
      brazeVaultQrCodeEmailCampaignId: '31172aa1-2e31-4a77-b9ac-43896f511beb',
      brazeShowCardEmailCampaignId: 'bf54574e-f31e-418b-bd10-649762b74e6a',
      brazeApiUrl: 'https://rest.fra-02.braze.eu',
      redemptionsWebHost: 'https://www.bluelightcard.co.uk',
      redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
      redemptionsEmailDomain: 'bluelightcard.co.uk',
      brazeRedemptionVaultPushNotificationCampaignId: '96d2da22-654d-418d-9184-28d6d01a08c2',
      brazeRedemptionVaultQRPushNotificationCampaignId: '4805f70d-cdab-4eee-9d47-107b3bda0f61',
      brazeRedemptionPreAppliedPushNotificationCampaignId: 'a76d8340-15b0-4460-adfe-941edd261149',
      brazeRedemptionGenericPushNotificationCampaignId: '1b0b84ce-4595-411c-adc1-e8aa6c225cac',
      brazeRedemptionShowCardPushNotificationCampaignId: '2ca64df5-3768-40bc-8ad6-2735b9e3de45',
    };
  }

  public static forStagingStage(): RedemptionsStackConfig {
    return {
      redemptionsLambdaScriptsSecretName: 'blc-mono-redemptions/NewVaultSecrets',
      // TODO: Temporary until we have vaults for staging
      redemptionsLambdaScriptsEnvironment: 'develop',
      redemptionsLambdaScriptsHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
      redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
      redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
      redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
      redemptionsLambdaScriptsViewVaultBatchesPath: 'NewVault/viewBatches',
      redemptionsLambdaScriptsCheckVaultStockPath: 'NewVault/checkVaultStock',
      apiDefaultAllowedOrigins: [
        // TODO: Configure origins for DDS and BLC AU
        'https://www.staging.bluelightcard.co.uk',
        'http://localhost:3000',
      ],
      brazeVaultEmailCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
      brazeGenericEmailCampaignId: '6b91bac5-0c3a-4508-8978-8814d573b845',
      brazePreAppliedEmailCampaignId: '00816603-1b52-42b3-9816-903508163c7e',
      brazeVaultQrCodeEmailCampaignId: 'eb6dac40-f99b-4634-889b-2f6451beaa82',
      brazeShowCardEmailCampaignId: '27928c2b-3d29-4837-8b62-4989da1383a9',
      brazeApiUrl: 'https://rest.fra-02.braze.eu',
      redemptionsWebHost: 'https://staging.bluelightcard.co.uk',
      redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
      redemptionsEmailDomain: 'bluelightcard.co.uk',
      brazeRedemptionVaultPushNotificationCampaignId: '96d2da22-654d-418d-9184-28d6d01a08c2',
      brazeRedemptionVaultQRPushNotificationCampaignId: '4805f70d-cdab-4eee-9d47-107b3bda0f61',
      brazeRedemptionPreAppliedPushNotificationCampaignId: 'a76d8340-15b0-4460-adfe-941edd261149',
      brazeRedemptionGenericPushNotificationCampaignId: '1b0b84ce-4595-411c-adc1-e8aa6c225cac',
      brazeRedemptionShowCardPushNotificationCampaignId: '2ca64df5-3768-40bc-8ad6-2735b9e3de45',
    };
  }

  public static forPrStage(): RedemptionsStackConfig {
    return {
      redemptionsLambdaScriptsSecretName: 'blc-mono-redemptions/NewVaultSecrets',
      redemptionsLambdaScriptsEnvironment: 'develop',
      redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
      redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
      redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
      redemptionsLambdaScriptsViewVaultBatchesPath: 'NewVault/viewBatches',
      redemptionsLambdaScriptsCheckVaultStockPath: 'NewVault/checkVaultStock',
      apiDefaultAllowedOrigins: ['*'],
      brazeVaultEmailCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
      brazeGenericEmailCampaignId: '6b91bac5-0c3a-4508-8978-8814d573b845',
      brazePreAppliedEmailCampaignId: '00816603-1b52-42b3-9816-903508163c7e',
      brazeVaultQrCodeEmailCampaignId: 'eb6dac40-f99b-4634-889b-2f6451beaa82',
      brazeShowCardEmailCampaignId: '27928c2b-3d29-4837-8b62-4989da1383a9',
      brazeApiUrl: 'https://rest.fra-02.braze.eu',
      redemptionsWebHost: 'https://staging.bluelightcard.co.uk',
      redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
      redemptionsEmailDomain: 'bluelightcard.co.uk',
      brazeRedemptionVaultPushNotificationCampaignId: '96d2da22-654d-418d-9184-28d6d01a08c2',
      brazeRedemptionVaultQRPushNotificationCampaignId: '4805f70d-cdab-4eee-9d47-107b3bda0f61',
      brazeRedemptionPreAppliedPushNotificationCampaignId: 'a76d8340-15b0-4460-adfe-941edd261149',
      brazeRedemptionGenericPushNotificationCampaignId: '1b0b84ce-4595-411c-adc1-e8aa6c225cac',
      brazeRedemptionShowCardPushNotificationCampaignId: '2ca64df5-3768-40bc-8ad6-2735b9e3de45',
    };
  }

  public static fromEnvironmentVariables(): RedemptionsStackConfig {
    return {
      redemptionsLambdaScriptsSecretName: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_NAME,
      ),
      redemptionsLambdaScriptsEnvironment: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT,
      ),
      redemptionsLambdaScriptsHost: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST),
      redemptionsLambdaScriptsRetrieveAllVaultsPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH,
      ),
      redemptionsLambdaScriptsCodeRedeemedPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH,
      ),
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH,
      ),
      redemptionsLambdaScriptsCodeAmountIssuedPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH,
      ),
      redemptionsLambdaScriptsViewVaultBatchesPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH,
      ),
      redemptionsLambdaScriptsCheckVaultStockPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH,
      ),
      apiDefaultAllowedOrigins: getEnvValidated(
        RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
        JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
      ),
      brazeVaultEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID),
      brazeGenericEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_GENERIC_EMAIL_CAMPAIGN_ID),
      brazePreAppliedEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID),
      brazeVaultQrCodeEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID),
      brazeShowCardEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID),
      brazeApiUrl: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_API_URL),
      redemptionsWebHost: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST),
      redemptionsEmailFrom: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM),
      redemptionsEmailDomain: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_DOMAIN),
      brazeRedemptionVaultPushNotificationCampaignId: getEnv(
        RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_PUSH_NOTIFICATION_CAMPAIGN_ID,
      ),
      brazeRedemptionVaultQRPushNotificationCampaignId: getEnv(
        RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_QR_PUSH_NOTIFICATION_CAMPAIGN_ID,
      ),
      brazeRedemptionPreAppliedPushNotificationCampaignId: getEnv(
        RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_PRE_APPLIED_PUSH_NOTIFICATION_CAMPAIGN_ID,
      ),
      brazeRedemptionGenericPushNotificationCampaignId: getEnv(
        RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GENERIC_PUSH_NOTIFICATION_CAMPAIGN_ID,
      ),
      brazeRedemptionShowCardPushNotificationCampaignId: getEnv(
        RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_SHOW_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID,
      ),
    };
  }
}
