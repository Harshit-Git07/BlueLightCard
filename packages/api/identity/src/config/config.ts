import { Stack } from 'sst/constructs';
import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND } from '@blc-mono/core/constants/common';
import { Brand } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isEphemeral, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from "../utils/identityStackEnvironmentKeys";

// We have to set an extra domain here because DDS and BLC UK have
// only one identity API and therefore only one authorizer
type LambdaAuthorizerConfig = {
  auth0CustomDomain: string;
  auth0ExtraCustomDomain?: string;
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
    if (isStaging(stack.stage)) return this.forStagingStage()[brand];
    if (isEphemeral(stack.stage)) return this.forPrStage()[brand];

    return this.fromEnvironmentVariables();
  }

  public static forProductionStage(): Record<Brand, IdentityStackConfig> {
    return {
      [BLC_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'access.blcshine.io',
          auth0ExtraCustomDomain: 'access-dds.blcshine.io',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://access.blcshine.io/',
        },
      },
      [BLC_AU_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'access-au.blcshine.io',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://access-au.blcshine.io/',
        },
      },
      [DDS_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'access-dds.blcshine.io',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://access-dds.blcshine.io/',
        },
      },
    };
  }

  public static forStagingStage(): Record<Brand, IdentityStackConfig> {
    return {
      [BLC_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'staging-access.blcshine.io',
          auth0ExtraCustomDomain: 'staging-access-dds.blcshine.io',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access.blcshine.io/',
        }
      },
      [BLC_AU_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'staging-access-au.blcshine.io',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access-au.blcshine.io/',
        }
      },
      [DDS_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'staging-access-dds.blcshine.io',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://staging-access-dds.blcshine.io/',
        }
      },
    };
  }

  public static forPrStage(): Record<Brand, IdentityStackConfig> {
    return {
      [BLC_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'dev-access.blcshine.tech',
          auth0ExtraCustomDomain: 'dev-access-dds.blcshine.tech',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://dev-access.blcshine.tech/',
        }
      },
      [BLC_AU_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'dev-access-au.blcshine.tech',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://dev-access-au.blcshine.tech/',
        }
      },
      [DDS_UK_BRAND]: {
        lambdaAuthorizerConfig: {
          auth0CustomDomain: 'dev-access-dds.blcshine.tech',
        },
        graphQlConfig: {
          auth0OidcProvider: 'https://dev-access-dds.blcshine.tech/',
        }
      },
    };
  }

  public static fromEnvironmentVariables(): IdentityStackConfig {
    return {
      lambdaAuthorizerConfig: {
        auth0CustomDomain: getEnv(IdentityStackEnvironmentKeys.AUTH0_CUSTOM_DOMAIN),
        auth0ExtraCustomDomain: getEnv(IdentityStackEnvironmentKeys.AUTH0_EXTRA_CUSTOM_DOMAIN),
      },
      graphQlConfig: {
        auth0OidcProvider: `https://${getEnv(IdentityStackEnvironmentKeys.AUTH0_CUSTOM_DOMAIN)}/`,
      }
    };
  }
}
