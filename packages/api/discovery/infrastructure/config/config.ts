import { Stack } from 'sst/constructs';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvOrDefault, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { DiscoveryStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';

export type DiscoveryStackRegion = 'eu-west-2' | 'ap-southeast-2';

export enum DiscoveryStackSearchBrand {
  BLC_UK = '1',
  DDS = '2',
}

export type DiscoveryStackConfig = {
  searchLambdaScriptsEnvironment: string;
  searchLambdaScriptsHost: string;
  searchBrand: string;
  searchAuthTokenOverride?: string;
  apiDefaultAllowedOrigins: string[];
};

export class DiscoveryStackConfigResolver {
  public static for(stack: Stack, region: DiscoveryStackRegion): DiscoveryStackConfig {
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

  public static forProductionStage(region: DiscoveryStackRegion): DiscoveryStackConfig {
    if (region === 'ap-southeast-2') {
      return {
        searchLambdaScriptsEnvironment: 'production',
        searchLambdaScriptsHost: 'https://jhf5yn6ap2.execute-api.ap-southeast-2.amazonaws.com',
        searchBrand: DiscoveryStackSearchBrand.BLC_UK,
        apiDefaultAllowedOrigins: ['https://www.bluelightcard.com.au'],
      };
    }
    return {
      searchLambdaScriptsEnvironment: 'production',
      searchLambdaScriptsHost: 'https://x26st9km9b.execute-api.eu-west-2.amazonaws.com',
      searchBrand: DiscoveryStackSearchBrand.BLC_UK,
      apiDefaultAllowedOrigins: [
        'https://www.bluelightcard.co.uk',
        'https://www.bluelightcard.com.au',
        'https://www.defencediscountservice.co.uk',
      ],
    };
  }

  public static forStagingStage(region: DiscoveryStackRegion): DiscoveryStackConfig {
    if (region === 'ap-southeast-2') {
      return {
        searchLambdaScriptsEnvironment: 'develop',
        searchLambdaScriptsHost: 'https://b2w93fcr0g.execute-api.ap-southeast-2.amazonaws.com',
        searchBrand: DiscoveryStackSearchBrand.BLC_UK,
        apiDefaultAllowedOrigins: ['https://www.bluelightcard.com.au', 'http://localhost:3000'],
      };
    }
    return {
      searchLambdaScriptsEnvironment: 'develop',
      searchLambdaScriptsHost: 'https://lcsn8cd6i6.execute-api.eu-west-2.amazonaws.com',
      searchBrand: DiscoveryStackSearchBrand.BLC_UK,
      apiDefaultAllowedOrigins: [
        'https://www.staging.bluelightcard.co.uk',
        'https://www.develop.bluelightcard.com.au',
        'https://www.ddsstaging.bluelightcard.tech',
        'http://localhost:3000',
      ],
    };
  }

  public static forPrStage(): DiscoveryStackConfig {
    return {
      searchLambdaScriptsEnvironment: 'develop',
      searchLambdaScriptsHost: 'https://lcsn8cd6i6.execute-api.eu-west-2.amazonaws.com',
      searchBrand: DiscoveryStackSearchBrand.BLC_UK,
      apiDefaultAllowedOrigins: ['*'],
    };
  }

  public static fromEnvironmentVariables(): DiscoveryStackConfig {
    return {
      searchLambdaScriptsEnvironment: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_LAMBDA_SCRIPTS_ENVIRONMENT),
      searchLambdaScriptsHost: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_LAMBDA_SCRIPTS_HOST),
      searchBrand: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_BRAND),
      searchAuthTokenOverride: getEnvOrDefault(DiscoveryStackEnvironmentKeys.SEARCH_AUTH_TOKEN_OVERRIDE, ''),
      apiDefaultAllowedOrigins: getEnvValidated(
        DiscoveryStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
        JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
      ),
    };
  }
}
