import { IdentityStackConfigResolver } from '../config';
import { BLC_AU_BRAND, BLC_UK_BRAND, DDS_UK_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isDevelopment, isEphemeral, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
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
  const isDevelopmentMock = jest.mocked(isDevelopment);
  const getEnvMock = jest.mocked(getEnv);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return production config for BLC_UK_BRAND', () => {
    getBrandFromEnvMock.mockReturnValue(BLC_UK_BRAND);
    isProductionMock.mockReturnValue(true);
    isStagingMock.mockReturnValue(false);
    isEphemeralMock.mockReturnValue(false);
    isDevelopmentMock.mockReturnValue(false);

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://access.blcshine.io/',
        auth0ExtraIssuer: 'https://access-dds.blcshine.io/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://access.blcshine.io/'
      },
    });
  });

  it('should return non-prod config for staging and BLC_AU_BRAND', () => {
    getBrandFromEnvMock.mockReturnValue(BLC_AU_BRAND);
    isProductionMock.mockReturnValue(false);
    isStagingMock.mockReturnValue(true);
    isEphemeralMock.mockReturnValue(false);
    isDevelopmentMock.mockReturnValue(false);

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://staging-access-au.blcshine.io/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://staging-access-au.blcshine.io/'
      },
    });
  });

  it('should return non-prod config for dev and BLC_UK_BRAND', () => {
    getBrandFromEnvMock.mockReturnValue(BLC_UK_BRAND);
    isProductionMock.mockReturnValue(false);
    isStagingMock.mockReturnValue(false);
    isEphemeralMock.mockReturnValue(false);
    isDevelopmentMock.mockReturnValue(true);

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://staging-access.blcshine.io/',
        auth0ExtraIssuer: 'https://staging-access-dds.blcshine.io/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://staging-access.blcshine.io/'
      },
    });
  });

  it('should return non-prod config for PR environment and DDS_UK_BRAND', () => {
    getBrandFromEnvMock.mockReturnValue(DDS_UK_BRAND);
    isProductionMock.mockReturnValue(false);
    isStagingMock.mockReturnValue(false);
    isEphemeralMock.mockReturnValue(true);
    isDevelopmentMock.mockReturnValue(false);

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://staging-access-dds.blcshine.io/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://staging-access-dds.blcshine.io/'
      },
    });
  });

  it('should return config from environment variables if stage is not production, staging, dev, or ephemeral', () => {
    getBrandFromEnvMock.mockReturnValue(BLC_UK_BRAND);
    isProductionMock.mockReturnValue(false);
    isStagingMock.mockReturnValue(false);
    isEphemeralMock.mockReturnValue(false);
    isDevelopmentMock.mockReturnValue(false);
    getEnvMock.mockImplementation((key: string) => {
      if (key === IdentityStackEnvironmentKeys.AUTH0_ISSUER) return 'https://custom-env-domain.com/';
      if (key === IdentityStackEnvironmentKeys.AUTH0_EXTRA_ISSUER) return 'https://custom-dds-env-domain.com/';
      return '';
    });

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual({
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://custom-env-domain.com/',
        auth0ExtraIssuer: 'https://custom-dds-env-domain.com/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://custom-env-domain.com/'
      },
    });
  });
});
