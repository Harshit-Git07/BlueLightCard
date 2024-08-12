import { faker } from '@faker-js/faker';
import nock from 'nock';

import { LegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { legacyVaultBatchesFactory, legacyVaultDataFactory } from '../../libs/test/factories/legacyVaultData.factory';

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
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH]: 'viewBatches',
    [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH]: 'checkVaultStock',
    ['BRAND']: 'BLC_UK',
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
          viewVaultBatchesData: 'dummy',
          viewVaultBatchesPassword: 'dummy',
          checkVaultStockData: 'dummy',
          checkVaultStockPassword: 'dummy',
        }),
      } satisfies ISecretsManager;
      const legacyVaults = [legacyVaultDataFactory.build({ linkId }), legacyVaultDataFactory.build({ linkId })];
      nock('https://test.com').get('/test-env/retrieveAllVaults').query({ brand: 'BLC' }).reply(200, {
        success: true,
        data: legacyVaults,
      });
      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);

      // Act
      const response = await repository.findVaultsRelatingToLinkId(linkId);

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
          viewVaultBatchesData: 'dummy',
          viewVaultBatchesPassword: 'dummy',
          checkVaultStockData: 'dummy',
          checkVaultStockPassword: 'dummy',
        }),
      } satisfies ISecretsManager;
      const unaffectedLegacyVaults = legacyVaultDataFactory.buildList(3);
      nock('https://test.com').get('/test-env/retrieveAllVaults').query({ brand: 'BLC' }).reply(200, {
        success: true,
        data: unaffectedLegacyVaults,
      });
      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);

      // Act
      const response = await repository.findVaultsRelatingToLinkId(linkId);

      // Assert
      expect(response).toEqual([]);
    });

    test.todo('should correctly map the platform to the brand');
  });

  describe('viewVaultBatches', () => {
    const defaultOfferId = faker.number.int(4);
    const defaultCompanyId = faker.number.int(4);
    const logger = createTestLogger();
    const mockedSecretsManger = {
      getSecretValueJson: jest.fn().mockReturnValue({
        codeRedeemedData: 'dummy',
        codeRedeemedPassword: 'dummy',
        assignUserCodesData: 'dummy',
        assignUserCodesPassword: 'dummy',
        checkAmountIssuedData: 'dummy',
        checkAmountIssuedPassword: 'dummy',
        retrieveAllVaultsData: 'dummy',
        retrieveAllVaultsPassword: 'dummy',
        viewVaultBatchesData: 'NewVault/viewBatches',
        viewVaultBatchesPassword: 'sjDpKVBt^FxCzq8y', // dummy password
        checkVaultStockData: 'dummy',
        checkVaultStockPassword: 'dummy',
      }),
    } satisfies ISecretsManager;

    it('should return the vault batches', async () => {
      // Arrange
      const vaultBatches = {
        ...legacyVaultBatchesFactory.build(),
        ...legacyVaultBatchesFactory.build(),
        ...legacyVaultBatchesFactory.build(),
      };
      nock('https://test.com')
        .post('/test-env/viewBatches', {
          companyId: defaultCompanyId,
          offerId: defaultOfferId,
          brand: 'BLC',
        })
        .reply(200, {
          success: true,
          data: vaultBatches,
        });
      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);

      // Act
      const response = await repository.viewVaultBatches(defaultOfferId, defaultCompanyId);

      // Assert
      expect(response).toEqual(vaultBatches);
    });

    it('should return an empty object if no vault batches were found', async () => {
      // Arrange
      nock('https://test.com')
        .post('/test-env/viewBatches', {
          companyId: defaultCompanyId,
          offerId: defaultOfferId,
          brand: 'BLC',
        })
        .reply(200, {
          success: true,
          data: {},
        });
      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);

      // Act
      const response = await repository.viewVaultBatches(defaultOfferId, defaultCompanyId);

      // Assert
      expect(response).toEqual({});
    });
  });

  describe('checkVaultStock', () => {
    const defaultOfferId = faker.number.int(4);
    const defaultCompanyId = faker.number.int(4);
    const defaultBatchNo = faker.string.uuid();
    const logger = createTestLogger();
    const mockedSecretsManger = {
      getSecretValueJson: jest.fn().mockReturnValue({
        codeRedeemedData: 'dummy',
        codeRedeemedPassword: 'dummy',
        assignUserCodesData: 'dummy',
        assignUserCodesPassword: 'dummy',
        checkAmountIssuedData: 'dummy',
        checkAmountIssuedPassword: 'dummy',
        retrieveAllVaultsData: 'dummy',
        retrieveAllVaultsPassword: 'dummy',
        viewVaultBatchesData: 'dummy',
        viewVaultBatchesPassword: 'dummy',
        checkVaultStockData: 'NewVault/checkVaultStock',
        checkVaultStockPassword: 'sjDpKVBt^FxCzq8y', // dummy password
      }),
    } satisfies ISecretsManager;

    it('should return the vault stock', async () => {
      // Arrange
      const vaultStock = faker.number.int(4);
      nock('https://test.com')
        .post('/test-env/checkVaultStock', {
          companyId: defaultCompanyId,
          offerId: defaultOfferId,
          brand: 'BLC',
          batchNo: defaultBatchNo,
        })
        .reply(200, {
          success: true,
          data: vaultStock,
        });
      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);

      // Act
      const response = await repository.checkVaultStock(defaultBatchNo, defaultOfferId, defaultCompanyId);

      // Assert
      expect(response).toEqual(vaultStock);
    });

    it('should return 0 if no vault stock was found', async () => {
      // Arrange
      nock('https://test.com')
        .post('/test-env/checkVaultStock', {
          companyId: defaultCompanyId,
          offerId: defaultOfferId,
          brand: 'BLC',
          batchNo: defaultBatchNo,
        })
        .reply(200, {
          success: true,
          data: 0,
        });
      const repository = new LegacyVaultApiRepository(logger, mockedSecretsManger);

      // Act
      const response = await repository.checkVaultStock(defaultBatchNo, defaultOfferId, defaultCompanyId);

      // Assert
      expect(response).toEqual(0);
    });
  });
});
