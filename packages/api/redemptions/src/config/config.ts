import { Stack } from 'sst/constructs';

import { getEnv } from '@blc-mono/core/utils/getEnv';

import { EnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';

export type RedemptionsConfig = {
  codesRedeemedEnvironment: string;
  codesRedeemedHost: string;
  codeRedeemedPath: string;
  codeAssignedRedeemedPath: string;
};

export class RedemptionsConfigResolver {
  public static for(stack: Stack): RedemptionsConfig {
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

  public static forProductionStage(): RedemptionsConfig {
    return {
      codesRedeemedEnvironment: 'production',
      codesRedeemedHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
    };
  }

  public static forStagingStage(): RedemptionsConfig {
    return {
      codesRedeemedEnvironment: 'develop',
      codesRedeemedHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
    };
  }

  public static forPrStage(): RedemptionsConfig {
    return {
      codesRedeemedEnvironment: 'develop',
      codesRedeemedHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
    };
  }

  public static fromEnvironmentVariables(): RedemptionsConfig {
    return {
      codesRedeemedEnvironment: getEnv(EnvironmentKeys.CODES_REDEEMED_ENVIRONMENT),
      codesRedeemedHost: getEnv(EnvironmentKeys.CODES_REDEEMED_HOST),
      codeRedeemedPath: getEnv(EnvironmentKeys.CODE_REDEEMED_PATH),
      codeAssignedRedeemedPath: getEnv(EnvironmentKeys.CODE_ASSIGNED_REDEEMED_PATH),
    };
  }
}
