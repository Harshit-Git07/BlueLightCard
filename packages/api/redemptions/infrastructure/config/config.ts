import { Stack } from 'sst/constructs';

import { getEnv } from '@blc-mono/core/utils/getEnv';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';

export type RedemptionsStackConfig = {
  codesRedeemedEnvironment: string;
  codesRedeemedHost: string;
  codeRedeemedPath: string;
  codeAssignedRedeemedPath: string;
  apiDefaultAllowedOrigins: string[];
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
      codesRedeemedEnvironment: 'production',
      codesRedeemedHost: 'https://b8jvqg28p6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
      apiDefaultAllowedOrigins: [
        'https://*.bluelightcard.co.uk',
        'https://*.bluelightcard.com.au',
        'https://*.defencediscountservice.co.uk',
      ],
    };
  }

  public static forStagingStage(): RedemptionsStackConfig {
    return {
      codesRedeemedEnvironment: 'develop',
      codesRedeemedHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
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
      codesRedeemedEnvironment: 'develop',
      codesRedeemedHost: 'https://bbg71eiza6.execute-api.eu-west-2.amazonaws.com',
      codeRedeemedPath: 'NewVault/codesRedeemed',
      codeAssignedRedeemedPath: 'NewVault/assignUserCodes',
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
      codesRedeemedEnvironment: getEnv(RedemptionsStackEnvironmentKeys.CODES_REDEEMED_ENVIRONMENT),
      codesRedeemedHost: getEnv(RedemptionsStackEnvironmentKeys.CODES_REDEEMED_HOST),
      codeRedeemedPath: getEnv(RedemptionsStackEnvironmentKeys.CODE_REDEEMED_PATH),
      codeAssignedRedeemedPath: getEnv(RedemptionsStackEnvironmentKeys.CODE_ASSIGNED_REDEEMED_PATH),
      apiDefaultAllowedOrigins: ['*'],
    };
  }
}
