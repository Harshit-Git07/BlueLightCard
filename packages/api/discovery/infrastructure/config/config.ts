import { Stack } from 'sst/constructs';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { isBlcAuBrand, isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';
import { isEphemeral, isPr, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { DiscoveryStackEnvironmentKeys } from '../constants/environment';

export type DiscoveryStackRegion = 'eu-west-2' | 'ap-southeast-2';

export enum DiscoveryStackSearchBrand {
  BLC_UK = '1',
  DDS = '2',
}

export type DiscoveryStackConfig = {
  apiDefaultAllowedOrigins: string[];
  openSearchDomainEndpoint?: string;
  searchOfferCompanyTable?: string;
};

export class DiscoveryStackConfigResolver {
  public static for(stack: Stack, region: DiscoveryStackRegion): DiscoveryStackConfig {
    switch (true) {
      case isProduction(stack.stage):
        return this.forProductionStage(region);
      case isStaging(stack.stage):
        return this.forStagingStage(region);
      case isPr(stack.stage):
        return this.forPrAccount();
      case isEphemeral(stack.stage):
        return this.forPrStage();
      default:
        return this.fromEnvironmentVariables();
    }
  }

  public static forProductionStage(region: DiscoveryStackRegion): DiscoveryStackConfig {
    if (region === 'ap-southeast-2') {
      return {
        apiDefaultAllowedOrigins: ['https://www.bluelightcard.com.au'],
      };
    }
    return {
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
        apiDefaultAllowedOrigins: ['https://www.bluelightcard.com.au', 'http://localhost:3000'],
      };
    }
    return {
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
      apiDefaultAllowedOrigins: ['*'],
      openSearchDomainEndpoint: this.getOpenSearchDomainEndpoint(),
    };
  }

  public static forPrAccount(): DiscoveryStackConfig {
    return {
      apiDefaultAllowedOrigins: ['*'],
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

  public static fromEnvironmentVariables(): DiscoveryStackConfig {
    return {
      apiDefaultAllowedOrigins: getEnvValidated(
        DiscoveryStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
        JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
      ),
      openSearchDomainEndpoint: getEnv(DiscoveryStackEnvironmentKeys.OPENSEARCH_DOMAIN_ENDPOINT),
      searchOfferCompanyTable: getEnv(DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME),
    };
  }
}
