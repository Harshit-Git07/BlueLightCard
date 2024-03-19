import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import { httpRequest, RequestResponse } from '@blc-mono/core/utils/fetch/httpRequest';
import {
  LegacyVaultApiRepository,
  Secrets,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { promotionUpdatedEvenWithOutMetaFactory } from '@blc-mono/redemptions/application/test/factories/promotionsEvents.factory';
import { createTestLogger } from '@blc-mono/redemptions/application/test/helpers/logger';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

jest.mock('@blc-mono/core/utils/fetch/httpRequest');

describe('LegacyVaultApiRepository', () => {
  const mockedSecretsManager = {
    getSecretValue: jest.fn().mockResolvedValue({
      codeRedeemedData: 'NewVault/test',
      codeRedeemedPassword: 'sjDeKVBt^BxFzq8y',
      checkAmountIssuedData: 'NewVault/test',
      checkAmountIssuedPassword: 'sjDeKVBt^BxFzq8y',
      assignUserCodesData: 'NewVault/test',
      assignUserCodesPassword: 'sjDeKVBt^BxFzq8y',
      retrieveAllVaultsData: 'NewVault/test',
      retrieveAllVaultsPassword: 'sjDeKVBt^BxFzq8y',
    }),
  } as unknown as SecretsManager<Secrets>;

  beforeEach(() => {
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_HOST = 'https://test.com';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT = 'test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER = 'test';
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_HOST;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('getVaultByLinkId', () => {
    test('should return all of the affected vaults by the linkId', async () => {
      const linkId = faker.number.int(4);
      const brand = 'test';
      const logger = createTestLogger();

      const event = promotionUpdatedEvenWithOutMetaFactory.build({
        detail: {
          platform: 'BLC_UK',
        },
      });

      mocked(httpRequest).mockImplementation(() => {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            data: [
              {
                terms: 'test',
                companyId: event.detail.companyId,
                companyName: '',
                offerId: 1234,
                brand: 'BLC_UK',
                createdAt: '2021-08-10T14:00:00.000Z',
                managerId: 1234,
                alertBelow: 100,
                showQR: 1,
                vaultStatus: true,
                sk: 'test',
                linkId,
                maxPerUser: 1,
                id: 'test',
              },
            ],
          },
        });
      });

      const expectedResponse = {
        dependentEntities: [
          {
            offerId: 1234,
            companyId: event.detail.companyId,
            type: 'vault',
          },
        ],
      };

      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManager);
      const response = await repository.getVaultByLinkId(linkId, brand);
      expect(response).toEqual(expectedResponse);
    });

    test('should return empty array if no vaults were found', async () => {
      const linkId = faker.number.int(4);
      const brand = 'test';
      const logger = createTestLogger();

      const event = promotionUpdatedEvenWithOutMetaFactory.build({
        detail: {
          platform: 'BLC_UK',
        },
      });

      mocked(httpRequest).mockImplementation(() => {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            data: [
              {
                terms: 'test',
                companyId: event.detail.companyId,
                companyName: '',
                offerId: 1234,
                brand: 'BLC_UK',
                createdAt: '2021-08-10T14:00:00.000Z',
                managerId: 1234,
                alertBelow: 100,
                showQR: 1,
                vaultStatus: true,
                sk: 'test',
                linkId: event.detail.id,
                maxPerUser: 1,
                id: 'test',
              },
            ],
          },
        });
      });

      const mockedData = {
        success: true,
        data: [],
      };
      const expectedResponse = {
        dependentEntities: [],
      };

      mocked(httpRequest).mockImplementation(() =>
        Promise.resolve({
          status: 200,
          data: mockedData,
        }),
      );

      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManager);
      const response = await repository.getVaultByLinkId(linkId, brand);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('getNumberOfCodesIssued', () => {
    async function callGetNumberOfCodesIssued(
      memberId: string,
      companyId: number,
      offerId: number,
      secretManager?: SecretsManager<Secrets>,
    ) {
      const logger = createTestLogger();

      const repository = new LegacyVaultApiRepository(logger, secretManager ?? mockedSecretsManager);
      return repository.getNumberOfCodesIssued(memberId, companyId, offerId);
    }

    it('Should return undefined if secrets are invalid', async () => {
      // Arrange
      const mockedSecretsManager = {
        getSecretValue: jest.fn().mockReturnValue({}),
      } as unknown as SecretsManager<Secrets>;

      // Act
      const result = await callGetNumberOfCodesIssued('1234', 1, 1, mockedSecretsManager);

      // Assert
      expect(result).toBeUndefined();
    });

    it('Should return response from the API', async () => {
      // Arrange
      const memberId = '1234';
      const companyId = 1;
      const offerId = 1;
      const expectedResponse = 1;

      mocked(httpRequest).mockImplementation(() => {
        return Promise.resolve({
          status: 200,
          data: expectedResponse,
        });
      });

      // Act
      const result = await callGetNumberOfCodesIssued(memberId, companyId, offerId);

      // Assert
      expect(result?.data).toEqual(expectedResponse);
      expect(result?.status).toEqual(200);
    });
  });

  describe('assignUserCodes', () => {
    async function callAssignUserCodes(
      memberId: string,
      companyId: number,
      offerId: number,
      secretManager?: SecretsManager<Secrets>,
    ) {
      const logger = createTestLogger();

      const repository = new LegacyVaultApiRepository(logger, secretManager ?? mockedSecretsManager);
      return repository.assignCodeToMember(memberId, companyId, offerId);
    }

    it('Should return undefined if secrets are invalid', async () => {
      // Arrange
      const mockedSecretsManager = {
        getSecretValue: jest.fn().mockReturnValue({}),
      } as unknown as SecretsManager<Secrets>;

      // Act
      const result = await callAssignUserCodes('1234', 1, 1, mockedSecretsManager);

      // Assert
      expect(result).toBeUndefined();
    });

    it('Should return response from the API', async () => {
      // Arrange
      const memberId = '1234';
      const companyId = 1;
      const offerId = 1;
      const expectedResponse = 1;

      mocked(httpRequest).mockImplementation(() => {
        return Promise.resolve({
          status: 200,
          data: expectedResponse,
        });
      });

      // Act
      const result = await callAssignUserCodes(memberId, companyId, offerId);

      // Assert
      expect(result?.data).toEqual(expectedResponse);
      expect(result?.status).toEqual(200);
    });
  });

  describe('redeemCode', () => {
    async function callRedeemCode(
      platform: string,
      companyId: number,
      offerId: number,
      memberId: string,
      secretManager?: SecretsManager<Secrets>,
    ) {
      const logger = createTestLogger();

      const repository = new LegacyVaultApiRepository(logger, secretManager ?? mockedSecretsManager);
      return repository.redeemCode(platform, companyId, offerId, memberId);
    }

    it('Should return undefined if secrets are invalid', async () => {
      // Arrange
      const mockedSecretsManager = {
        getSecretValue: jest.fn().mockReturnValue({}),
      } as unknown as SecretsManager<Secrets>;

      // Act
      const result = await callRedeemCode('1234', 1, 1, '1234', mockedSecretsManager);

      // Assert
      expect(result).toBeUndefined();
    });

    it('Should return response from the API', async () => {
      // Arrange
      const platform = 'BLC_UK';
      const memberId = '1234';
      const companyId = 1;
      const offerId = 1;
      const expectedResponse = 1;

      mocked(httpRequest).mockImplementation(() => {
        return Promise.resolve({
          status: 200,
          data: expectedResponse,
        });
      });

      // Act
      const result = await callRedeemCode(platform, companyId, offerId, memberId);

      // Assert
      expect(result?.data).toEqual(expectedResponse);
      expect(result?.status).toEqual(200);
    });
  });

  describe('getResponseData', () => {
    function callGetResponseData(response: RequestResponse) {
      const repository = new LegacyVaultApiRepository(createTestLogger(), mockedSecretsManager);
      const url = 'https://test.com';
      return repository.getResponseData(response, url);
    }

    it('Should return undefined when response is invalid', () => {
      // Arrange
      const response = {
        status: 200,
        data: undefined,
      };

      // Act
      const result = callGetResponseData(response);

      // Assert
      expect(result).toBeUndefined();
    });

    it('Should return response data', () => {
      // Arrange
      const desiredCode = 'test1';
      const desiredCodes = [
        {
          code: 'test1',
        },
        {
          code: 'test2',
        },
      ];
      const desiredTrackingUrl = 'https://test.com';
      const response = {
        status: 200,
        data: {
          data: desiredCodes,
        },
      };

      // Act
      const result = callGetResponseData(response);

      // Assert
      expect(result?.code).toEqual(desiredCode);
      expect(result?.codes).toEqual(desiredCodes);
      expect(result?.trackingUrl).toEqual(desiredTrackingUrl);
    });
  });
});
