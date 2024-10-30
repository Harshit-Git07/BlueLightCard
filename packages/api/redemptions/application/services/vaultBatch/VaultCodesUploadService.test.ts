import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { IS3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IRedemptionsEventsRepository } from '../../repositories/RedemptionsEventsRepository';
import { IVaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultCodesRepository } from '../../repositories/VaultCodesRepository';

import { VaultCodesUploadService } from './VaultCodesUploadService';

const defaultBucketName = 'bucket-name';
const defaultBatchId = `vbt-${faker.string.uuid()}`;
const defaultVaultId = `vlt-${faker.string.uuid()}`;
const defaultFileName = faker.system.fileName();
const defaultS3Path = `${defaultVaultId}/${defaultBatchId}/${faker.date.anytime().toISOString()}.csv`;

const mockLogger: ILogger = createTestLogger();

const mockVaultBatchesRepository: Partial<IVaultBatchesRepository> = {};
const mockVaultCodesRepository: Partial<IVaultCodesRepository> = {};
const mockRedemptionsEventsRepository: Partial<IRedemptionsEventsRepository> = {};
const mockS3ClientProvider: Partial<IS3ClientProvider> = {};

const vaultCodesUploadService = new VaultCodesUploadService(
  mockLogger,
  as(mockVaultCodesRepository),
  as(mockVaultBatchesRepository),
  as(mockRedemptionsEventsRepository),
  as(mockS3ClientProvider),
);

describe('VaultCodesUploadService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should process all codes in the batch and send event', async () => {
    // Arrange
    mockS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => 'code1\ncode2\ncode3',
        },
      }),
    });

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue({
      batchId: defaultBatchId,
      file: defaultFileName,
      vaultId: defaultVaultId,
    });

    mockVaultCodesRepository.createMany = jest.fn((codes) =>
      Promise.resolve(codes.map((code, index) => ({ id: `vcd-${index}`, code }))),
    );

    mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent = jest.fn();

    // Act
    await vaultCodesUploadService.handle(defaultBucketName, defaultS3Path, 1000);

    // Assert
    expect(mockVaultCodesRepository.createMany).toHaveBeenCalledTimes(1);
    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
      vaultId: defaultVaultId,
      batchId: defaultBatchId,
      codeInsertFailArray: [],
      numberOfCodeInsertFailures: 0,
      numberOfCodeInsertSuccesses: 3,
      numberOfDuplicateCodes: 0,
      fileName: defaultFileName,
    });
  });

  it('should throw error if fail to get s3 file', async () => {
    // Arrange
    mockS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockRejectedValue(new Error('Failed to get file')),
    });

    // Act & Assert
    await expect(vaultCodesUploadService.handle(defaultBucketName, defaultS3Path, 1000)).rejects.toThrow(
      'Vault code upload - Failed to get s3 file',
    );
  });

  it('should throw error if empty file', async () => {
    // Arrange
    mockS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => '',
        },
      }),
    });

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue({
      batchId: defaultBatchId,
      file: defaultFileName,
      vaultId: defaultVaultId,
    });

    // Act & Assert
    await expect(vaultCodesUploadService.handle(defaultBucketName, defaultS3Path, 1000)).rejects.toThrow(
      'Vault code upload - Empty file',
    );
  });

  it('should throw error if fail to extract file name info', async () => {
    // Act & Assert
    await expect(vaultCodesUploadService.handle(defaultBucketName, 'invalid-path', 1000)).rejects.toThrow(
      'Vault code upload - Invalid file path',
    );
  });

  it('counts successful vault code insertions', async () => {
    // Arrange
    mockS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => ['AAA', 'BBB', 'CCC', 'DDD'].join('\n'),
        },
      }),
    });

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue({
      batchId: defaultBatchId,
      file: defaultFileName,
      vaultId: defaultVaultId,
    });

    mockVaultCodesRepository.createMany = jest.fn((codes) =>
      Promise.resolve(codes.map((code, index) => ({ id: `vcd-${index}`, code }))),
    );

    mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent = jest.fn();

    await vaultCodesUploadService.handle(defaultBucketName, defaultS3Path, 1000);

    expect(mockVaultCodesRepository.createMany).toHaveBeenCalledTimes(1);

    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
      vaultId: defaultVaultId,
      batchId: defaultBatchId,
      codeInsertFailArray: [],
      numberOfCodeInsertFailures: 0,
      numberOfCodeInsertSuccesses: 4,
      fileName: defaultFileName,
      numberOfDuplicateCodes: 0,
    });
  });

  it('warns when duplicate codes are not inserted', async () => {
    // Arrange
    mockS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => ['AAA', 'BBB', 'CCC', 'DDD'].join('\n'),
        },
      }),
    });

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue({
      batchId: defaultBatchId,
      file: defaultFileName,
      vaultId: defaultVaultId,
    });

    mockVaultCodesRepository.createMany = jest.fn((codes) => {
      const duplicatesToFilter = ['BBB', 'DDD'];
      return Promise.resolve(
        codes
          .filter((vaultCode) => duplicatesToFilter.includes(vaultCode.code))
          .map((vaultCode, index) => ({ id: `vcd-${index}`, code: vaultCode.code })),
      );
    });

    mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent = jest.fn();

    await vaultCodesUploadService.handle(defaultBucketName, defaultS3Path, 1000);

    expect(mockVaultCodesRepository.createMany).toHaveBeenCalledTimes(1);

    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
      vaultId: defaultVaultId,
      batchId: defaultBatchId,
      codeInsertFailArray: [],
      numberOfCodeInsertFailures: 0,
      numberOfCodeInsertSuccesses: 2,
      fileName: defaultFileName,
      numberOfDuplicateCodes: 2,
    });

    expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    expect(mockLogger.warn).toHaveBeenCalledWith({
      message: 'Vault code upload - 2 duplicate vault codes were not inserted',
    });
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('counts failed vault code insertions', async () => {
    // Arrange
    mockS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => ['AAA', 'BBB', 'CCC', 'DDD'].join('\n'),
        },
      }),
    });

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue({
      batchId: defaultBatchId,
      file: defaultFileName,
      vaultId: defaultVaultId,
    });

    mockVaultCodesRepository.createMany = jest.fn().mockRejectedValue(new Error('Failed to insert codes'));

    mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent = jest.fn();

    await vaultCodesUploadService.handle(defaultBucketName, defaultS3Path, 1000);

    expect(mockVaultCodesRepository.createMany).toHaveBeenCalledTimes(1);

    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
      vaultId: defaultVaultId,
      batchId: defaultBatchId,
      codeInsertFailArray: ['AAA', 'BBB', 'CCC', 'DDD'],
      numberOfCodeInsertFailures: 4,
      numberOfCodeInsertSuccesses: 0,
      fileName: defaultFileName,
      numberOfDuplicateCodes: 0,
    });
  });

  it('totals vault code insertion attempts across multiple batches', async () => {
    // Arrange
    const batchSize = 2;
    mockS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => 'code1\ncode2\ncode3',
        },
      }),
    });

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue({
      batchId: defaultBatchId,
      file: defaultFileName,
      vaultId: defaultVaultId,
    });

    mockVaultCodesRepository.createMany = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed to insert codes'))
      .mockResolvedValue([{ id: 'vcd-1', code: 'code3' }]);

    mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent = jest.fn();

    // Act
    await vaultCodesUploadService.handle(defaultBucketName, defaultS3Path, batchSize);

    // Assert
    expect(mockVaultCodesRepository.createMany).toHaveBeenCalledTimes(batchSize);
    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockRedemptionsEventsRepository.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
      vaultId: defaultVaultId,
      batchId: defaultBatchId,
      codeInsertFailArray: ['code1', 'code2'],
      numberOfCodeInsertFailures: 2,
      numberOfCodeInsertSuccesses: 1,
      fileName: defaultFileName,
      numberOfDuplicateCodes: 0,
    });
  });

  it('should throw error if codes contain spaces', async () => {
    // Arrange

    mockS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => 'co de1\ncod e3\nc ode2',
        },
      }),
    });

    mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue({
      batchId: defaultBatchId,
      file: defaultFileName,
      vaultId: defaultVaultId,
    });

    // Act & Assert
    await expect(vaultCodesUploadService.handle(defaultBucketName, defaultS3Path, 1000)).rejects.toThrow(
      'Vault code upload - Invalid blank space in code',
    );
  });

  it('should throw error if file path is invalid', async () => {
    // Arrange

    // Act & Assert
    await expect(vaultCodesUploadService.handle(defaultBucketName, 'invalid-path', 1000)).rejects.toThrow(
      'Vault code upload - Invalid file path',
    );
  });
});
