import { Stack } from 'sst/constructs';

import { getEnv, getEnvRaw } from '@blc-mono/core/utils/getEnv';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';

export type RedemptionsStackConfig = {
  redemptionsLambdaScriptsSecretManager: string;
  redemptionsLambdaScriptsEnvironment: string;
  redemptionsLambdaScriptsHost: string;
  redemptionsLambdaScriptsRetrieveAllVaultsPath: string;
  redemptionsLambdaScriptsCodeRedeemedPath: string;
  redemptionsLambdaScriptsAssignUserCodesRedeemedPath: string;
  redemptionsLambdaScriptsCodeAmountIssuedPath: string;
  apiDefaultAllowedOrigins: string[];
  brazeVaultRedemptionVaultCampaignId: string;
  brazeApiUrl: string;
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
      redemptionsLambdaScriptsSecretManager: 'blc-mono-redemptions/NewVaultSecrets',
      redemptionsLambdaScriptsEnvironment: 'production',
      redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
      redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
      redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
      apiDefaultAllowedOrigins: [
        'https://*.bluelightcard.co.uk',
        'https://*.bluelightcard.com.au',
        'https://*.defencediscountservice.co.uk',
      ],
      brazeVaultRedemptionVaultCampaignId:
        getEnvRaw(RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID) ?? '',
      brazeApiUrl: getEnvRaw(RedemptionsStackEnvironmentKeys.BRAZE_API_URL) ?? '',
    };
  }

  public static forStagingStage(): RedemptionsStackConfig {
    return {
      redemptionsLambdaScriptsSecretManager: 'blc-mono-redemptions/NewVaultSecrets',
      redemptionsLambdaScriptsEnvironment: 'staging',
      redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
      redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
      redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
      apiDefaultAllowedOrigins: [
        'https://*.blc-uk.pages.dev',
        'https://*.blc-au.pages.dev',
        'https://*.dds-uk.pages.dev',
        'http://localhost:*',
      ],
      brazeVaultRedemptionVaultCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
      brazeApiUrl: 'https://rest.fra-02.braze.eu',
    };
  }

  public static forPrStage(): RedemptionsStackConfig {
    return {
      redemptionsLambdaScriptsSecretManager: 'blc-mono-redemptions/NewVaultSecrets',
      redemptionsLambdaScriptsEnvironment: 'develop',
      redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
      redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
      redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
      apiDefaultAllowedOrigins: [
        'https://*.blc-uk.pages.dev',
        'https://*.blc-au.pages.dev',
        'https://*.dds-uk.pages.dev',
        'http://localhost:*',
      ],
      brazeVaultRedemptionVaultCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
      brazeApiUrl: 'https://rest.fra-02.braze.eu',
    };
  }

  public static fromEnvironmentVariables(): RedemptionsStackConfig {
    return {
      redemptionsLambdaScriptsSecretManager: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER,
      ),
      redemptionsLambdaScriptsEnvironment: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT,
      ),
      redemptionsLambdaScriptsHost: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST),
      redemptionsLambdaScriptsRetrieveAllVaultsPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH,
      ),
      redemptionsLambdaScriptsCodeRedeemedPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH,
      ),
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH,
      ),
      redemptionsLambdaScriptsCodeAmountIssuedPath: getEnv(
        RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH,
      ),
      apiDefaultAllowedOrigins: ['*'],
      brazeVaultRedemptionVaultCampaignId: getEnv(
        RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID,
      ),
      brazeApiUrl: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_API_URL),
    };
  }
}
