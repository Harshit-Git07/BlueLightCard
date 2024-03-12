import { Stack } from 'sst/constructs';

import { getEnv } from '@blc-mono/core/utils/getEnv';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';

export type RedemptionsStackConfig = {
  codesRedeemedEnvironment: string;
  codesRedeemedHost: string;
  codeRedeemedPath: string;
  codeAssignedRedeemedPath: string;
  codeAmountIssuedPath: string;
  apiDefaultAllowedOrigins: string[];
  vaultRedeemHost: string;
  vaultRedeemPath: string;
  vaultRedeemEnvironment: string;
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
      vaultRedeemEnvironment: 'production',
      vaultRedeemHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      vaultRedeemPath: 'NewVault/retrieveAllVaults',
      codesRedeemedEnvironment: 'production',
      codesRedeemedHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
      codeAmountIssuedPath: 'NewVault/amountIssued',
      apiDefaultAllowedOrigins: [
        'https://*.bluelightcard.co.uk',
        'https://*.bluelightcard.com.au',
        'https://*.defencediscountservice.co.uk',
      ],
    };
  }

  public static forStagingStage(): RedemptionsStackConfig {
    return {
      vaultRedeemEnvironment: 'staging',
      vaultRedeemHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      vaultRedeemPath: 'NewVault/retrieveAllVaults',
      codesRedeemedEnvironment: 'develop',
      codesRedeemedHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
      codeAmountIssuedPath: 'NewVault/amountIssued',
      apiDefaultAllowedOrigins: [
        'https://*.blc-uk.pages.dev',
        'https://*.blc-au.pages.dev',
        'https://*.dds-uk.pages.dev',
        'http://localhost:*',
      ],
    };
  }

  public static forPrStage(): RedemptionsStackConfig {
    return {
      vaultRedeemEnvironment: 'develop',
      vaultRedeemHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      vaultRedeemPath: 'NewVault/retrieveAllVaults',
      codesRedeemedEnvironment: 'develop',
      codesRedeemedHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
      codeAmountIssuedPath: 'NewVault/amountIssued',
      apiDefaultAllowedOrigins: [
        'https://*.blc-uk.pages.dev',
        'https://*.blc-au.pages.dev',
        'https://*.dds-uk.pages.dev',
        'http://localhost:*',
      ],
    };
  }

  public static fromEnvironmentVariables(): RedemptionsStackConfig {
    return {
      vaultRedeemEnvironment: getEnv(RedemptionsStackEnvironmentKeys.VAULT_REDEEM_ENVIRONMENT),
      vaultRedeemHost: getEnv(RedemptionsStackEnvironmentKeys.VAULT_REDEEM_HOST),
      vaultRedeemPath: getEnv(RedemptionsStackEnvironmentKeys.VAULT_REDEEM_PATH),
      codesRedeemedEnvironment: getEnv(RedemptionsStackEnvironmentKeys.CODES_REDEEMED_ENVIRONMENT),
      codesRedeemedHost: getEnv(RedemptionsStackEnvironmentKeys.CODES_REDEEMED_HOST),
      codeRedeemedPath: getEnv(RedemptionsStackEnvironmentKeys.CODE_REDEEMED_PATH),
      codeAssignedRedeemedPath: getEnv(RedemptionsStackEnvironmentKeys.CODE_ASSIGNED_REDEEMED_PATH),
      codeAmountIssuedPath: getEnv(RedemptionsStackEnvironmentKeys.CODE_AMOUNT_ISSUED_PATH),
      apiDefaultAllowedOrigins: ['*'],
    };
  }
}
