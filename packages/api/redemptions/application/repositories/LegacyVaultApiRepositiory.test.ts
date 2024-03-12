import { faker } from '@faker-js/faker';
import { mocked } from 'jest-mock';

import { httpRequest } from '@blc-mono/core/utils/fetch/httpRequest';
import {
  LegacyVaultApiRepository,
  vaultSecrets,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { promotionUpdatedEvenWithOutMetaFactory } from '@blc-mono/redemptions/application/test/factories/promotionsEvents.factory';
import { createTestLogger } from '@blc-mono/redemptions/application/test/helpers/logger';
import { SecretsManger } from '@blc-mono/redemptions/libs/SecretsManger/SecretsManger';

jest.mock('@blc-mono/core/utils/fetch/httpRequest');

describe('PromotionUpdateRepository', () => {
  beforeEach(() => {
    process.env.REDEMPTIONS_RETRIEVE_ALL_VAULTS_HOST = 'https://test.com';
    process.env.REDEMPTIONS_RETRIEVE_ALL_VAULTS_PATH = '/test';
    process.env.REDEMPTIONS_RETRIEVE_ALL_ENVIRONMENT = 'test';
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.REDEMPTIONS_RETRIEVE_ALL_VAULTS_HOST;
    delete process.env.REDEMPTIONS_RETRIEVE_ALL_VAULTS_PATH;
    delete process.env.REDEMPTIONS_RETRIEVE_ALL_ENVIRONMENT;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should return all of the affected vaults by the linkId', async () => {
    const linkId = faker.number.int(4);
    const brand = 'test';
    const logger = createTestLogger();

    const mockedSecretsManger = {
      getSecretValue: jest.fn().mockReturnValue({
        retrieveAllVaultsData: 'NewVault/retrieveAllVaults',
        retrieveAllVaultsPassword: 'sjDpKVBt^FxCzq8y',
      }),
    } as unknown as SecretsManger<vaultSecrets>;

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

    const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);
    const response = await repository.getVaultByLinkId(linkId, brand);
    expect(response).toEqual(expectedResponse);
  });

  test('should return empty array if no vaults were found', async () => {
    const linkId = faker.number.int(4);
    const brand = 'test';
    const logger = createTestLogger();

    const mockedSecretsManger = {
      getSecretValue: jest.fn().mockReturnValue({
        retrieveAllVaultsData: 'NewVault/retrieveAllVaults',
        retrieveAllVaultsPassword: 'sjDpKVBt^FxCzq8y',
      }),
    } as unknown as SecretsManger<vaultSecrets>;

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

    const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);
    const response = await repository.getVaultByLinkId(linkId, brand);
    expect(response).toEqual(expectedResponse);
  });
});
