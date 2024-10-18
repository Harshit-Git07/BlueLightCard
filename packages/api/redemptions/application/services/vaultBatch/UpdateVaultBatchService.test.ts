import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import {
  ITransactionManager,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultCodeEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCodeEntity.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IVaultBatchesRepository, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultCodesRepository, VaultCodesRepository } from '../../repositories/VaultCodesRepository';

import { UpdateVaultBatchService } from './UpdateVaultBatchService';

describe('UpdateVaultBatchService', () => {
  const defaultVaultBatch = vaultBatchEntityFactory.build();
  const defaultVaultCode = vaultCodeEntityFactory.build();
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
      logger?: ILogger;
    } = {},
  ) {
    const logger = override.logger ?? createTestLogger();
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
    const logger = createSilentLogger();

    // Act
    const result = await callUpdateVaultBatchService({
      logger: logger,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('VaultBatchNotFound');
    expect(result.message).toBe('Vault Batch not found');
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Update Vault Batch - Vault Batch not found',
      }),
    );
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should return an error if the vaultCode does not exist', async () => {
    // Arrange
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    mockedVaultBatchesRepo.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.findManyByBatchId = jest.fn().mockResolvedValue(null);
    const logger = createSilentLogger();

    // Act
    const result = await callUpdateVaultBatchService({
      logger: logger,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('VaultCodesNotFound');
    expect(result.message).toBe('Vault Codes not found');
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Update Vault Batch - Vault Codes not found',
      }),
    );
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should return an error if the vaultBatch is not updated', async () => {
    // Arrange
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    mockedVaultBatchesRepo.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    mockedVaultBatchesRepo.updateOneById = jest.fn().mockResolvedValue(null);
    mockedVaultBatchesRepo.withTransaction = jest.fn().mockReturnValue(mockedVaultBatchesRepo);
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.findManyByBatchId = jest.fn().mockResolvedValue(defaultVaultCode);
    const logger = createSilentLogger();

    // Act
    const result = await callUpdateVaultBatchService({
      logger: logger,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('ErrorUpdatingVaultBatch');
    expect(result.message).toBe('Vault Batch not updated');
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Update Vault Batch - Vault Batch not updated',
      }),
    );
    expect(logger.warn).not.toHaveBeenCalled();
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
    const logger = createSilentLogger();

    // Act
    const result = await callUpdateVaultBatchService({
      logger: logger,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      vaultCodesRepo: mockedVaultCodesRepo,
    });

    // Assert
    expect(result.kind).toBe('ErrorUpdatingVaultCodes');
    expect(result.message).toBe('Vault Codes not updated');
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Update Vault Batch - Vault Code not updated',
      }),
    );
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
