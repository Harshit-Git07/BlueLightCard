import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { IS3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';
import { IVaultBatchesRepository, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultCodesRepository, VaultCodesRepository } from '../../repositories/VaultCodesRepository';

import { VaultCodesUploadService } from './VaultCodesUploadService';

describe('VaultCodesUploadService', () => {
  const defaultBucketName = 'bucket-name';
  const defaultBatchId = `vbt-${faker.string.uuid()}`;
  const defaultVaultId = `vlt-${faker.string.uuid()}`;
  const defaultFileName = faker.system.fileName();
  const defaultS3Path = `${defaultVaultId}/${defaultBatchId}/${faker.date.anytime().toISOString()}.csv`;

  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
    process.env.AWS_REGION = 'eu-west-2';
  }, 60_000);

  afterEach(async () => {
    await database.reset(connection);
  });

  afterAll(async () => {
    await database?.down?.();
    delete process.env.AWS_REGION;
  });

  function makeService(
    logger: ILogger,
    override: {
      vaultCodesRepo?: IVaultCodesRepository;
      redemptionsEventsRepo?: IRedemptionsEventsRepository;
      vaultBatchesRepo?: IVaultBatchesRepository;
      s3ClientProvider?: IS3ClientProvider;
    },
  ) {
    const vaultCodesRepo = override.vaultCodesRepo ? override.vaultCodesRepo : new VaultCodesRepository(connection);
    const redemptionsEventsRepo = override.redemptionsEventsRepo
      ? override.redemptionsEventsRepo
      : new RedemptionsEventsRepository();
    const vaultBatchesRepo = override.vaultBatchesRepo
      ? override.vaultBatchesRepo
      : new VaultBatchesRepository(connection);
    const s3ClientProvider = override.s3ClientProvider ? override.s3ClientProvider : ({} as IS3ClientProvider);
    return new VaultCodesUploadService(
      logger,
      vaultCodesRepo,
      vaultBatchesRepo,
      redemptionsEventsRepo,
      s3ClientProvider,
    );
  }

  function mockS3ClientProvider(body: string | undefined = undefined): IS3ClientProvider {
    return {
      getClient: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue({
          Body: {
            transformToString: () => body ?? 'code1\ncode2\ncode3',
          },
        }),
      }),
    };
  }

  function mockVaultBatchesRepo(): Partial<IVaultBatchesRepository> {
    return {
      create: jest.fn(),
      findOneById: jest.fn().mockResolvedValue({
        batchId: defaultBatchId,
        file: defaultFileName,
        vaultId: defaultVaultId,
      }),
      withTransaction: jest.fn(),
      updateOneById: jest.fn(),
    };
  }

  function mockVaultCodesRepo(): IVaultCodesRepository {
    return {
      create: jest.fn(),
      checkIfMemberReachedMaxCodeClaimed: jest.fn(),
      checkVaultCodesRemaining: jest.fn(),
      claimVaultCode: jest.fn(),
      createMany: jest.fn((codes) => Promise.resolve(codes.map((code, index) => ({ id: `vcd-${index}`, code })))),
      withTransaction: jest.fn(),
      findManyByBatchId: jest.fn(),
      updateManyByBatchId: jest.fn(),
      findClaimedCodesByBatchId: jest.fn(),
      findUnclaimedCodesByBatchId: jest.fn(),
      deleteUnclaimedCodesByBatchId: jest.fn(),
    };
  }

  function mockRedemptionsEventsRepo(): IRedemptionsEventsRepository {
    return {
      publishMemberRedeemIntentEvent: jest.fn(),
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
      publishVaultBatchCreatedEvent: jest.fn(),
    };
  }

  it('should process all codes in the batch and send event', async () => {
    // Arrange
    const mockedLogger = createTestLogger();
    const mockedS3ClientProvider = mockS3ClientProvider();
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    const mockedVaultCodesRepo = mockVaultCodesRepo();

    const mockedRedemptionsEventsRepo = mockRedemptionsEventsRepo();

    const service = makeService(mockedLogger, {
      vaultCodesRepo: mockedVaultCodesRepo,
      redemptionsEventsRepo: mockedRedemptionsEventsRepo,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      s3ClientProvider: mockedS3ClientProvider,
    });

    // Act
    await service.handle(defaultBucketName, defaultS3Path, 1000);

    // Assert
    expect(mockedVaultCodesRepo.createMany).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
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
    const mockedSilentLogger = createSilentLogger();
    const mockedS3ClientProvider = mockS3ClientProvider();
    mockedS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockRejectedValue(new Error('Failed to get file')),
    });
    const service = makeService(mockedSilentLogger, {
      s3ClientProvider: mockedS3ClientProvider,
    });

    // Act & Assert
    await expect(service.handle(defaultBucketName, defaultS3Path, 1000)).rejects.toThrow(
      'Vault code upload - Failed to get s3 file',
    );
  });

  it('should throw error if empty file', async () => {
    // Arrange
    const mockedSilentLogger = createSilentLogger();
    const mockedS3ClientProvider = mockS3ClientProvider('');

    const service = makeService(mockedSilentLogger, {
      s3ClientProvider: mockedS3ClientProvider,
    });

    // Act & Assert
    await expect(service.handle(defaultBucketName, defaultS3Path, 1000)).rejects.toThrow(
      'Vault code upload - Empty file',
    );
  });

  it('should throw error if fail to extract file name info', async () => {
    // Arrange
    const mockedSilentLogger = createSilentLogger();
    const service = makeService(mockedSilentLogger, {});

    // Act & Assert
    await expect(service.handle(defaultBucketName, 'invalid-path', 1000)).rejects.toThrow(
      'Vault code upload - Invalid file path',
    );
  });

  it('counts successful vault code insertions', async () => {
    const mockedLogger = createTestLogger();
    const mockedS3ClientProvider = mockS3ClientProvider(['AAA', 'BBB', 'CCC', 'DDD'].join('\n'));
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    const mockedVaultCodesRepo = mockVaultCodesRepo();

    const mockedRedemptionsEventsRepo = mockRedemptionsEventsRepo();

    const service = makeService(mockedLogger, {
      vaultCodesRepo: mockedVaultCodesRepo,
      redemptionsEventsRepo: mockedRedemptionsEventsRepo,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      s3ClientProvider: mockedS3ClientProvider,
    });
    await service.handle(defaultBucketName, defaultS3Path, 1000);

    expect(mockedVaultCodesRepo.createMany).toHaveBeenCalledTimes(1);

    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
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
    const mockedLogger = createSilentLogger();
    const mockedS3ClientProvider = mockS3ClientProvider(['AAA', 'BBB', 'CCC', 'DDD'].join('\n'));
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.createMany = jest.fn((codes) => {
      const duplicatesToFilter = ['BBB', 'DDD'];
      return Promise.resolve(
        codes
          .filter((vaultCode) => duplicatesToFilter.includes(vaultCode.code))
          .map((vaultCode, index) => ({ id: `vcd-${index}`, code: vaultCode.code })),
      );
    });

    const mockedRedemptionsEventsRepo = mockRedemptionsEventsRepo();

    const service = makeService(mockedLogger, {
      vaultCodesRepo: mockedVaultCodesRepo,
      redemptionsEventsRepo: mockedRedemptionsEventsRepo,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      s3ClientProvider: mockedS3ClientProvider,
    });
    await service.handle(defaultBucketName, defaultS3Path, 1000);

    expect(mockedVaultCodesRepo.createMany).toHaveBeenCalledTimes(1);

    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
      vaultId: defaultVaultId,
      batchId: defaultBatchId,
      codeInsertFailArray: [],
      numberOfCodeInsertFailures: 0,
      numberOfCodeInsertSuccesses: 2,
      fileName: defaultFileName,
      numberOfDuplicateCodes: 2,
    });

    expect(mockedLogger.warn).toHaveBeenCalledTimes(1);
    expect(mockedLogger.warn).toHaveBeenCalledWith({
      message: 'Vault code upload - 2 duplicate vault codes were not inserted',
    });
    expect(mockedLogger.error).not.toHaveBeenCalled();
  });

  it('counts failed vault code insertions', async () => {
    const mockedLogger = createTestLogger();
    const mockedS3ClientProvider = mockS3ClientProvider(['AAA', 'BBB', 'CCC', 'DDD'].join('\n'));
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.createMany = jest.fn().mockRejectedValue(new Error('Failed to insert codes'));
    const mockedRedemptionsEventsRepo = mockRedemptionsEventsRepo();

    const service = makeService(mockedLogger, {
      vaultCodesRepo: mockedVaultCodesRepo,
      redemptionsEventsRepo: mockedRedemptionsEventsRepo,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      s3ClientProvider: mockedS3ClientProvider,
    });
    await service.handle(defaultBucketName, defaultS3Path, 1000);

    expect(mockedVaultCodesRepo.createMany).toHaveBeenCalledTimes(1);

    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
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
    const mockedLogger = createTestLogger();
    const mockedS3ClientProvider = mockS3ClientProvider();
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.createMany = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed to insert codes'))
      .mockResolvedValue([{ id: 'vcd-1', code: 'code3' }]);
    const mockedRedemptionsEventsRepo = mockRedemptionsEventsRepo();

    const service = makeService(mockedLogger, {
      vaultCodesRepo: mockedVaultCodesRepo,
      redemptionsEventsRepo: mockedRedemptionsEventsRepo,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
      s3ClientProvider: mockedS3ClientProvider,
    });

    // Act
    await service.handle(defaultBucketName, defaultS3Path, batchSize);

    // Assert
    expect(mockedVaultCodesRepo.createMany).toHaveBeenCalledTimes(batchSize);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
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
    const mockedSilentLogger = createSilentLogger();
    const mockedS3ClientProvider = mockS3ClientProvider('co de1\ncod e3\nc ode2');

    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    const service = makeService(mockedSilentLogger, {
      s3ClientProvider: mockedS3ClientProvider,
      vaultBatchesRepo: as(mockedVaultBatchesRepo),
    });

    // Act & Assert
    await expect(service.handle(defaultBucketName, defaultS3Path, 1000)).rejects.toThrow(
      'Vault code upload - Invalid blank space in code',
    );
  });

  it('should throw error if file path is invalid', async () => {
    // Arrange
    const mockedSilentLogger = createSilentLogger();
    const service = makeService(mockedSilentLogger, {});

    // Act & Assert
    await expect(service.handle(defaultBucketName, 'invalid-path', 1000)).rejects.toThrow(
      'Vault code upload - Invalid file path',
    );
  });
});
