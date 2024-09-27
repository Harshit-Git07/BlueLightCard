import { Stack } from 'sst/constructs';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvOrDefault, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { MemberStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';

export type MemberStackRegion = 'eu-west-2' | 'ap-southeast-2';

export enum MemberStackSearchBrand {
  BLC_UK = '1',
  DDS = '2',
}

export type MemberStackConfig = {
  apiDefaultAllowedOrigins: string[];
};

export class MemberStackConfigResolver {
  public static for(stack: Stack, region: MemberStackRegion): MemberStackConfig {
    switch (true) {
      case PRODUCTION_STAGE === stack.stage:
        return this.forProductionStage(region);
      case STAGING_STAGE === stack.stage:
        return this.forStagingStage(region);
      case PR_STAGE_REGEX.test(stack.stage):
        return this.forPrStage();
      default:
        return this.fromEnvironmentVariables();
    }
  }

  public static forProductionStage(region: MemberStackRegion): MemberStackConfig {
    if (region === 'ap-southeast-2') {
      return {
        apiDefaultAllowedOrigins: [
          'https://www.bluelightcard.com.au'
        ],
      };
    }
    return {
      apiDefaultAllowedOrigins: [
        'https://www.bluelightcard.co.uk',
        'https://www.defencediscountservice.co.uk',
      ],
    };
  }

  public static forStagingStage(region: MemberStackRegion): MemberStackConfig {
    if (region === 'ap-southeast-2') {
      return {
        apiDefaultAllowedOrigins: [
          'https://www.develop.bluelightcard.com.au',
          'http://localhost:3000'
        ],
      };
    }
    return {
      apiDefaultAllowedOrigins: [
        'https://www.staging.bluelightcard.co.uk',
        'https://www.ddsstaging.bluelightcard.tech',
        'http://localhost:3000',
      ],
    };
  }

  public static forPrStage(): MemberStackConfig {
    return {
      apiDefaultAllowedOrigins: ['*'],
    };
  }

  public static fromEnvironmentVariables(): MemberStackConfig {
    return {
      apiDefaultAllowedOrigins: getEnvValidated(
        MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
        JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
      ),
    };
  }
}
