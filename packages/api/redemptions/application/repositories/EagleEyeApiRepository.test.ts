import nock from 'nock';

import { Brand } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { as } from '@blc-mono/core/utils/testing';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { EagleEyeApiConfigSuccess, EagleEyeApiRepository } from './EagleEyeApiRepository';

const logger = createTestLogger();
const mockSecretsManager: Partial<ISecretsManager> = {};

jest.mock('@blc-mono/core/utils/checkBrand');
const mockGetBrandFromEnv = jest.mocked(getBrandFromEnv);

jest.mock('@blc-mono/core/utils/getEnv');
const mockGetEnv = getEnv as jest.Mock;

const eagleEyeApiRepository = new EagleEyeApiRepository(logger, as(mockSecretsManager));

const eagleEyeJsonResponse = {
  accountId: 27972831719,
  accountStatus: 'ACTIVE',
  accountTypeId: 1,
  accountTransactionId: '40845236730',
  accountType: 'COUPON',
  accountSubType: 'ECOUPON',
  balances: {
    available: 0,
    refundable: 0,
  },
  issuerId: 24108,
  resourceId: 62577,
  resourceType: 'CAMPAIGN',
  token: 'BL0680147',
  tokenDates: {
    start: '2024-10-15 10:31:50',
    end: '2030-02-17 23:59:59',
  },
  tokenId: 8681866295,
  tokenStatus: 'ACTIVE',
  consumerId: 77181215,
  overrides: [],
};

const resourceId = 62577;
const memberId = '63728';
const clientId = 'someClientId';
const clientSecret = 'someClientSecret';
const eagleEyeApi = 'https://consumer.uk.eagleeye.com';

beforeEach(() => {
  jest.clearAllMocks();
  nock.cleanAll();
});

describe('getCode', () => {
  it('returns token details from eagle eye api in response', async () => {
    whenGetEagleEyeApiUrlThenReturn('https://consumer.uk.eagleeye.com');

    mockGetBrandFromEnv.mockReturnValue('BLC_UK');

    mockSecretsManager.getSecretValueJson = jest.fn().mockResolvedValue({
      clientId,
      clientSecret,
    });

    const requestBody = {
      resourceType: 'CAMPAIGN',
      resourceId: resourceId,
      consumerIdentifier: {
        reference: `BLC-${memberId}`,
      },
    };

    nock('https://consumer.uk.eagleeye.com')
      .post('/2.0/token/create', requestBody)
      .times(1)
      .reply(200, eagleEyeJsonResponse);

    const actualResult = await eagleEyeApiRepository.getCode(resourceId, memberId);

    const expectedResult: EagleEyeApiConfigSuccess = {
      kind: 'Ok',
      data: {
        code: eagleEyeJsonResponse.token,
        createdAt: new Date(eagleEyeJsonResponse.tokenDates.start),
        expiresAt: new Date(eagleEyeJsonResponse.tokenDates.end),
      },
    };

    expect(actualResult).toEqual(expectedResult);
  });

  it('calls fetch with correct parameters and requestBody', async () => {
    whenGetEagleEyeApiUrlThenReturn(eagleEyeApi);

    mockGetBrandFromEnv.mockReturnValue('BLC_UK');

    mockSecretsManager.getSecretValueJson = jest.fn().mockResolvedValue({
      clientId,
      clientSecret,
    });

    const requestBody = {
      resourceType: 'CAMPAIGN',
      resourceId: resourceId,
      consumerIdentifier: {
        reference: `BLC-${memberId}`,
      },
    };

    const scope = nock(eagleEyeApi)
      .matchHeader('X-EES-AUTH-CLIENT-ID', clientId)
      .matchHeader('X-EES-AUTH-HASH', '5b1a4327673c7325adb3f3632d4acdb498fcf0693964efd17d0fb2c398f4e392')
      .post('/2.0/token/create', requestBody)
      .times(1)
      .reply(200, eagleEyeJsonResponse);

    await eagleEyeApiRepository.getCode(resourceId, memberId);

    scope.done();
  });

  it.each([
    ['blc-mono-redemptions/eagle-eye-api-blc-uk', 'BLC_UK' as const, 'BLC'],
    ['blc-mono-redemptions/eagle-eye-api-blc-au', 'BLC_AU' as const, 'BLC'],
    ['blc-mono-redemptions/eagle-eye-api-dds-uk', 'DDS_UK' as const, 'DDS'],
  ])(
    'calls getSecretValueJson with %s when brand is %s',
    async (secretId: string, brand: Brand, referencePrefix: string) => {
      whenGetEagleEyeApiUrlThenReturn(eagleEyeApi);
      mockGetBrandFromEnv.mockReturnValue(brand);

      mockSecretsManager.getSecretValueJson = jest.fn().mockResolvedValue({
        clientId,
        clientSecret,
      });

      const requestBody = {
        resourceType: 'CAMPAIGN',
        resourceId: resourceId,
        consumerIdentifier: {
          reference: `${referencePrefix}-${memberId}`,
        },
      };

      nock(eagleEyeApi).post('/2.0/token/create', requestBody).times(1).reply(200, eagleEyeJsonResponse);

      await eagleEyeApiRepository.getCode(resourceId, memberId);

      expect(mockSecretsManager.getSecretValueJson).toHaveBeenCalledWith(secretId);
    },
  );

  it('returns error if secrets manager throws error', async () => {
    whenGetEagleEyeApiUrlThenReturn(eagleEyeApi);
    mockGetBrandFromEnv.mockReturnValue('BLC_UK');

    mockSecretsManager.getSecretValueJson = jest.fn().mockRejectedValue(new Error('error'));

    logger.error = jest.fn();

    const result = await eagleEyeApiRepository.getCode(resourceId, memberId);

    expect(result).toEqual({
      kind: 'Error',
      data: {
        message: 'Failed to fetch Eagle Eye API secrets',
      },
    });

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Failed to fetch Eagle Eye API secrets',
    });
  });

  it('returns error if fetch returns 500', async () => {
    whenGetEagleEyeApiUrlThenReturn(eagleEyeApi);
    mockGetBrandFromEnv.mockReturnValue('BLC_UK');

    mockSecretsManager.getSecretValueJson = jest.fn().mockResolvedValue({
      clientId,
      clientSecret,
    });

    const eagleEyeApiResponse = {
      errorCode: 'U',
      errorMessage: 'Unknown Server Error',
    };

    const requestBody = JSON.stringify({
      resourceType: 'CAMPAIGN',
      resourceId: resourceId,
      consumerIdentifier: {
        reference: `BLC-${memberId}`,
      },
    });

    nock(eagleEyeApi).post('/2.0/token/create', requestBody).times(1).reply(500, eagleEyeApiResponse);

    logger.error = jest.fn();

    const result = await eagleEyeApiRepository.getCode(resourceId, memberId);

    expect(result).toEqual({
      kind: 'EagleEyeAPIRequestError',
      data: { message: 'Eagle Eye API request failed - {"errorCode":"U","errorMessage":"Unknown Server Error"}' },
    });

    expect(logger.error).toHaveBeenCalledWith({
      message: `Eagle Eye API request failed`,
      context: {
        response: {
          status: 500,
          data: '{"errorCode":"U","errorMessage":"Unknown Server Error"}',
        },
      },
    });
  });
});
function whenGetEagleEyeApiUrlThenReturn(value: string) {
  mockGetEnv.mockImplementation((key: string) => {
    if (key === RedemptionsStackEnvironmentKeys.EAGLE_EYE_API_URL) return value;
    return 'not-found';
  });
}
