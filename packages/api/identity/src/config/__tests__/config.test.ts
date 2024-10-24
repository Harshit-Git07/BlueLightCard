import { IdentityStackConfigResolver } from '../config';
import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isEphemeral, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { Stack } from 'sst/constructs';
import { IdentityStackEnvironmentKeys } from "../../utils/identityStackEnvironmentKeys";

jest.mock('@blc-mono/core/utils/checkBrand');
jest.mock('@blc-mono/core/utils/checkEnvironment');
jest.mock('@blc-mono/core/utils/getEnv');

describe('IdentityStackConfigResolver', () => {
  const stack = { stage: 'test-stage' } as Stack;
  const getBrandFromEnvMock = jest.mocked(getBrandFromEnv);
  const isProductionMock = jest.mocked(isProduction);
  const isStagingMock = jest.mocked(isStaging);
  const isEphemeralMock = jest.mocked(isEphemeral);
  const getEnvMock = jest.mocked(getEnv);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return production config for BLC_UK_BRAND', () => {
    getBrandFromEnvMock.mockReturnValue(BLC_UK_BRAND);
    isProductionMock.mockReturnValue(true);
    isStagingMock.mockReturnValue(false);
    isEphemeralMock.mockReturnValue(false);

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0CustomDomain: 'access.blcshine.io',
        auth0ExtraCustomDomain: 'access-dds.blcshine.io',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://access.blcshine.io/'
      },
    });
  });

  it('should return staging config for BLC_AU_BRAND', () => {
    getBrandFromEnvMock.mockReturnValue(BLC_AU_BRAND);
    isProductionMock.mockReturnValue(false);
    isStagingMock.mockReturnValue(true);
    isEphemeralMock.mockReturnValue(false);

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0CustomDomain: 'staging-access-au.blcshine.io',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://staging-access-au.blcshine.io/'
      },
    });
  });

  it('should return ephemeral config for DDS_UK_BRAND', () => {
    getBrandFromEnvMock.mockReturnValue(DDS_UK_BRAND);
    isProductionMock.mockReturnValue(false);
    isStagingMock.mockReturnValue(false);
    isEphemeralMock.mockReturnValue(true);

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0CustomDomain: 'dev-access-dds.blcshine.tech',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://dev-access-dds.blcshine.tech/'
      },
    });
  });

  it('should return config from environment variables if stage is not production, staging, or ephemeral', () => {
    getBrandFromEnvMock.mockReturnValue(BLC_UK_BRAND);
    isProductionMock.mockReturnValue(false);
    isStagingMock.mockReturnValue(false);
    isEphemeralMock.mockReturnValue(false);
    getEnvMock.mockImplementation((key: string) => {
      if (key === IdentityStackEnvironmentKeys.AUTH0_CUSTOM_DOMAIN) return 'custom-env-domain.com';
      if (key === IdentityStackEnvironmentKeys.AUTH0_EXTRA_CUSTOM_DOMAIN) return 'custom-dds-env-domain.com';
      return '';
    });

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0CustomDomain: 'custom-env-domain.com',
        auth0ExtraCustomDomain: 'custom-dds-env-domain.com',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://custom-env-domain.com/'
      },
    });
  });
});
