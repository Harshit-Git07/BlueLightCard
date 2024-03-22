import { faker } from '@faker-js/faker';
import nock from 'nock';

import { LegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { createTestLogger } from '@blc-mono/redemptions/application/test/helpers/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { Platform } from '@blc-mono/redemptions/libs/database/schema';
import { ISecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

import { legacyVaultDataFactory } from '../test/factories/legacyVaultData.factory';

function mockEnv(values: Record<string, string>): {
  set(): void;
  unset(): void;
} {
  const entries = Object.entries(values);
  return {
    set() {
      entries.forEach(([key, value]) => {
        process.env[key] = value;
      });
    },
    unset() {
      entries.forEach(([key]) => {
        delete process.env[key];
      });
    },
  };
}

describe('LegacyVaultApiRepository', () => {
  const mockedEnv = mockEnv({
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: 'https://test.com',
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]: 'test-env',
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH]: 'retrieveAllVaults',
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH]: 'checkAmountIssued',
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]: 'assignUserCodes',
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH]: 'codesRedeemed',
  });

  beforeEach(() => {
    mockedEnv.set();
  });

  afterAll(() => {
    mockedEnv.unset();
  });

  describe('findVaultsRelatingToLinkId', () => {
    test('should return all of the affected vaults', async () => {
      // Arrange
      const linkId = faker.number.int(4);
      const platform: Platform = 'BLC_UK';
      const logger = createTestLogger();
      const mockedSecretsManger = {
        getSecretValueJson: jest.fn().mockReturnValue({
          codeRedeemedData: 'dummy',
          codeRedeemedPassword: 'dummy',
          assignUserCodesData: 'dummy',
          assignUserCodesPassword: 'dummy',
          checkAmountIssuedData: 'dummy',
          checkAmountIssuedPassword: 'dummy',
          retrieveAllVaultsData: 'NewVault/retrieveAllVaults',
          retrieveAllVaultsPassword: 'sjDpKVBt^FxCzq8y',
        }),
      } satisfies ISecretsManager;
      const legacyVaults = [legacyVaultDataFactory.build({ linkId }), legacyVaultDataFactory.build({ linkId })];
      nock('https://test.com').get('/test-env/retrieveAllVaults').query({ brand: 'BLC' }).reply(200, {
        success: true,
        data: legacyVaults,
      });
      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);

      // Act
      const response = await repository.findVaultsRelatingToLinkId(linkId, platform);

      // Assert
      expect(response).toEqual([
        {
          offerId: legacyVaults[0].offerId,
          companyId: legacyVaults[0].companyId,
        },
        {
          offerId: legacyVaults[1].offerId,
          companyId: legacyVaults[1].companyId,
        },
      ]);
    });

    test('should return empty array if no vaults were found', async () => {
      // Arrange
      const linkId = faker.number.int(4);
      const platform: Platform = 'BLC_UK';
      const logger = createTestLogger();
      const mockedSecretsManger = {
        getSecretValueJson: jest.fn().mockReturnValue({
          codeRedeemedData: 'dummy',
          codeRedeemedPassword: 'dummy',
          assignUserCodesData: 'dummy',
          assignUserCodesPassword: 'dummy',
          checkAmountIssuedData: 'dummy',
          checkAmountIssuedPassword: 'dummy',
          retrieveAllVaultsData: 'NewVault/retrieveAllVaults',
          retrieveAllVaultsPassword: 'sjDpKVBt^FxCzq8y',
        }),
      } satisfies ISecretsManager;
      const unaffectedLegacyVaults = legacyVaultDataFactory.buildList(3);
      nock('https://test.com').get('/test-env/retrieveAllVaults').query({ brand: 'BLC' }).reply(200, {
        success: true,
        data: unaffectedLegacyVaults,
      });
      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);

      // Act
      const response = await repository.findVaultsRelatingToLinkId(linkId, platform);

      // Assert
      expect(response).toEqual([]);
    });

    test.todo('should correctly map the platform to the brand');
  });
});
