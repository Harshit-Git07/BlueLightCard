import { Stack } from 'sst/constructs';

import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND, MAP_BRAND } from '@blc-mono/core/constants/common';
import { Brand, CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv, getEnvOrDefault, getEnvOrDefaultValidated, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX } from '../constants/sst';

type NetworkConfig = {
  adminApiDefaultAllowedOrigins: string[];
  apiDefaultAllowedOrigins: string[];
  redemptionsWebHost: string;
  identityApiUrl: string;
};

type SecretsManagerConfig = {
  secretsManagerName: string;
  uniqodoSecretsManagerName: string;
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

type EagleEyeConfig = {
  eagleEyeApiUrl: string;
};

type BrazeConfig = {
  brazeApiUrl: string;
};

type BrazeEmailCampaignsConfig = {
  brazeGenericEmailCampaignId: string;
  brazeGiftCardEmailCampaignId: string;
  brazePreAppliedEmailCampaignId: string;
  brazeShowCardEmailCampaignId: string;
  brazeVaultEmailCampaignId: string;
  brazeVaultQrCodeEmailCampaignId: string;
  brazeVerifyEmailCampaignId: string;
  brazeBallotEmailCampaignId: string;
};

type BrazePushNotificationRedemptionCampaignsConfig = {
  brazeRedemptionVaultPushNotificationCampaignId: string;
  brazeRedemptionVaultQRPushNotificationCampaignId: string;
  brazeRedemptionPreAppliedPushNotificationCampaignId: string;
  brazeRedemptionGenericPushNotificationCampaignId: string;
  brazeRedemptionShowCardPushNotificationCampaignId: string;
  brazeRedemptionGiftCardPushNotificationCampaignId: string;
  brazeRedemptionVerifyPushNotificationCampaignId: string;
  brazeRedemptionBallotPushNotificationCampaignId: string;
};

type SESConfig = {
  redemptionsEmailFrom: string;
  redemptionsEmailDomain: string;
};

type FeatureFlagsConfig = {
  vaultCodesUploadBucket: string;
  enableStandardVault: string;
};

type UniqodoConfig = {
  uniqodoClaimUrl: string;
};

type IntegrationProviderConfig = {
  secretsManagerConfig: {
    name: string;
  };
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
  integrationProviderConfig: IntegrationProviderConfig;
  uniqodoConfig: UniqodoConfig;
  eagleEyeConfig: EagleEyeConfig;
};

export type PerBrandStaticValues = {
  secretManagerName: SecretsManagerConfig['secretsManagerName'];
  integrationProviderSecretsManagerName: IntegrationProviderConfig['secretsManagerConfig']['name'];
  uniqodoSecretManagerName: SecretsManagerConfig['uniqodoSecretsManagerName'];
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
        integrationProviderConfig: {
          secretsManagerConfig: {
            name: this.fromPerBrandStaticValues(BLC_UK_BRAND).integrationProviderSecretsManagerName,
          },
        },
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(BLC_UK_BRAND).secretManagerName,
          uniqodoSecretsManagerName: this.fromPerBrandStaticValues(BLC_UK_BRAND).uniqodoSecretManagerName,
        },
        networkConfig: {
          adminApiDefaultAllowedOrigins: ['https://cms.blcshine.io'],
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
          brazeGiftCardEmailCampaignId: '1c758910-08bf-6914-a854-9b79106f8761',
          brazePreAppliedEmailCampaignId: 'ab5691a2-0504-4099-88ef-56ac7ef5f03c',
          brazeVaultQrCodeEmailCampaignId: '31172aa1-2e31-4a77-b9ac-43896f511beb',
          brazeShowCardEmailCampaignId: 'bf54574e-f31e-418b-bd10-649762b74e6a',
          brazeVerifyEmailCampaignId: '3f33aec9-f493-4542-a190-db9e091118a4',
          brazeBallotEmailCampaignId: 'ecdc4259-3f5b-461b-a14e-f5399f34fb01',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: 'add3d84e-0ed2-447f-a2f8-a61fed443927',
          brazeRedemptionVaultQRPushNotificationCampaignId: '9b123d2e-b73d-456c-99c4-377dcb1c9348',
          brazeRedemptionPreAppliedPushNotificationCampaignId: 'f0e25e82-1436-4357-b198-c2b69fd98cf4',
          brazeRedemptionGenericPushNotificationCampaignId: '378d0b0e-aa79-4b7e-a1a8-96459db8379a',
          brazeRedemptionShowCardPushNotificationCampaignId: '90df7afd-5d1d-48d5-a4a5-a71c9279c1d0',
          brazeRedemptionGiftCardPushNotificationCampaignId: '656a2dc3-7350-48cd-b492-eaa91c59e6e4',
          brazeRedemptionVerifyPushNotificationCampaignId: '62072665-5906-4bfd-b432-3e7bd15f1729',
          brazeRedemptionBallotPushNotificationCampaignId: '7b7dfdec-82b1-4b7f-8479-a2cd38477c85',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
          redemptionsEmailDomain: 'bluelightcard.co.uk',
        },
        uniqodoConfig: {
          uniqodoClaimUrl: 'https://reward.uniqodo.io/v2/claims',
        },
        eagleEyeConfig: {
          eagleEyeApiUrl: 'https://consumer.uk.eagleeye.com',
        },
      },
      [BLC_AU_BRAND]: {
        integrationProviderConfig: {
          secretsManagerConfig: {
            name: this.fromPerBrandStaticValues(BLC_AU_BRAND).integrationProviderSecretsManagerName,
          },
        },
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(BLC_AU_BRAND).secretManagerName,
          uniqodoSecretsManagerName: this.fromPerBrandStaticValues(BLC_AU_BRAND).uniqodoSecretManagerName,
        },
        networkConfig: {
          adminApiDefaultAllowedOrigins: ['https://cms.blcshine.io'],
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
          brazeGiftCardEmailCampaignId: '2244cabe-6bb1-4112-ae03-620a7da55e81',
          brazePreAppliedEmailCampaignId: '16c76b8a-ae02-7ce7-16f3-cf5c7a133f85',
          brazeShowCardEmailCampaignId: '16260349-af64-6342-693b-fcc610fa97ad',
          brazeVaultEmailCampaignId: '1392bce7-45a4-7e40-7f91-d053740c6a9c',
          brazeVaultQrCodeEmailCampaignId: '87597364-b176-96f5-4583-06e74126416b',
          brazeVerifyEmailCampaignId: 'd4209313-6532-4b4a-8d3d-3619d6854096',
          brazeBallotEmailCampaignId: '',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: '7c67b20d-71c3-4cc3-b967-99ad95b4d977',
          brazeRedemptionVaultQRPushNotificationCampaignId: '509dd574-0da0-49aa-9cdb-ad5c9250034c',
          brazeRedemptionPreAppliedPushNotificationCampaignId: '1524449a-a294-4582-85f6-b3508fe13314',
          brazeRedemptionGenericPushNotificationCampaignId: '8f91d5da-45a7-4838-8178-781801df34da',
          brazeRedemptionShowCardPushNotificationCampaignId: 'a291d19f-6720-4975-8ca8-88bed8ad7783',
          brazeRedemptionGiftCardPushNotificationCampaignId: '3b5982f8-3f64-45ad-8796-98aa8b636e6c',
          brazeRedemptionVerifyPushNotificationCampaignId: '93f213a3-4ec5-418e-9334-95078fb3da27',
          brazeRedemptionBallotPushNotificationCampaignId: '',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk', // Add email config per brand later
          redemptionsEmailDomain: 'bluelightcard.co.uk', // Add email config per brand later
        },
        uniqodoConfig: {
          uniqodoClaimUrl: 'https://reward.uniqodo.io/v2/claims',
        },
        eagleEyeConfig: {
          eagleEyeApiUrl: 'https://consumer.uk.eagleeye.com',
        },
      },
      [DDS_UK_BRAND]: {
        integrationProviderConfig: {
          secretsManagerConfig: {
            name: this.fromPerBrandStaticValues(DDS_UK_BRAND).integrationProviderSecretsManagerName,
          },
        },
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(DDS_UK_BRAND).secretManagerName,
          uniqodoSecretsManagerName: this.fromPerBrandStaticValues(DDS_UK_BRAND).uniqodoSecretManagerName,
        },
        networkConfig: {
          adminApiDefaultAllowedOrigins: ['https://cms.blcshine.io'],
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
          brazeGiftCardEmailCampaignId: '34e27502-261d-42af-a106-b28872c32a37',
          brazePreAppliedEmailCampaignId: '352eedf0-0874-cc51-c498-fff31ed7e3a4',
          brazeShowCardEmailCampaignId: '781508f5-bea7-1532-bd7b-1cf73879c077',
          brazeVaultEmailCampaignId: '533ea136-1e73-52c4-e037-b95a4f545362',
          brazeVaultQrCodeEmailCampaignId: '38688c03-8b5c-43da-fb38-76908480b5e9',
          brazeVerifyEmailCampaignId: 'ef8cd635-e74e-459d-8e94-d1326654350b',
          brazeBallotEmailCampaignId: '',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: 'f50c6960-d3ca-48e4-af6c-3590b1e5e63d',
          brazeRedemptionVaultQRPushNotificationCampaignId: '54361744-48a3-4044-956e-bff5c69fa654',
          brazeRedemptionPreAppliedPushNotificationCampaignId: '4a9b40e5-3e70-4f54-bec6-ccae1114ded5',
          brazeRedemptionGenericPushNotificationCampaignId: 'd1bf3172-944b-4ba5-8ae6-7b9417d548c9',
          brazeRedemptionShowCardPushNotificationCampaignId: '2fe74877-e587-4853-a66f-33a2e0cb6461',
          brazeRedemptionGiftCardPushNotificationCampaignId: 'd5cfc6f1-1059-42aa-820b-41ff706adead',
          brazeRedemptionVerifyPushNotificationCampaignId: '4f9a1882-3822-4021-bfea-33b41eb92471',
          brazeRedemptionBallotPushNotificationCampaignId: '',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk', // Add email config per brand later
          redemptionsEmailDomain: 'bluelightcard.co.uk', // Add email config per brand later
        },
        uniqodoConfig: {
          uniqodoClaimUrl: 'https://reward.uniqodo.io/v2/claims',
        },
        eagleEyeConfig: {
          eagleEyeApiUrl: 'https://consumer.uk.eagleeye.com',
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
        integrationProviderConfig: {
          secretsManagerConfig: {
            name: this.fromPerBrandStaticValues(BLC_UK_BRAND).integrationProviderSecretsManagerName,
          },
        },
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(BLC_UK_BRAND).secretManagerName,
          uniqodoSecretsManagerName: this.fromPerBrandStaticValues(BLC_UK_BRAND).uniqodoSecretManagerName,
        },
        networkConfig: {
          adminApiDefaultAllowedOrigins: [
            'http://localhost:3333',
            'https://cms-staging.blcshine.io',
          ],
          apiDefaultAllowedOrigins: [
            'https://www.staging.bluelightcard.co.uk',
            'http://localhost:3000',
            'https://legacy.staging.bluelightcard.co.uk',
          ],
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
          brazeGiftCardEmailCampaignId: '4577b2b8-a5df-433a-b86b-5bdbe9974cb9',
          brazePreAppliedEmailCampaignId: '00816603-1b52-42b3-9816-903508163c7e',
          brazeVaultQrCodeEmailCampaignId: 'eb6dac40-f99b-4634-889b-2f6451beaa82',
          brazeShowCardEmailCampaignId: '27928c2b-3d29-4837-8b62-4989da1383a9',
          brazeVerifyEmailCampaignId: 'd9e80016-85d3-4e73-a76e-022a96fa8f0d',
          brazeBallotEmailCampaignId: '7555755c-9980-4fe9-9a42-c3e8487cf855',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: '96d2da22-654d-418d-9184-28d6d01a08c2',
          brazeRedemptionVaultQRPushNotificationCampaignId: '4805f70d-cdab-4eee-9d47-107b3bda0f61',
          brazeRedemptionPreAppliedPushNotificationCampaignId: 'a76d8340-15b0-4460-adfe-941edd261149',
          brazeRedemptionGenericPushNotificationCampaignId: '1b0b84ce-4595-411c-adc1-e8aa6c225cac',
          brazeRedemptionShowCardPushNotificationCampaignId: '2ca64df5-3768-40bc-8ad6-2735b9e3de45',
          brazeRedemptionGiftCardPushNotificationCampaignId: '758714b3-8913-4ce7-aa76-16f82c835399',
          brazeRedemptionVerifyPushNotificationCampaignId: 'f0bafd20-3381-4cef-a2c8-68610274a823',
          brazeRedemptionBallotPushNotificationCampaignId: '91e2e276-739a-4e93-b1c7-df9e7351259c',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
          redemptionsEmailDomain: 'bluelightcard.co.uk',
        },

        uniqodoConfig: {
          uniqodoClaimUrl: 'https://reward.uniqodo.io/v2/claims',
        },
        eagleEyeConfig: {
          eagleEyeApiUrl: 'https://consumer.uk.eagleeye.com',
        },
      },
      [BLC_AU_BRAND]: {
        integrationProviderConfig: {
          secretsManagerConfig: {
            name: this.fromPerBrandStaticValues(BLC_AU_BRAND).integrationProviderSecretsManagerName,
          },
        },
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(BLC_AU_BRAND).secretManagerName,
          uniqodoSecretsManagerName: this.fromPerBrandStaticValues(BLC_AU_BRAND).uniqodoSecretManagerName,
        },
        networkConfig: {
          adminApiDefaultAllowedOrigins: [
            'http://localhost:3333',
            'https://cms-staging.blcshine.io',
          ],
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
          brazeGiftCardEmailCampaignId: '19180cd3-8165-4f51-8732-1ccee36bb711',
          brazePreAppliedEmailCampaignId: '3661f6b4-5e3f-5380-690b-34029be0e559',
          brazeShowCardEmailCampaignId: 'e08f6174-cff9-ca5d-8742-ff505843a821',
          brazeVaultEmailCampaignId: 'e5d1d088-b766-6edf-8b9a-85b26da52ea2',
          brazeVaultQrCodeEmailCampaignId: 'a83acf23-6427-60d5-da8e-122dd7a002d2',
          brazeVerifyEmailCampaignId: '6299b1f9-3ed4-4422-ab0b-c7ce4752ff2e',
          brazeBallotEmailCampaignId: '',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: 'c3ca36e2-399e-466a-8b66-5fd992084ee1',
          brazeRedemptionVaultQRPushNotificationCampaignId: '5e80aff1-9792-468f-a0cd-3b618b5239ba',
          brazeRedemptionPreAppliedPushNotificationCampaignId: '33df4a57-333b-4975-b847-2c995a3b35cf',
          brazeRedemptionGenericPushNotificationCampaignId: '27e574d3-a8f7-4f08-a668-f90b3c36d5a6',
          brazeRedemptionShowCardPushNotificationCampaignId: 'af41d99b-4003-4344-a69d-2a403bb45090',
          brazeRedemptionGiftCardPushNotificationCampaignId: '4c63b04f-b707-4f26-9e93-94be58392980',
          brazeRedemptionVerifyPushNotificationCampaignId: '98a17573-6a3f-44ab-b509-824f3924087f',
          brazeRedemptionBallotPushNotificationCampaignId: '',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk', // Add email config per brand later
          redemptionsEmailDomain: 'bluelightcard.co.uk', // Add email config per brand later
        },
        uniqodoConfig: {
          uniqodoClaimUrl: 'https://reward.uniqodo.io/v2/claims',
        },
        eagleEyeConfig: {
          eagleEyeApiUrl: 'https://consumer.uk.eagleeye.com',
        },
      },
      [DDS_UK_BRAND]: {
        integrationProviderConfig: {
          secretsManagerConfig: {
            name: this.fromPerBrandStaticValues(DDS_UK_BRAND).integrationProviderSecretsManagerName,
          },
        },
        secretsManagerConfig: {
          secretsManagerName: this.fromPerBrandStaticValues(DDS_UK_BRAND).secretManagerName,
          uniqodoSecretsManagerName: this.fromPerBrandStaticValues(DDS_UK_BRAND).uniqodoSecretManagerName,
        },
        networkConfig: {
          adminApiDefaultAllowedOrigins: [
            'http://localhost:3333',
            'https://cms-staging.blcshine.io',
          ],
          apiDefaultAllowedOrigins: [
            'https://www.ddsstaging.bluelightcard.tech',
            'http://localhost:3000',
            'https://legacy.staging.bluelightcard.co.uk',
          ],
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
          brazeGiftCardEmailCampaignId: 'ba77fc8d-94a8-44fa-b0ca-7a8467fb2442',
          brazePreAppliedEmailCampaignId: '701d81a5-17c0-8081-9976-a1fd1b60b52b',
          brazeShowCardEmailCampaignId: '1d187e2e-481b-a128-5a5d-e81e1291de01',
          brazeVaultEmailCampaignId: '3a791d7c-8a61-5fb9-d41f-68c861bbf87f',
          brazeVaultQrCodeEmailCampaignId: '3fadd0eb-f39c-88f0-c6c4-8d410c2dae72',
          brazeVerifyEmailCampaignId: '723c5e1d-c752-46db-a387-37e80f6653fe',
          brazeBallotEmailCampaignId: '',
        },
        brazePushNotificationRedemptionCampaignsConfig: {
          brazeRedemptionVaultPushNotificationCampaignId: '8d74b2ad-07ab-4674-95ea-3ed0943e4e7c',
          brazeRedemptionVaultQRPushNotificationCampaignId: '56087276-e496-492e-927b-7d3cb10c2711',
          brazeRedemptionPreAppliedPushNotificationCampaignId: '7ce83353-2f23-4cba-98a0-de315d90f261',
          brazeRedemptionGenericPushNotificationCampaignId: '0779e9f8-1839-48a5-bde4-7479ce4c796b',
          brazeRedemptionShowCardPushNotificationCampaignId: 'fca683b8-ceff-4663-9b9c-2d8a79553a82',
          brazeRedemptionGiftCardPushNotificationCampaignId: 'c218976e-4181-4fa0-8a8c-8ec06b5bb302',
          brazeRedemptionVerifyPushNotificationCampaignId: 'd48b793d-ab28-40df-a73f-58a69a790dbf',
          brazeRedemptionBallotPushNotificationCampaignId: '',
        },
        sesConfig: {
          redemptionsEmailFrom: 'noreply@bluelightcard.co.uk', // Add email config per brand later
          redemptionsEmailDomain: 'bluelightcard.co.uk', // Add email config per brand later
        },
        uniqodoConfig: {
          uniqodoClaimUrl: 'https://reward.uniqodo.io/v2/claims',
        },
        eagleEyeConfig: {
          eagleEyeApiUrl: 'https://consumer.uk.eagleeye.com',
        },
      },
    };
  }

  public static forPrStage(): RedemptionsStackConfig {
    return {
      integrationProviderConfig: {
        secretsManagerConfig: {
          name: 'blc-mono-redemptions/integrationProviderSecrets',
        },
      },
      secretsManagerConfig: {
        secretsManagerName: 'blc-mono-redemptions/NewVaultSecrets',
        uniqodoSecretsManagerName: 'blc-mono-redemptions/uniqodo-api-blc-uk',
      },
      networkConfig: {
        adminApiDefaultAllowedOrigins: ['*'],
        apiDefaultAllowedOrigins: ['*'],
        redemptionsWebHost: 'https://staging.bluelightcard.co.uk',
        identityApiUrl: 'dynamic-via-build-script',
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
        brazeGiftCardEmailCampaignId: '4577b2b8-a5df-433a-b86b-5bdbe9974cb9',
        brazePreAppliedEmailCampaignId: '00816603-1b52-42b3-9816-903508163c7e',
        brazeShowCardEmailCampaignId: '27928c2b-3d29-4837-8b62-4989da1383a9',
        brazeVaultEmailCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
        brazeVaultQrCodeEmailCampaignId: 'eb6dac40-f99b-4634-889b-2f6451beaa82',
        brazeVerifyEmailCampaignId: 'd9e80016-85d3-4e73-a76e-022a96fa8f0d',
        brazeBallotEmailCampaignId: '7555755c-9980-4fe9-9a42-c3e8487cf855',
      },
      brazePushNotificationRedemptionCampaignsConfig: {
        brazeRedemptionVaultPushNotificationCampaignId: '96d2da22-654d-418d-9184-28d6d01a08c2',
        brazeRedemptionVaultQRPushNotificationCampaignId: '4805f70d-cdab-4eee-9d47-107b3bda0f61',
        brazeRedemptionPreAppliedPushNotificationCampaignId: 'a76d8340-15b0-4460-adfe-941edd261149',
        brazeRedemptionGenericPushNotificationCampaignId: '1b0b84ce-4595-411c-adc1-e8aa6c225cac',
        brazeRedemptionShowCardPushNotificationCampaignId: '2ca64df5-3768-40bc-8ad6-2735b9e3de45',
        brazeRedemptionGiftCardPushNotificationCampaignId: '758714b3-8913-4ce7-aa76-16f82c835399',
        brazeRedemptionVerifyPushNotificationCampaignId: 'f0bafd20-3381-4cef-a2c8-68610274a823',
        brazeRedemptionBallotPushNotificationCampaignId: '91e2e276-739a-4e93-b1c7-df9e7351259c',
      },
      sesConfig: {
        redemptionsEmailFrom: 'noreply@bluelightcard.co.uk',
        redemptionsEmailDomain: 'bluelightcard.co.uk',
      },
      uniqodoConfig: {
        uniqodoClaimUrl: 'https://reward.uniqodo.io/v2/claims',
      },
      eagleEyeConfig: {
        eagleEyeApiUrl: 'https://consumer.uk.eagleeye.com',
      },
    };
  }

  public static fromEnvironmentVariables(stage: string, brand: Brand): RedemptionsStackConfig {
    return {
      integrationProviderConfig: {
        secretsManagerConfig: {
          name: 'blc-mono-redemptions/integrationProviderSecrets-dev',
        },
      },
      secretsManagerConfig: {
        secretsManagerName: this.fromPerBrandStaticValues(brand).secretManagerName,
        uniqodoSecretsManagerName: this.fromPerBrandStaticValues(brand).uniqodoSecretManagerName,
      },
      networkConfig: {
        adminApiDefaultAllowedOrigins: getEnvOrDefaultValidated(
          RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS,
          ['*'],
          JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
        ),
        apiDefaultAllowedOrigins: getEnvValidated(
          RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
          JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
        ),
        redemptionsWebHost: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_WEB_HOST),
        identityApiUrl: 'dynamic-via-build-script',
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
        brazeGiftCardEmailCampaignId: getEnvOrDefault(
          RedemptionsStackEnvironmentKeys.BRAZE_GIFT_CARD_EMAIL_CAMPAIGN_ID,
          '4577b2b8-a5df-433a-b86b-5bdbe9974cb9',
        ),
        brazePreAppliedEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_PRE_APPLIED_EMAIL_CAMPAIGN_ID),
        brazeShowCardEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_SHOW_CARD_EMAIL_CAMPAIGN_ID),
        brazeVaultEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULT_EMAIL_CAMPAIGN_ID),
        brazeVaultQrCodeEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_VAULTQR_EMAIL_CAMPAIGN_ID),
        brazeVerifyEmailCampaignId: getEnvOrDefault(
          RedemptionsStackEnvironmentKeys.BRAZE_VERIFY_EMAIL_CAMPAIGN_ID,
          'd9e80016-85d3-4e73-a76e-022a96fa8f0d',
        ),
        brazeBallotEmailCampaignId: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_BALLOT_EMAIL_CAMPAIGN_ID),
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
        brazeRedemptionGiftCardPushNotificationCampaignId: getEnv(
          RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_GIFT_CARD_PUSH_NOTIFICATION_CAMPAIGN_ID,
        ),
        brazeRedemptionVerifyPushNotificationCampaignId: getEnvOrDefault(
          RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_VERIFY_PUSH_NOTIFICATION_CAMPAIGN_ID,
          'f0bafd20-3381-4cef-a2c8-68610274a823',
        ),
        brazeRedemptionBallotPushNotificationCampaignId: getEnv(
          RedemptionsStackEnvironmentKeys.BRAZE_REDEMPTION_BALLOT_PUSH_NOTIFICATION_CAMPAIGN_ID,
        ),
      },
      sesConfig: {
        redemptionsEmailFrom: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM),
        redemptionsEmailDomain: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_DOMAIN),
      },
      uniqodoConfig: {
        uniqodoClaimUrl: 'https://reward.uniqodo.io/v2/claims',
      },
      eagleEyeConfig: {
        eagleEyeApiUrl: 'https://consumer.uk.eagleeye.com',
      },
    };
  }

  private static fromPerBrandStaticValues(brand: Brand): PerBrandStaticValues {
    const values: Record<Brand, PerBrandStaticValues> = {
      [BLC_AU_BRAND]: {
        secretManagerName: 'blc-mono-redemptions/NewVaultSecrets-blc-au',
        integrationProviderSecretsManagerName: 'blc-mono-redemptions/integrationProviderSecrets-blc-au',
        uniqodoSecretManagerName: 'blc-mono-redemptions/uniqodo-api-blc-au',
      },
      [BLC_UK_BRAND]: {
        secretManagerName: 'blc-mono-redemptions/NewVaultSecrets',
        integrationProviderSecretsManagerName: 'blc-mono-redemptions/integrationProviderSecrets',
        uniqodoSecretManagerName: 'blc-mono-redemptions/uniqodo-api-blc-uk',
      },
      [DDS_UK_BRAND]: {
        secretManagerName: 'blc-mono-redemptions/NewVaultSecrets-dds-uk',
        integrationProviderSecretsManagerName: 'blc-mono-redemptions/integrationProviderSecrets-dds-uk',
        uniqodoSecretManagerName: 'blc-mono-redemptions/uniqodo-api-dds-uk',
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
