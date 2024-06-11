import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { ILegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { Redemption } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { VaultBatch } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultCode, VaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { Vault, VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { DatabaseConnection, IDatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import {
  genericsTable,
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '@blc-mono/redemptions/libs/database/schema';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams } from './IRedeemStrategy';
import { RedeemGenericStrategy } from './RedeemGenericStrategy';
import { RedeemVaultStrategy } from './RedeemVaultStrategy';

describe('Redemption Strategies', () => {
  describe('RedeemGenericStrategy', () => {
    const mockedLogger = createTestLogger();
    const mockedSilentLogger = createSilentLogger();

    function callGenericRedeemStrategy(
      connection: IDatabaseConnection,
      redemption: Redemption,
      options: { silent?: boolean } = {},
    ) {
      const genericsRepository = new GenericsRepository(connection);
      const service = new RedeemGenericStrategy(genericsRepository, options.silent ? mockedSilentLogger : mockedLogger);
      const defaultParams: RedeemParams = {
        brazeExternalUserId: faker.string.uuid(),
        companyName: faker.company.name(),
        memberId: faker.string.sample(8),
        offerName: faker.lorem.words(3),
        clientType: faker.helpers.arrayElement(['web', 'mobile']),
      };
      return service.redeem(redemption, defaultParams);
    }

    let database: RedemptionsTestDatabase;
    let connection: DatabaseConnection;

    const redemption = Factory.define<typeof redemptionsTable.$inferSelect>(() => ({
      id: `rdm-${faker.string.uuid()}`,
      offerId: faker.number.int({
        min: 1,
        max: 1_000_000,
      }),
      companyId: 1,
      connection: 'affiliate',
      affiliate: 'awin',
      offerType: 'online',
      platform: 'BLC_UK',
      redemptionType: 'generic',
      url: 'https://www.blcshine.com',
    }));
    const generic = (redemptionId: string) =>
      Factory.define<typeof genericsTable.$inferSelect>(() => ({
        id: `gnr-${faker.string.uuid()}`,
        redemptionId: redemptionId,
        code: 'TEST10',
      }));

    beforeAll(async () => {
      database = await RedemptionsTestDatabase.start();
      connection = await database.getConnection();
    }, 60_000);

    afterEach(async () => {
      await database.reset();
    });

    afterAll(async () => {
      await database?.down?.();
    });

    it('Should throw when no generic is found', async () => {
      // Arrange
      const redemptionCreated = redemption.build();
      await connection.db.insert(redemptionsTable).values(redemptionCreated);

      // Act
      const result = callGenericRedeemStrategy(connection, redemptionCreated, { silent: true });

      // Assert
      await expect(result).rejects.toThrow();
    });

    it('Should return kind equals to "Ok" when a generic is found', async () => {
      // Arrange
      const redemptionCreated = redemption.build();
      const genericCreated = generic(redemptionCreated.id).build();
      await connection.db.insert(redemptionsTable).values(redemptionCreated);
      await connection.db.insert(genericsTable).values(genericCreated);

      // Act
      const result = await callGenericRedeemStrategy(connection, redemptionCreated);

      // Assert
      expect(result.kind).toBe('Ok');
      if (result.kind === 'Ok') {
        expect(result.redemptionType).toEqual('generic');
        expect(result.redemptionDetails.code).toEqual(genericCreated.code);
        expect(result.redemptionDetails.url).toEqual(redemptionCreated.url);
      }
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('RedeemPreAppliedStrategy (TODO)', () => {
    it.todo('Add tests for RedeemPreAppliedStrategy');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('RedeemShowCardStrategy (TODO)', () => {
    it.todo('Add tests for RedeemShowCardStrategy');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('RedeemVaultQrStrategy (TODO)', () => {
    it.todo('Add tests for RedeemVaultQrStrategy');
  });

  describe('RedeemVaultStrategy', () => {
    const mockedLogger = createTestLogger();
    const mockedSilentLogger = createSilentLogger();
    const defaultStrategyParams: RedeemParams = {
      brazeExternalUserId: faker.string.uuid(),
      companyName: faker.company.name(),
      memberId: faker.string.sample(8),
      offerName: faker.lorem.words(3),
      clientType: faker.helpers.arrayElement(['web', 'mobile']),
    };

    function callVaultRedeemStrategy(
      connection: IDatabaseConnection,
      redemption: Redemption,
      params: RedeemParams,
      options: {
        overrides?: {
          legacyVaultApiRepository?: ILegacyVaultApiRepository;
        };
        silent?: boolean;
      } = {},
    ) {
      const mockedLegacyVaultApiRepository =
        options.overrides?.legacyVaultApiRepository ??
        ({
          getNumberOfCodesIssued: jest.fn(),
          assignCodeToMember: jest.fn(),
          findVaultsRelatingToLinkId: jest.fn(),
          getCodesRedeemed: jest.fn(),
        } satisfies ILegacyVaultApiRepository);
      const vaultsRepository = new VaultsRepository(connection);
      const vaultCodesRepository = new VaultCodesRepository(connection);
      const service = new RedeemVaultStrategy(
        vaultsRepository,
        vaultCodesRepository,
        mockedLegacyVaultApiRepository,
        options.silent ? mockedSilentLogger : mockedLogger,
      );
      return service.redeem(redemption, params);
    }

    let database: RedemptionsTestDatabase;
    let connection: DatabaseConnection;

    const redemption = Factory.define<typeof redemptionsTable.$inferSelect>(() => ({
      id: `rdm-${faker.string.uuid()}`,
      offerId: faker.number.int({
        min: 1,
        max: 1_000_000,
      }),
      companyId: 1,
      connection: 'affiliate',
      affiliate: 'awin',
      offerType: 'online',
      platform: 'BLC_UK',
      redemptionType: 'generic',
      url: 'https://www.blcshine.com',
    }));
    const vault = (
      redemptionId: Vault['redemptionId'],
      vaultType: Vault['vaultType'],
      status: Vault['status'],
      maxPerUser: Vault['maxPerUser'],
    ) =>
      Factory.define<typeof vaultsTable.$inferSelect>(() => ({
        id: `vlt-${faker.string.uuid()}`,
        redemptionId: redemptionId,
        vaultType: vaultType,
        status,
        alertBelow: 10,
        created: faker.date.recent(),
        email: faker.internet.email(),
        integrationId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        integration: 'eagleeye',
        maxPerUser,
        showQR: false,
      }));
    const vaultBatches = (vaultId: VaultBatch['vaultId']) =>
      Factory.define<typeof vaultBatchesTable.$inferSelect>(() => ({
        id: `vbt-${faker.string.uuid()}`,
        vaultId,
        file: faker.string.uuid(),
      }));
    const vaultCodes = (
      vaultId: VaultCode['vaultId'],
      expiry: VaultCode['expiry'],
      batchId: VaultCode['batchId'],
      memberId: VaultCode['memberId'],
      code?: VaultCode['code'],
    ) =>
      Factory.define<typeof vaultCodesTable.$inferSelect>(() => ({
        id: `vcd-${faker.string.uuid()}`,
        vaultId: vaultId,
        memberId,
        code: code ?? faker.string.sample(10),
        created: faker.date.recent(),
        batchId: batchId,
        expiry: expiry,
      }));

    beforeAll(async () => {
      database = await RedemptionsTestDatabase.start();
      connection = await database.getConnection();
    }, 60_000);

    afterEach(async () => {
      await database.reset();
    });

    afterAll(async () => {
      await database?.down?.();
    });

    it('Should throw when no vault is found', async () => {
      // Arrange
      const redemptionCreated = redemption.build();
      await connection.db.insert(redemptionsTable).values(redemptionCreated);

      // Act
      const result = callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams, {
        silent: true,
      });

      // Assert
      await expect(result).rejects.toThrow();
    });
    describe('Standard vault flow', () => {
      it('Should throw when no matching active vault exists', async () => {
        // Arrange
        const redemptionCreated = redemption.build();
        const vaultCreated = vault(redemptionCreated.id, 'standard', 'in-active', 3).build();
        await connection.db.insert(redemptionsTable).values(redemptionCreated);
        await connection.db.insert(vaultsTable).values(vaultCreated);

        // Act
        const result = callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams, {
          silent: true,
        });

        // Assert
        await expect(result).rejects.toThrow();
      });
      it('Should throw when no vault code is found', async () => {
        // Arrange
        const redemptionCreated = redemption.build();
        const vaultCreated = vault(redemptionCreated.id, 'standard', 'active', 3).build();
        await connection.db.insert(redemptionsTable).values(redemptionCreated);
        await connection.db.insert(vaultsTable).values(vaultCreated);

        // Act
        const result = callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams, {
          silent: true,
        });

        // Assert
        await expect(result).rejects.toThrow();
      });
      it('Should return kind equals to "MaxPerUserReached" when max per user is reached', async () => {
        // Arrange
        const redemptionCreated = redemption.build({
          redemptionType: 'vault',
        });
        const vaultCreated = vault(redemptionCreated.id, 'standard', 'active', 3).build();
        const vaultBatchCreated = vaultBatches(vaultCreated.id).build();
        const vaultCodesCreated = [
          vaultCodes(
            vaultCreated.id,
            faker.date.future(),
            vaultBatchCreated.id,
            defaultStrategyParams.memberId,
          ).build(),
          vaultCodes(
            vaultCreated.id,
            faker.date.future(),
            vaultBatchCreated.id,
            defaultStrategyParams.memberId,
          ).build(),
          vaultCodes(
            vaultCreated.id,
            faker.date.future(),
            vaultBatchCreated.id,
            defaultStrategyParams.memberId,
          ).build(),
        ];
        await connection.db.insert(redemptionsTable).values(redemptionCreated);
        await connection.db.insert(vaultsTable).values(vaultCreated);
        await connection.db.insert(vaultBatchesTable).values(vaultBatchCreated);
        await connection.db.insert(vaultCodesTable).values(vaultCodesCreated);

        // Act
        const result = await callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams);

        // Assert
        expect(result.kind).toBe('MaxPerUserReached');
      });
      it('Should return kind equals to "Ok" when a vault code is found', async () => {
        // Arrange
        const recentDate = faker.date.recent();
        const futureDate = faker.date.future();
        const redemptionCreated = redemption.build({
          redemptionType: 'vault',
        });
        const vaultCreated = vault(redemptionCreated.id, 'standard', 'active', 3).build();
        const vaultBatchCreated = vaultBatches(vaultCreated.id).build();
        const vaultCodesCreated = [
          vaultCodes(vaultCreated.id, futureDate, vaultBatchCreated.id, null, 'FUTURE_CODE').build(),
          vaultCodes(vaultCreated.id, recentDate, vaultBatchCreated.id, null, 'RECENT_CODE').build(),
        ];
        await connection.db.insert(redemptionsTable).values(redemptionCreated);
        await connection.db.insert(vaultsTable).values(vaultCreated);
        await connection.db.insert(vaultBatchesTable).values(vaultBatchCreated);
        await connection.db.insert(vaultCodesTable).values(vaultCodesCreated);

        // Act
        const result = await callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams);

        // Assert
        expect(result.kind).toBe('Ok');
        if (result.kind === 'Ok') {
          expect(result.redemptionType).toEqual('vault');
          expect(result.redemptionDetails.url).toEqual(redemptionCreated.url);
          // expect(result.redemptionDetails.code).toEqual('RECENT_CODE'); // TODO: Check if this is necessary
        }
      });
    });
    describe('Legacy vault flow', () => {
      it('Should throw when there is an error checking the number of codes assigned', async () => {
        // Arrange
        const mockedLegacyVaultApiRepository = {
          findVaultsRelatingToLinkId: jest.fn(),
          getNumberOfCodesIssued: jest.fn().mockRejectedValue(new Error('Error checking number of codes issued')),
          assignCodeToMember: jest.fn(),
          getCodesRedeemed: jest.fn(),
        } satisfies ILegacyVaultApiRepository;
        const redemptionCreated = redemption.build({
          redemptionType: 'vault',
        });
        const vaultCreated = vault(redemptionCreated.id, 'legacy', 'active', 3).build();
        await connection.db.insert(redemptionsTable).values(redemptionCreated);
        await connection.db.insert(vaultsTable).values(vaultCreated);

        // Act
        const act = () =>
          callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams, {
            overrides: { legacyVaultApiRepository: mockedLegacyVaultApiRepository },
          });

        // Assert
        await expect(act).rejects.toThrow('Error checking number of codes issued');
      });
      it('Should return kind "MaxPerUserReached" when amountIssued is greater than or equal to vault maxPerUser', async () => {
        // Arrange
        const mockedLegacyVaultApiRepository = {
          findVaultsRelatingToLinkId: jest.fn(),
          getNumberOfCodesIssued: jest.fn().mockResolvedValue(3),
          assignCodeToMember: jest.fn().mockResolvedValue(undefined),
          getCodesRedeemed: jest.fn(),
        } satisfies ILegacyVaultApiRepository;
        const redemptionCreated = redemption.build({
          redemptionType: 'vault',
        });
        const vaultCreated = vault(redemptionCreated.id, 'legacy', 'active', 3).build();
        await connection.db.insert(redemptionsTable).values(redemptionCreated);
        await connection.db.insert(vaultsTable).values(vaultCreated);

        // Act
        const result = await callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams, {
          overrides: { legacyVaultApiRepository: mockedLegacyVaultApiRepository },
        });

        // Assert
        expect(result.kind).toBe('MaxPerUserReached');
      });
      it('Should throw when there is an error assigning the code to the user', async () => {
        // Arrange
        const mockedLegacyVaultApiRepository = {
          findVaultsRelatingToLinkId: jest.fn(),
          getNumberOfCodesIssued: jest.fn().mockResolvedValue(0),
          assignCodeToMember: jest.fn().mockRejectedValue(new Error('Error assigning code')),
          getCodesRedeemed: jest.fn(),
        } satisfies ILegacyVaultApiRepository;
        const redemptionCreated = redemption.build({
          redemptionType: 'vault',
        });
        const vaultCreated = vault(redemptionCreated.id, 'legacy', 'active', 3).build();
        await connection.db.insert(redemptionsTable).values(redemptionCreated);
        await connection.db.insert(vaultsTable).values(vaultCreated);

        // Act
        const act = () =>
          callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams, {
            overrides: { legacyVaultApiRepository: mockedLegacyVaultApiRepository },
          });

        // Assert
        await expect(act).rejects.toThrow('Error assigning code');
      });
      it('Should return kind equals to "Ok" when a vault code is found', async () => {
        // Arrange
        const desiredCode = faker.string.sample(10);
        const mockedLegacyVaultApiRepository = {
          findVaultsRelatingToLinkId: jest.fn(),
          getNumberOfCodesIssued: jest.fn().mockResolvedValue(0),
          assignCodeToMember: jest.fn().mockResolvedValue({
            linkId: faker.string.uuid(),
            vaultId: faker.string.uuid(),
            code: desiredCode,
          }),
          getCodesRedeemed: jest.fn(),
        } satisfies ILegacyVaultApiRepository;
        const redemptionCreated = redemption.build({
          redemptionType: 'vault',
        });
        const vaultCreated = vault(redemptionCreated.id, 'legacy', 'active', 3).build();
        await connection.db.insert(redemptionsTable).values(redemptionCreated);
        await connection.db.insert(vaultsTable).values(vaultCreated);

        // Act
        const result = await callVaultRedeemStrategy(connection, redemptionCreated, defaultStrategyParams, {
          overrides: { legacyVaultApiRepository: mockedLegacyVaultApiRepository },
        });

        // Assert
        expect(result.kind).toBe('Ok');
        if (result.kind === 'Ok') {
          expect(result.redemptionType).toEqual('vault');
          expect(result.redemptionDetails.url).toEqual(redemptionCreated.url);
          expect(result.redemptionDetails.code).toEqual(desiredCode);
        }
      });
    });
  });
});
