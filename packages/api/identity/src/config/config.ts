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
};

type GraphQlConfig = {
  auth0OidcProvider: string;
};

export type IdentityStackConfig = {
  lambdaAuthorizerConfig: LambdaAuthorizerConfig;
  graphQlConfig: GraphQlConfig;
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
      },
      [BLC_AU_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://access-au.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://access-au.blcshine.io/',
        },
      },
      [DDS_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://access-dds.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://access-dds.blcshine.io/',
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
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access.blcshine.io/',
        }
      },
      [BLC_AU_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://staging-access-au.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access-au.blcshine.io/',
        }
      },
      [DDS_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0Issuer: 'https://staging-access-dds.blcshine.io/',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access-dds.blcshine.io/',
        }
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
      }
    };
  }
}
