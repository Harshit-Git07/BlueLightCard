import { Stack } from 'sst/constructs';

import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND, MAP_BRAND } from '@blc-mono/core/constants/common';
import { Brand, CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX } from '../constants/sst';

type NetworkConfig = {
  apiDefaultAllowedOrigins: string[];
  redemptionsWebHost: string;
  identityApiUrl: string;
};

type SecretsManagerConfig = {
  secretsManagerName: string;
};

type LambdaScriptsCommonConfig = {
  redemptionsLambdaScriptsEnvironment: string;
};

type LambdaScriptsPerBrandConfig = {
  redemptionsLambdaScriptsHost: string;
};

type LambdaScriptsPathsConfig = {
  redemptionsLambdaScriptsRetrieveAllVaultsPath: string;
  redemptionsLambdaScriptsCodeRedeemedPath: string;
  redemptionsLambdaScriptsAssignUserCodesRedeemedPath: string;
  redemptionsLambdaScriptsCodeAmountIssuedPath: string;
  redemptionsLambdaScriptsViewVaultBatchesPath: string;
  redemptionsLambdaScriptsCheckVaultStockPath: string;
};

type BrazeConfig = {
  brazeApiUrl: string;
};

type BrazeEmailCampaignsConfig = {
  brazeGenericEmailCampaignId: string;
  brazePreAppliedEmailCampaignId: string;
  brazeShowCardEmailCampaignId: string;
  brazeVaultEmailCampaignId: string;
  brazeVaultQrCodeEmailCampaignId: string;
};

type BrazePushNotificationRedemptionCampaignsConfig = {
  brazeRedemptionVaultPushNotificationCampaignId: string;
  brazeRedemptionVaultQRPushNotificationCampaignId: string;
  brazeRedemptionPreAppliedPushNotificationCampaignId: string;
  brazeRedemptionGenericPushNotificationCampaignId: string;
  brazeRedemptionShowCardPushNotificationCampaignId: string;
};

type SESConfig = {
  redemptionsEmailFrom: string;
  redemptionsEmailDomain: string;
};

type FeatureFlagsConfig = {
  vaultCodesUploadBucket: string;
  enableStandardVault: string;
};

export type RedemptionsStackConfig = {
  secretsManagerConfig: SecretsManagerConfig;
  networkConfig: NetworkConfig;
  lambdaScriptsConfig: LambdaScriptsCommonConfig & LambdaScriptsPerBrandConfig;
  lambdaScriptsPathsConfig: LambdaScriptsPathsConfig;
  brazeConfig: BrazeConfig;
  brazeEmailCampaignsConfig: BrazeEmailCampaignsConfig;
  brazePushNotificationRedemptionCampaignsConfig: BrazePushNotificationRedemptionCampaignsConfig;
  sesConfig: SESConfig;
  featureFlagsConfig: FeatureFlagsConfig;
};

export type PerBrandStaticValues = {
  secretManagerName: SecretsManagerConfig['secretsManagerName'];
};

export type StaticValues = {
  lambdaScriptsPathsConfig: LambdaScriptsPathsConfig;
  brazeConfig: BrazeConfig;
};

export class RedemptionsStackConfigResolver {
  public static for(stack: Stack): RedemptionsStackConfig {
    const brand = getBrandFromEnv();
    switch (true) {
      case isProduction(stack.stage):
        return this.forProductionStage()[brand];
      case isStaging(stack.stage):
        return this.forStagingStage()[brand];
      case PR_STAGE_REGEX.test(stack.stage):
        return this.forPrStage();
      default:
        return this.fromEnvironmentVariables(stack.stage, brand);
    }
  }

  public static forProductionStage(): Record<Brand, RedemptionsStackConfig> {
    const commonStaticValues = this.fromStaticValues();
    const commonLambdaScriptsConfig: LambdaScriptsCommonConfig = {
      redemptionsLambdaScriptsEnvironment: 'production',
    };

    return {
      [BLC_UK_BRAND]: {
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(BLC_UK_BRAND).secretManagerName,
        },
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.bluelightcard.co.uk'],
          redemptionsWebHost: 'https://www.bluelightcard.co.uk',
          identityApiUrl: 'https://identity.blcshine.io',
        },
        lambdaScriptsConfig: {
          ...commonLambdaScriptsConfig,
          redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
        },
        lambdaScriptsPathsConfig: commonStaticValues.lambdaScriptsPathsConfig,
        brazeConfig: commonStaticValues.brazeConfig,
        featureFlagsConfig: {
          vaultCodesUploadBucket: `production-${MAP_BRAND[BLC_UK_BRAND]}-vault-codes-upload`,
          enableStandardVault: 'false',
        },
        brazeEmailCampaignsConfig: {
          brazeVaultEmailCampaignId: '23555377-445a-838a-74a0-0c274c8ae2f8',
          brazeGenericEmailCampaignId: '091d0923-b2a8-4884-9955-df72b8993e64',
          brazePreAppliedEmailCampaignId: 'da993fac-5fac-44ec-a703-c1f4c8fa8547',
          brazeVaultQrCodeEmailCampaignId: '31172aa1-2e31-4a77-b9ac-43896f511beb',
          brazeShowCardEmailCampaignId: 'bf54574e-f31e-418b-bd10-649762b74e6a',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: 'add3d84e-0ed2-447f-a2f8-a61fed443927',
          brazeRedemptionVaultQRPushNotificationCampaignId: '9b123d2e-b73d-456c-99c4-377dcb1c9348',
          brazeRedemptionPreAppliedPushNotificationCampaignId: 'f0e25e82-1436-4357-b198-c2b69fd98cf4',
          brazeRedemptionGenericPushNotificationCampaignId: '378d0b0e-aa79-4b7e-a1a8-96459db8379a',
          brazeRedemptionShowCardPushNotificationCampaignId: '90df7afd-5d1d-48d5-a4a5-a71c9279c1d0',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
          redemptionsEmailDomain: 'bluelightcard.co.uk',
        },
      },
      [BLC_AU_BRAND]: {
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(BLC_AU_BRAND).secretManagerName,
        },
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.bluelightcard.com.au'],
          redemptionsWebHost: 'https://www.bluelightcard.com.au',
          identityApiUrl: 'https://identity-au.blcshine.io',
        },
        lambdaScriptsConfig: {
          ...commonLambdaScriptsConfig,
          redemptionsLambdaScriptsHost: 'https://ygauzrsxm4.execute-api.ap-southeast-2.amazonaws.com',
        },
        lambdaScriptsPathsConfig: commonStaticValues.lambdaScriptsPathsConfig,
        brazeConfig: commonStaticValues.brazeConfig,
        featureFlagsConfig: {
          enableStandardVault: 'false',
          vaultCodesUploadBucket: `production-${MAP_BRAND[BLC_AU_BRAND]}-vault-codes-upload`,
        },
        brazeEmailCampaignsConfig: {
          brazeGenericEmailCampaignId: '440ecd00-0dcb-c47d-70a2-0a72adc53fa1',
          brazePreAppliedEmailCampaignId: '16c76b8a-ae02-7ce7-16f3-cf5c7a133f85',
          brazeShowCardEmailCampaignId: '16260349-af64-6342-693b-fcc610fa97ad',
          brazeVaultEmailCampaignId: '1392bce7-45a4-7e40-7f91-d053740c6a9c',
          brazeVaultQrCodeEmailCampaignId: '87597364-b176-96f5-4583-06e74126416b',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: '',
          brazeRedemptionVaultQRPushNotificationCampaignId: '',
          brazeRedemptionPreAppliedPushNotificationCampaignId: '',
          brazeRedemptionGenericPushNotificationCampaignId: '',
          brazeRedemptionShowCardPushNotificationCampaignId: '',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk', // Add email config per brand later
          redemptionsEmailDomain: 'bluelightcard.co.uk', // Add email config per brand later
        },
      },
      [DDS_UK_BRAND]: {
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(DDS_UK_BRAND).secretManagerName,
        },
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.defencediscountservice.co.uk'],
          redemptionsWebHost: 'https://www.defencediscountservice.co.uk',
          identityApiUrl: 'https://identity.blcshine.io',
        },
        lambdaScriptsConfig: {
          ...commonLambdaScriptsConfig,
          redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
        },
        lambdaScriptsPathsConfig: commonStaticValues.lambdaScriptsPathsConfig,
        brazeConfig: commonStaticValues.brazeConfig,
        featureFlagsConfig: {
          vaultCodesUploadBucket: `production-${MAP_BRAND[DDS_UK_BRAND]}-vault-codes-upload`,
          enableStandardVault: 'false',
        },
        brazeEmailCampaignsConfig: {
          brazeGenericEmailCampaignId: 'ce7005e2-63a3-4a84-8376-965d35bcc3aa',
          brazePreAppliedEmailCampaignId: '352eedf0-0874-cc51-c498-fff31ed7e3a4',
          brazeShowCardEmailCampaignId: '781508f5-bea7-1532-bd7b-1cf73879c077',
          brazeVaultEmailCampaignId: '533ea136-1e73-52c4-e037-b95a4f545362',
          brazeVaultQrCodeEmailCampaignId: '38688c03-8b5c-43da-fb38-76908480b5e9',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: '',
          brazeRedemptionVaultQRPushNotificationCampaignId: '',
          brazeRedemptionPreAppliedPushNotificationCampaignId: '',
          brazeRedemptionGenericPushNotificationCampaignId: '',
          brazeRedemptionShowCardPushNotificationCampaignId: '',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk', // Add email config per brand later
          redemptionsEmailDomain: 'bluelightcard.co.uk', // Add email config per brand later
        },
      },
    };
  }

  public static forStagingStage(): Record<Brand, RedemptionsStackConfig> {
    const commonStaticValues = this.fromStaticValues();
    const commonLambdaScriptsConfig: LambdaScriptsCommonConfig = {
      redemptionsLambdaScriptsEnvironment: 'develop',
    };

    return {
      [BLC_UK_BRAND]: {
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(BLC_UK_BRAND).secretManagerName,
        },
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.staging.bluelightcard.co.uk', 'http://localhost:3000'],
          redemptionsWebHost: 'https://staging.bluelightcard.co.uk',
          identityApiUrl: 'https://staging-identity.blcshine.io',
        },
        lambdaScriptsConfig: {
          ...commonLambdaScriptsConfig,
          redemptionsLambdaScriptsHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
        },
        lambdaScriptsPathsConfig: commonStaticValues.lambdaScriptsPathsConfig,
        brazeConfig: commonStaticValues.brazeConfig,
        featureFlagsConfig: {
          vaultCodesUploadBucket: `staging-${MAP_BRAND[BLC_UK_BRAND]}-vault-codes-upload`,
          enableStandardVault: 'true',
        },
        brazeEmailCampaignsConfig: {
          brazeVaultEmailCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
          brazeGenericEmailCampaignId: '6b91bac5-0c3a-4508-8978-8814d573b845',
          brazePreAppliedEmailCampaignId: '00816603-1b52-42b3-9816-903508163c7e',
          brazeVaultQrCodeEmailCampaignId: 'eb6dac40-f99b-4634-889b-2f6451beaa82',
          brazeShowCardEmailCampaignId: '27928c2b-3d29-4837-8b62-4989da1383a9',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: '96d2da22-654d-418d-9184-28d6d01a08c2',
          brazeRedemptionVaultQRPushNotificationCampaignId: '4805f70d-cdab-4eee-9d47-107b3bda0f61',
          brazeRedemptionPreAppliedPushNotificationCampaignId: 'a76d8340-15b0-4460-adfe-941edd261149',
          brazeRedemptionGenericPushNotificationCampaignId: '1b0b84ce-4595-411c-adc1-e8aa6c225cac',
          brazeRedemptionShowCardPushNotificationCampaignId: '2ca64df5-3768-40bc-8ad6-2735b9e3de45',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
          redemptionsEmailDomain: 'bluelightcard.co.uk',
        },
      },
      [BLC_AU_BRAND]: {
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(BLC_AU_BRAND).secretManagerName,
        },
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.develop.bluelightcard.com.au', 'http://localhost:3000'],
          redemptionsWebHost: 'https://www.develop.bluelightcard.com.au',
          identityApiUrl: 'https://staging-identity-au.blcshine.io',
        },
        lambdaScriptsConfig: {
          ...commonLambdaScriptsConfig,
          redemptionsLambdaScriptsHost: 'https://4x2w70ksji.execute-api.ap-southeast-2.amazonaws.com',
        },
        lambdaScriptsPathsConfig: commonStaticValues.lambdaScriptsPathsConfig,
        brazeConfig: commonStaticValues.brazeConfig,
        featureFlagsConfig: {
          enableStandardVault: 'true',
          vaultCodesUploadBucket: `staging-${MAP_BRAND[BLC_AU_BRAND]}-vault-codes-upload`,
        },
        brazeEmailCampaignsConfig: {
          brazeGenericEmailCampaignId: '03b77f7f-fa20-0146-e910-f62132b35443',
          brazePreAppliedEmailCampaignId: '3661f6b4-5e3f-5380-690b-34029be0e559',
          brazeShowCardEmailCampaignId: 'e08f6174-cff9-ca5d-8742-ff505843a821',
          brazeVaultEmailCampaignId: 'e5d1d088-b766-6edf-8b9a-85b26da52ea2',
          brazeVaultQrCodeEmailCampaignId: 'a83acf23-6427-60d5-da8e-122dd7a002d2',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: '',
          brazeRedemptionVaultQRPushNotificationCampaignId: '',
          brazeRedemptionPreAppliedPushNotificationCampaignId: '',
          brazeRedemptionGenericPushNotificationCampaignId: '',
          brazeRedemptionShowCardPushNotificationCampaignId: '',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk', // Add email config per brand later
          redemptionsEmailDomain: 'bluelightcard.co.uk', // Add email config per brand later
        },
      },
      [DDS_UK_BRAND]: {
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(DDS_UK_BRAND).secretManagerName,
        },
        networkConfig: {
          apiDefaultAllowedOrigins: ['https://www.ddsstaging.bluelightcard.tech', 'http://localhost:3000'],
          redemptionsWebHost: 'https://www.ddsstaging.bluelightcard.tech',
          identityApiUrl: 'https://staging-identity.blcshine.io',
        },
        lambdaScriptsConfig: {
          ...commonLambdaScriptsConfig,
          redemptionsLambdaScriptsHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
        },
        lambdaScriptsPathsConfig: commonStaticValues.lambdaScriptsPathsConfig,
        brazeConfig: commonStaticValues.brazeConfig,
        featureFlagsConfig: {
          vaultCodesUploadBucket: `staging-${MAP_BRAND[DDS_UK_BRAND]}-vault-codes-upload`,
          enableStandardVault: 'true',
        },
        brazeEmailCampaignsConfig: {
          brazeGenericEmailCampaignId: 'f3145cd5-6cc0-c2b8-0824-cb2f5df85072',
          brazePreAppliedEmailCampaignId: '701d81a5-17c0-8081-9976-a1fd1b60b52b',
          brazeShowCardEmailCampaignId: '1d187e2e-481b-a128-5a5d-e81e1291de01',
          brazeVaultEmailCampaignId: '3a791d7c-8a61-5fb9-d41f-68c861bbf87f',
          brazeVaultQrCodeEmailCampaignId: '3fadd0eb-f39c-88f0-c6c4-8d410c2dae72',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: '',
          brazeRedemptionVaultQRPushNotificationCampaignId: '',
          brazeRedemptionPreAppliedPushNotificationCampaignId: '',
          brazeRedemptionGenericPushNotificationCampaignId: '',
          brazeRedemptionShowCardPushNotificationCampaignId: '',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk', // Add email config per brand later
          redemptionsEmailDomain: 'bluelightcard.co.uk', // Add email config per brand later
        },
      },
    };
  }

  public static forPrStage(): RedemptionsStackConfig {
    return {
      secretsManagerConfig: {
        secretsManagerName: 'blc-mono-redemptions/NewVaultSecrets',
      },
      networkConfig: {
        apiDefaultAllowedOrigins: ['*'],
        redemptionsWebHost: 'https://staging.bluelightcard.co.uk',
        identityApiUrl: 'https://staging-identity.blcshine.io',
      },
      lambdaScriptsConfig: {
        redemptionsLambdaScriptsEnvironment: 'develop',
        redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      },
      lambdaScriptsPathsConfig: this.fromStaticValues().lambdaScriptsPathsConfig,
      brazeConfig: {
        brazeApiUrl: 'https://rest.fra-02.braze.eu',
      },
      featureFlagsConfig: {
        enableStandardVault: 'true',
        vaultCodesUploadBucket: 'staging-blc-uk-vault-codes-upload',
      },
      brazeEmailCampaignsConfig: {
        brazeGenericEmailCampaignId: '6b91bac5-0c3a-4508-8978-8814d573b845',
        brazePreAppliedEmailCampaignId: '00816603-1b52-42b3-9816-903508163c7e',
        brazeShowCardEmailCampaignId: '27928c2b-3d29-4837-8b62-4989da1383a9',
        brazeVaultEmailCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
        brazeVaultQrCodeEmailCampaignId: 'eb6dac40-f99b-4634-889b-2f6451beaa82',
      },
      brazePushNotificationRedemptionCampaignsConfig: {
        brazeRedemptionVaultPushNotificationCampaignId: '96d2da22-654d-418d-9184-28d6d01a08c2',
        brazeRedemptionVaultQRPushNotificationCampaignId: '4805f70d-cdab-4eee-9d47-107b3bda0f61',
        brazeRedemptionPreAppliedPushNotificationCampaignId: 'a76d8340-15b0-4460-adfe-941edd261149',
        brazeRedemptionGenericPushNotificationCampaignId: '1b0b84ce-4595-411c-adc1-e8aa6c225cac',
        brazeRedemptionShowCardPushNotificationCampaignId: '2ca64df5-3768-40bc-8ad6-2735b9e3de45',
      },
      sesConfig: {
        redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
        redemptionsEmailDomain: 'bluelightcard.co.uk',
      },
    };
  }

  public static fromEnvironmentVariables(stage: string, brand: Brand): RedemptionsStackConfig {
    return {
      secretsManagerConfig: {
        secretsManagerName: this.fromPerBrandStaticValues(brand).secretManagerName,
      },
      networkConfig: {
        apiDefaultAllowedOrigins: getEnvValidated(
          RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
          JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
        ),
        redemptionsWebHost: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST),
        identityApiUrl: getEnv(RedemptionsStackEnvironmentKeys.IDENTITY_API_URL),
      },
      lambdaScriptsConfig: {
        redemptionsLambdaScriptsHost: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST),
        redemptionsLambdaScriptsEnvironment: getEnv(
          RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT,
        ),
      },
      brazeConfig: {
        brazeApiUrl: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_API_URL),
      },
      lambdaScriptsPathsConfig: {
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
      },
      featureFlagsConfig: {
        vaultCodesUploadBucket: `${stage}-${brand}-vault-codes-upload`,
        enableStandardVault: getEnv(RedemptionsStackEnvironmentKeys.ENABLE_STANDARD_VAULT),
      },
      brazeEmailCampaignsConfig: {
        brazeGenericEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_GENERIC_EMAIL_CAMPAIGN_ID),
        brazePreAppliedEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID),
        brazeShowCardEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID),
        brazeVaultEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID),
        brazeVaultQrCodeEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID),
      },
      brazePushNotificationRedemptionCampaignsConfig: {
        brazeRedemptionGenericPushNotificationCampaignId: getEnv(
          RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GENERIC_PUSH_NOTIFICATION_CAMPAIGN_ID,
        ),
        brazeRedemptionPreAppliedPushNotificationCampaignId: getEnv(
          RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_PRE_APPLIED_PUSH_NOTIFICATION_CAMPAIGN_ID,
        ),
        brazeRedemptionShowCardPushNotificationCampaignId: getEnv(
          RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_SHOW_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID,
        ),
        brazeRedemptionVaultPushNotificationCampaignId: getEnv(
          RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_PUSH_NOTIFICATION_CAMPAIGN_ID,
        ),
        brazeRedemptionVaultQRPushNotificationCampaignId: getEnv(
          RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VAULT_QR_PUSH_NOTIFICATION_CAMPAIGN_ID,
        ),
      },
      sesConfig: {
        redemptionsEmailFrom: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM),
        redemptionsEmailDomain: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_DOMAIN),
      },
    };
  }

  private static fromPerBrandStaticValues(brand: Brand): PerBrandStaticValues {
    const values: Record<Brand, PerBrandStaticValues> = {
      [BLC_AU_BRAND]: {
        secretManagerName: 'blc-mono-redemptions/NewVaultSecrets-blc-au',
      },
      [BLC_UK_BRAND]: {
        secretManagerName: 'blc-mono-redemptions/NewVaultSecrets',
      },
      [DDS_UK_BRAND]: {
        secretManagerName: 'blc-mono-redemptions/NewVaultSecrets-dds-uk',
      },
    };

    return values[brand];
  }

  private static fromStaticValues(): StaticValues {
    return {
      brazeConfig: {
        brazeApiUrl: 'https://rest.fra-02.braze.eu',
      },
      lambdaScriptsPathsConfig: {
        redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
        redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
        redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
        redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
        redemptionsLambdaScriptsViewVaultBatchesPath: 'NewVault/viewBatches',
        redemptionsLambdaScriptsCheckVaultStockPath: 'NewVault/checkVaultStock',
      },
    };
  }
}
