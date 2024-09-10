import { as } from '@blc-mono/core/utils/testing';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultBatchFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatches.factory';
import { vaultCodeFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCode.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IVaultBatchesRepository, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultCodesRepository, VaultCodesRepository } from '../../repositories/VaultCodesRepository';

import { UpdateVaultBatchService } from './UpdateVaultBatchService';

describe('UpdateVaultBatchService', () => {
  const defaultVaultBatch = vaultBatchFactory.build();
  const defaultVaultCode = vaultCodeFactory.build();
  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterEach(async () => {
    await database.reset(connection);
  });

  afterAll(async () => {
    await database?.down?.();
  });

  function callUpdateVaultBatchService(
    override: {
      vaultBatchesRepo?: IVaultBatchesRepository;
      vaultCodesRepo?: IVaultCodesRepository;
      transactionManager?: ITransactionManager;
    } = {},
  ) {
    const logger = createTestLogger();
    const vaultBatchesRepo = override.vaultBatchesRepo ?? new VaultBatchesRepository(connection);
    const vaultCodesRepo = override.vaultCodesRepo ?? new VaultCodesRepository(connection);
    const transactionManager = override.transactionManager ?? new TransactionManager(connection);
    const service = new UpdateVaultBatchService(logger, vaultBatchesRepo, vaultCodesRepo, transactionManager);
    return service.handle(defaultVaultBatch.id, new Date());
  }

  function mockVaultBatchesRepo(): Partial<IVaultBatchesRepository> {
    return {
      findOneById: jest.fn().mockResolvedValue(defaultVaultBatch),
      create: jest.fn(),
      updateOneById: jest.fn(),
      withTransaction: jest.fn(),
    };
  }

  function mockVaultCodesRepo(): IVaultCodesRepository {
    return {
      findManyByBatchId: jest.fn().mockResolvedValue([defaultVaultCode, defaultVaultCode]),
      checkIfMemberReachedMaxCodeClaimed: jest.fn(),
      create: jest.fn(),
      updateManyByBatchId: jest.fn(),
      checkVaultCodesRemaining: jest.fn(),
      claimVaultCode: jest.fn(),
      createMany: jest.fn(),
      withTransaction: jest.fn(),
      findClaimedCodesByBatchId: jest.fn(),
      findUnclaimedCodesByBatchId: jest.fn(),
      deleteUnclaimedCodesByBatchId: jest.fn(),
    };
  }

  it('should update the vaultBatch and vaultCode', async () => {
    // Arrange

    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    mockedVaultBatchesRepo.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    mockedVaultBatchesRepo.withTransaction = jest.fn().mockReturnValue({
      updateOneById: jest.fn().mockResolvedValue({
        id: defaultVaultBatch.id,
      }),
    });
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.findManyByBatchId = jest.fn().mockResolvedValue(defaultVaultCode);
    mockedVaultCodesRepo.withTransaction = jest.fn().mockReturnValue({
      updateManyByBatchId: jest.fn().mockResolvedValue({
        id: defaultVaultCode.id,
      }),
    });

    // Act
    const result = await callUpdateVaultBatchService({
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('NoContent');
  });

  it('should return an error if the vaultBatch does not exist', async () => {
    // Arrange
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    mockedVaultBatchesRepo.findOneById = jest.fn().mockResolvedValue(null);
    const mockedVaultCodesRepo = mockVaultCodesRepo();

    // Act
    const result = await callUpdateVaultBatchService({
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('VaultBatchNotFound');
    expect(result.message).toBe('Vault Batch not found');
  });

  it('should return an error if the vaultCode does not exist', async () => {
    // Arrange
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    mockedVaultBatchesRepo.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.findManyByBatchId = jest.fn().mockResolvedValue(null);

    // Act
    const result = await callUpdateVaultBatchService({
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('VaultCodesNotFound');
    expect(result.message).toBe('Vault Codes not found');
  });

  it('should return an error if the vaultBatch is not updated', async () => {
    // Arrange
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    mockedVaultBatchesRepo.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    mockedVaultBatchesRepo.updateOneById = jest.fn().mockResolvedValue(null);
    mockedVaultBatchesRepo.withTransaction = jest.fn().mockReturnValue(mockedVaultBatchesRepo);
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.findManyByBatchId = jest.fn().mockResolvedValue(defaultVaultCode);

    // Act
    const result = await callUpdateVaultBatchService({
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('ErrorUpdatingVaultBatch');
    expect(result.message).toBe('Vault Batch not updated');
  });

  it('should return an error if the vaultCode is not updated', async () => {
    // Arrange
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    mockedVaultBatchesRepo.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    mockedVaultBatchesRepo.updateOneById = jest.fn().mockResolvedValue({
      id: defaultVaultBatch.id,
    });
    mockedVaultBatchesRepo.withTransaction = jest.fn().mockReturnValue(mockedVaultBatchesRepo);
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.findManyByBatchId = jest.fn().mockResolvedValue(defaultVaultCode);
    mockedVaultCodesRepo.updateManyByBatchId = jest.fn().mockResolvedValue(null);
    mockedVaultCodesRepo.withTransaction = jest.fn().mockReturnValue(mockedVaultCodesRepo);

    // Act
    const result = await callUpdateVaultBatchService({
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('ErrorUpdatingVaultCodes');
    expect(result.message).toBe('Vault Codes not updated');
  });
});
