import { IdentityStackConfig, IdentityStackConfigResolver } from '../config';
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

    expect(config).toEqual(<IdentityStackConfig>{
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://access.blcshine.io/',
        auth0ExtraIssuer: 'https://access-dds.blcshine.io/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://access.blcshine.io/'
      },
      auth0EventBusConfig: {
        auth0EventBusArn: 'arn:aws:events:eu-west-2::event-source/aws.partner/auth0.com/blc-uk-production-53dea5ab-60b5-4b05-94aa-d9e83d24e915/auth0.logs',
        auth0EventSourcePrefix: 'aws.partner/auth0.com',
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

    expect(config).toEqual(<IdentityStackConfig>{
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://staging-access-au.blcshine.io/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://staging-access-au.blcshine.io/'
      },
      auth0EventBusConfig: {
        auth0EventBusArn: 'arn:aws:events:ap-southeast-2::event-source/aws.partner/auth0.com/blc-au-staging-6e1e2e95-c0d2-4854-b9d3-ed1128b8edfa/auth0.logs',
        auth0EventSourcePrefix: 'aws.partner/auth0.com',
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

    expect(config).toEqual(<IdentityStackConfig>{
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://staging-access.blcshine.io/',
        auth0ExtraIssuer: 'https://staging-access-dds.blcshine.io/',
        auth0TestIssuer: "https://blc-uk-staging.uk.auth0.com/",
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://staging-access.blcshine.io/'
      },
      auth0EventBusConfig: {
        auth0EventBusArn: 'arn:aws:events:eu-west-2::event-source/aws.partner/auth0.com/blc-uk-staging-cf96e736-222f-4756-aedd-b60db97c426c/auth0.logs',
        auth0EventSourcePrefix: 'aws.partner/auth0.com',
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

    expect(config).toEqual(<IdentityStackConfig>{
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://staging-access-dds.blcshine.io/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://staging-access-dds.blcshine.io/'
      },
      auth0EventBusConfig:  {
        "auth0EventBusArn": "arn:aws:events:eu-west-2::event-source/aws.partner/auth0.com/dds-uk-staging-f4a71aa0-572b-48f4-b2e1-4c50ff8860b8/auth0.logs",
        "auth0EventSourcePrefix": "aws.partner/auth0.com",
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
      if (key === IdentityStackEnvironmentKeys.AUTH0_EVENT_BUS_ARN) return 'arn:aws:events::::event-source/aws.partner/auth0.com/custom-dev/auth0.logs';
      return '';
    });

    const config = IdentityStackConfigResolver.for(stack);

    expect(config).toEqual(<IdentityStackConfig>{
      lambdaAuthorizerConfig: {
        auth0Issuer: 'https://custom-env-domain.com/',
        auth0ExtraIssuer: 'https://custom-dds-env-domain.com/',
      },
      graphQlConfig: {
        auth0OidcProvider: 'https://custom-env-domain.com/'
      },
      auth0EventBusConfig:  {
        "auth0EventBusArn": "arn:aws:events::::event-source/aws.partner/auth0.com/custom-dev/auth0.logs",
        "auth0EventSourcePrefix": "aws.partner/auth0.com",
      },
    });
  });
});
