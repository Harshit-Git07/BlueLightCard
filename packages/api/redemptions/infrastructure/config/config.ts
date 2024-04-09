import { Stack } from 'sst/constructs';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvRaw, getEnvValidated } from '@blc-mono/core/utils/getEnv';

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
      redemptionsLambdaScriptsSecretName: 'blc-mono-redemptions/NewVaultSecrets',
      redemptionsLambdaScriptsEnvironment: 'production',
      redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
      redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
      redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
      apiDefaultAllowedOrigins: [
        'https://www.bluelightcard.co.uk',
        'https://www.bluelightcard.com.au',
        'https://www.defencediscountservice.co.uk',
      ],
      brazeVaultRedemptionVaultCampaignId:
        getEnvRaw(RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID) ?? '',
      brazeApiUrl: getEnvRaw(RedemptionsStackEnvironmentKeys.BRAZE_API_URL) ?? '',
    };
  }

  public static forStagingStage(): RedemptionsStackConfig {
    return {
      redemptionsLambdaScriptsSecretName: 'blc-mono-redemptions/NewVaultSecrets',
      // TODO: Temporary until we have vaults for staging
      redemptionsLambdaScriptsEnvironment: 'develop',
      redemptionsLambdaScriptsHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      redemptionsLambdaScriptsRetrieveAllVaultsPath: 'NewVault/retrieveAllVaults',
      redemptionsLambdaScriptsCodeRedeemedPath: 'NewVault/codesRedeemed',
      redemptionsLambdaScriptsAssignUserCodesRedeemedPath: 'NewVault/assignUserCodes',
      redemptionsLambdaScriptsCodeAmountIssuedPath: 'NewVault/amountIssued',
      apiDefaultAllowedOrigins: [
        // TODO: Configure origins for DDS and BLC AU
        'https://www.staging.bluelightcard.co.uk',
        'http://localhost:3000',
      ],
      brazeVaultRedemptionVaultCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
      brazeApiUrl: 'https://rest.fra-02.braze.eu',
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
      apiDefaultAllowedOrigins: ['*'],
      brazeVaultRedemptionVaultCampaignId: 'e9c16843-2f74-a0d4-f63d-82610b0cc3a4',
      brazeApiUrl: 'https://rest.fra-02.braze.eu',
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
      apiDefaultAllowedOrigins: getEnvValidated(
        RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
        JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
      ),
      brazeVaultRedemptionVaultCampaignId: getEnv(
        RedemptionsStackEnvironmentKeys.BRAZE_VAULT_REDEMPTION_VAULT_CAMPAIGN_ID,
      ),
      brazeApiUrl: getEnv(RedemptionsStackEnvironmentKeys.BRAZE_API_URL),
    };
  }
}
