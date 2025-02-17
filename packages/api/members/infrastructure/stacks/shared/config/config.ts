import { Stack } from 'sst/constructs';

import { CORS_ALLOWED_ORIGINS_SCHEMA, JsonStringSchema } from '@blc-mono/core/schemas/common';
import { getEnv, getEnvValidated } from '@blc-mono/core/utils/getEnv';

import { isEphemeral, isPr, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export type MemberStackRegion = 'eu-west-2' | 'ap-southeast-2';

export interface MemberStackConfig {
  apiDefaultAllowedOrigins: string[];
  openSearchDomainEndpoint?: string;
}

export function memberStackConfiguration(stack: Stack): MemberStackConfig {
  const region = stack.region as MemberStackRegion;

  switch (true) {
    case isProduction(stack.stage):
      return forProductionStage(region);
    case isStaging(stack.stage):
      return forStagingStage(region);
    case isPr(stack.stage):
      return forPrStage();
    case isEphemeral(stack.stage):
      return forPrStage();
    default:
      return fromEnvironmentVariables();
  }
}

function forProductionStage(region: MemberStackRegion): MemberStackConfig {
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
function forStagingStage(region: MemberStackRegion): MemberStackConfig {
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

function forPrStage(): MemberStackConfig {
  return {
    apiDefaultAllowedOrigins: ['*'],
    openSearchDomainEndpoint: getOpenSearchDomainEndpoint(),
  };
}

function getOpenSearchDomainEndpoint(): string {
  switch (getBrandFromEnv()) {
    case 'BLC_UK':
      return 'https://vpc-pr-search-m7rbjpwa5lfwirp6m6wnyba674.eu-west-2.es.amazonaws.com';
    case 'BLC_AU':
      return 'https://vpc-pr-aus-search-lr23p7ks6qcz6myx3foywtfbui.ap-southeast-2.es.amazonaws.com';
    case 'DDS_UK':
      return 'https://vpc-pr-dds-search-j2ng55ajjivnpizl4vmlndpvvi.eu-west-2.es.amazonaws.com';
  }
}

function fromEnvironmentVariables(): MemberStackConfig {
  return {
    apiDefaultAllowedOrigins: getEnvValidated(
      MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS,
      JsonStringSchema.pipe(CORS_ALLOWED_ORIGINS_SCHEMA),
    ),
    openSearchDomainEndpoint: getEnv(MemberStackEnvironmentKeys.MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT),
  };
}
