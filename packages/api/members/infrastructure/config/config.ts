import { Stack } from 'sst/constructs';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { MemberStackEnvironmentKeys } from '../constants/environment';
import { isEphemeral, isPr, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { isBlcAuBrand, isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';

export type MemberStackRegion = 'eu-west-2' | 'ap-southeast-2';

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

  // TODO: Remove this disable if the commented out block (at the time of writing) is uncommented or changed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static forStagingStage(region: MemberStackRegion): MemberStackConfig {
    return {
      apiDefaultAllowedOrigins: ['*'],
    };

    // Temporary CORS configuration for staging until we release API proxy updates
    // if (region === 'ap-southeast-2') {
    //   return {
    //     apiDefaultAllowedOrigins: [
    //       'https://www.develop.bluelightcard.com.au',
    //       'http://localhost:3000',
    //     ],
    //   };
    // }
    // return {
    //   apiDefaultAllowedOrigins: [
    //     'https://www.staging.bluelightcard.co.uk',
    //     'https://www.ddsstaging.bluelightcard.tech',
    //     'http://localhost:3000',
    //   ],
    // };
  }

  public static forPrStage(): MemberStackConfig {
    return {
      apiDefaultAllowedOrigins: ['*'],
      openSearchDomainEndpoint: this.getOpenSearchDomainEndpoint(),
    };
  }

  public static fromEnvironmentVariables(): MemberStackConfig {
    return {
      apiDefaultAllowedOrigins: getEnvValidated(
        MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
        JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
      ),
      openSearchDomainEndpoint: getEnv(
        MemberStackEnvironmentKeys.MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT,
      ),
    };
  }

  private static getOpenSearchDomainEndpoint(): string {
    if (isDdsUkBrand()) {
      return 'https://vpc-pr-dds-search-j2ng55ajjivnpizl4vmlndpvvi.eu-west-2.es.amazonaws.com';
    }
    if (isBlcAuBrand()) {
      return 'https://vpc-pr-aus-search-lr23p7ks6qcz6myx3foywtfbui.ap-southeast-2.es.amazonaws.com';
    }
    return 'https://vpc-pr-search-m7rbjpwa5lfwirp6m6wnyba674.eu-west-2.es.amazonaws.com';
  }
}
