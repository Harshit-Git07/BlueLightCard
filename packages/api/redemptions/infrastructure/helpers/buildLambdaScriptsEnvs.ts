import { RedemptionsStackConfig } from '../config/config';
import { RedemptionsStackEnvironmentKeys } from '../constants/environment';

export type LambdaScriptsEnvs = {
  [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]: string;
  [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: string;
  [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH]: string;
  [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH]: string;
  [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]: string;
  [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH]: string;
  [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH]: string;
  [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH]: string;
};

export function buildLambdaScriptsEnvs(config: RedemptionsStackConfig): LambdaScriptsEnvs {
  return {
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]:
      config.lambdaScriptsConfig.redemptionsLambdaScriptsEnvironment,
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]:
      config.lambdaScriptsConfig.redemptionsLambdaScriptsHost,
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH]:
      config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsRetrieveAllVaultsPath,
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH]:
      config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsCodeRedeemedPath,
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]:
      config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsAssignUserCodesRedeemedPath,
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH]:
      config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsCodeAmountIssuedPath,
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH]:
      config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsViewVaultBatchesPath,
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH]:
      config.lambdaScriptsPathsConfig.redemptionsLambdaScriptsCheckVaultStockPath,
  };
}
