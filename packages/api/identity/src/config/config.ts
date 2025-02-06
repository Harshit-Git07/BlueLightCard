import { Stack } from 'sst/constructs';
import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND } from '@blc-mono/core/constants/common';
import { Brand } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isDevelopment, isEphemeral, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from "../utils/identityStackEnvironmentKeys";

// We have to set an extra domain here because DDS and BLC UK have
// only one identity API and therefore only one authorizer
type LambdaAuthorizerConfig = {
  auth0Issuer: string;
  auth0ExtraIssuer?: string;
  auth0TestIssuer?: string;
};

type GraphQlConfig = {
  auth0OidcProvider: string;
};

type Auth0EventBusConfig = {
  auth0EventBusArn: string;
  auth0EventSourcePrefix: string;
};

export type IdentityStackConfig = {
  lambdaAuthorizerConfig: LambdaAuthorizerConfig;
  graphQlConfig: GraphQlConfig;
  auth0EventBusConfig: Auth0EventBusConfig;
};

export class IdentityStackConfigResolver {
  public static for(stack: Stack): IdentityStackConfig {
    const brand = getBrandFromEnv();

    if (isProduction(stack.stage)) return this.forProductionStage()[brand];
    if (this.isNonProductionStage(stack.stage)) return this.forNonProdStage()[brand];

    return this.fromEnvironmentVariables();
  }

  private static isNonProductionStage(stage: string): boolean {
    return isStaging(stage) || isEphemeral(stage) || isDevelopment(stage);
  }

  public static forProductionStage(): Record<Brand, IdentityStackConfig> {
    return {
      [BLC_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://access.blcshine.io/',
          auth0ExtraIssuer: 'https://access-dds.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://access.blcshine.io/',
        },
        auth0EventBusConfig: {
          auth0EventBusArn: 'arn:aws:events:eu-west-2::event-source/aws.partner/auth0.com/blc-uk-production-78006d0a-740a-43f6-a86f-fe998722f4fe/auth0.logs',
          auth0EventSourcePrefix: 'aws.partner/auth0.com',
        },
      },
      [BLC_AU_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://access-au.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://access-au.blcshine.io/',
        },
        auth0EventBusConfig: {
          auth0EventBusArn: 'arn:aws:events:ap-southeast-2::event-source/aws.partner/auth0.com/blc-au-production-39c0ecb7-cd2b-45fe-b756-01dfbbb1b4b0/auth0.logs',
          auth0EventSourcePrefix: 'aws.partner/auth0.com',
        },
      },
      [DDS_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://access-dds.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://access-dds.blcshine.io/',
        },
        auth0EventBusConfig: {
          auth0EventBusArn: 'arn:aws:events:eu-west-2::event-source/aws.partner/auth0.com/dds-uk-production-012a7bcd-7326-494a-aab8-fcaab05c90dc/auth0.logs',
          auth0EventSourcePrefix: 'aws.partner/auth0.com',
        },
      },
    };
  }

  public static forNonProdStage(): Record<Brand, IdentityStackConfig> {
    return {
      [BLC_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://staging-access.blcshine.io/',
          auth0ExtraIssuer: 'https://staging-access-dds.blcshine.io/',
          auth0TestIssuer: 'https://blc-uk-staging.uk.auth0.com/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access.blcshine.io/',
        },
        auth0EventBusConfig: {
          auth0EventBusArn: 'arn:aws:events:eu-west-2::event-source/aws.partner/auth0.com/blc-uk-staging-cf96e736-222f-4756-aedd-b60db97c426c/auth0.logs',
          auth0EventSourcePrefix: 'aws.partner/auth0.com',
        },
      },
      [BLC_AU_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://staging-access-au.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access-au.blcshine.io/',
        },
        auth0EventBusConfig: {
          auth0EventBusArn: 'arn:aws:events:ap-southeast-2::event-source/aws.partner/auth0.com/blc-au-staging-6e1e2e95-c0d2-4854-b9d3-ed1128b8edfa/auth0.logs',
          auth0EventSourcePrefix: 'aws.partner/auth0.com',
        },
      },
      [DDS_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://staging-access-dds.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access-dds.blcshine.io/',
        },
        auth0EventBusConfig: {
          auth0EventBusArn: 'arn:aws:events:eu-west-2::event-source/aws.partner/auth0.com/dds-uk-staging-f4a71aa0-572b-48f4-b2e1-4c50ff8860b8/auth0.logs',
          auth0EventSourcePrefix: 'aws.partner/auth0.com',
        },
      },
    };
  }

  public static fromEnvironmentVariables(): IdentityStackConfig {
    return {
      lambdaAuthorizerConfig: {
        auth0Issuer: getEnv(IdentityStackEnvironmentKeys.AUTH0_ISSUER),
        auth0ExtraIssuer: getEnv(IdentityStackEnvironmentKeys.AUTH0_EXTRA_ISSUER),
      },
      graphQlConfig: {
        auth0OidcProvider: getEnv(IdentityStackEnvironmentKeys.AUTH0_ISSUER),
      },
      auth0EventBusConfig: {
        auth0EventBusArn: getEnv(IdentityStackEnvironmentKeys.AUTH0_EVENT_BUS_ARN),
        auth0EventSourcePrefix: 'aws.partner/auth0.com',
      },
    };
  }
}
