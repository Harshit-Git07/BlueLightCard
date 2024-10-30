import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import {
  DatabaseTransactionOperator,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultCodeEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCodeEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IVaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultCodesRepository } from '../../repositories/VaultCodesRepository';

import { UpdateVaultBatchResult, UpdateVaultBatchService } from './UpdateVaultBatchService';

const defaultVaultBatch = vaultBatchEntityFactory.build();
const defaultVaultCode = vaultCodeEntityFactory.build();

const stubTransactionManager: Partial<TransactionManager> = {
  withTransaction(callback) {
    return callback(as(mockDatabaseTransactionOperator));
  },
};

const mockDatabaseTransactionOperator: Partial<DatabaseTransactionOperator> = {};

const mockLogger: Partial<ILogger> = createTestLogger();

const mockVaultBatchesTransactionRepository: Partial<IVaultBatchesRepository> = {};
const mockVaultBatchesRepository: Partial<IVaultBatchesRepository> = {};

const mockVaultCodesTransactionRepository: Partial<IVaultCodesRepository> = {};
const mockVaultCodesRepository: Partial<IVaultCodesRepository> = {};

const updateVaultBatchService = new UpdateVaultBatchService(
  as(mockLogger),
  as(mockVaultBatchesRepository),
  as(mockVaultCodesRepository),
  as(stubTransactionManager),
);

describe('UpdateVaultBatchService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockVaultCodesRepository.withTransaction = jest.fn().mockReturnValue(mockVaultCodesTransactionRepository);
    mockVaultBatchesRepository.withTransaction = jest.fn().mockReturnValue(mockVaultBatchesTransactionRepository);
  });

  it('should update the vaultBatch and vaultCode', async () => {
    // Arrange

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);

    mockVaultBatchesTransactionRepository.updateOneById = jest.fn().mockResolvedValue({
      id: defaultVaultBatch.id,
    });

    mockVaultCodesRepository.findManyByBatchId = jest.fn().mockResolvedValue(defaultVaultCode);
    mockVaultCodesTransactionRepository.updateManyByBatchId = jest.fn().mockResolvedValue({
      id: defaultVaultCode.id,
    });

    // Act
    const updateVaultBatchResult: UpdateVaultBatchResult = await updateVaultBatchService.handle(
      defaultVaultBatch.id,
      new Date(),
    );

    // Assert
    expect(updateVaultBatchResult.kind).toBe('NoContent');
  });

  it('should return an error if the vaultBatch does not exist', async () => {
    // Arrange

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue(null);
    mockLogger.error = jest.fn();

    // Act
    const updateVaultBatchResult: UpdateVaultBatchResult = await updateVaultBatchService.handle(
      defaultVaultBatch.id,
      new Date(),
    );

    // Assert
    expect(updateVaultBatchResult.kind).toBe('VaultBatchNotFound');
    expect(updateVaultBatchResult.message).toBe('Vault Batch not found');
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Update Vault Batch - Vault Batch not found',
      }),
    );
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('should return an error if the vaultCode does not exist', async () => {
    // Arrange

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    mockVaultCodesRepository.findManyByBatchId = jest.fn().mockResolvedValue(null);

    mockLogger.error = jest.fn();

    // Act
    const updateVaultBatchResult: UpdateVaultBatchResult = await updateVaultBatchService.handle(
      defaultVaultBatch.id,
      new Date(),
    );

    // Assert
    expect(updateVaultBatchResult.kind).toBe('VaultCodesNotFound');
    expect(updateVaultBatchResult.message).toBe('Vault Codes not found');
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Update Vault Batch - Vault Codes not found',
      }),
    );
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('should return an error if the vaultBatch is not updated', async () => {
    // Arrange

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    mockVaultBatchesTransactionRepository.updateOneById = jest.fn().mockResolvedValue(null);

    mockVaultCodesRepository.findManyByBatchId = jest.fn().mockResolvedValue(defaultVaultCode);
    mockLogger.error = jest.fn();

    // Act
    const updateVaultBatchResult: UpdateVaultBatchResult = await updateVaultBatchService.handle(
      defaultVaultBatch.id,
      new Date(),
    );

    // Assert
    expect(updateVaultBatchResult.kind).toBe('ErrorUpdatingVaultBatch');
    expect(updateVaultBatchResult.message).toBe('Vault Batch not updated');
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Update Vault Batch - Vault Batch not updated',
      }),
    );
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('should return an error if the vaultCode is not updated', async () => {
    // Arrange

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue(defaultVaultBatch);
    mockVaultBatchesTransactionRepository.updateOneById = jest.fn().mockResolvedValue({
      id: defaultVaultBatch.id,
    });

    mockVaultCodesRepository.findManyByBatchId = jest.fn().mockResolvedValue(defaultVaultCode);
    mockVaultCodesTransactionRepository.updateManyByBatchId = jest.fn().mockResolvedValue(null);

    mockLogger.error = jest.fn();

    // Act
    const updateVaultBatchResult: UpdateVaultBatchResult = await updateVaultBatchService.handle(
      defaultVaultBatch.id,
      new Date(),
    );

    // Assert
    expect(updateVaultBatchResult.kind).toBe('ErrorUpdatingVaultCodes');
    expect(updateVaultBatchResult.message).toBe('Vault Codes not updated');
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Update Vault Batch - Vault Code not updated',
      }),
    );
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });
});
