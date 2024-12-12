import { Stack } from 'sst/constructs';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { MemberStackEnvironmentKeys } from '../constants/environment';
import { PR_STAGE_REGEX, PRODUCTION_STAGE, STAGING_STAGE } from '../constants/sst';
import { isEphemeral, isPr, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

export type MemberStackRegion = 'eu-west-2' | 'ap-southeast-2';

export enum MemberStackSearchBrand {
  BLC_UK = '1',
  DDS = '2',
}

export type MemberStackConfig = {
  apiDefaultAllowedOrigins: string[];
  openSearchDomainEndpoint?: string;
};

export class MemberStackConfigResolver {
  public static for(stack: Stack, region: MemberStackRegion): MemberStackConfig {
    switch (true) {
      case isProduction(stack.stage):
        return this.forProductionStage(region);
      case isStaging(stack.stage):
        return this.forStagingStage(region);
      case isPr(stack.stage):
        return this.forPrStage();
      case isEphemeral(stack.stage):
        return this.forPrStage();
      default:
        return this.fromEnvironmentVariables();
    }
  }

  public static forProductionStage(region: MemberStackRegion): MemberStackConfig {
    if (region === 'ap-southeast-2') {
      return {
        apiDefaultAllowedOrigins: ['https://www.bluelightcard.com.au'],
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
          'http://localhost:3000',
          'https://pr-*.blc-aus.pages.dev',
        ],
      };
    }
    return {
      apiDefaultAllowedOrigins: [
        'https://www.staging.bluelightcard.co.uk',
        'https://www.ddsstaging.bluelightcard.tech',
        'http://localhost:3000',
        'https://pr-*.blc-uk.pages.dev',
        'https://pr-*.dds-4j3.pages.dev',
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
      openSearchDomainEndpoint: getEnv(MemberStackEnvironmentKeys.OPENSEARCH_DOMAIN_ENDPOINT),
    };
  }
}
