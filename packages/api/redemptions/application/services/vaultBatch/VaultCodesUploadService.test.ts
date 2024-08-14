import { faker } from '@faker-js/faker';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { IS3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

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

  function makeService(override: {
    vaultCodesRepo?: IVaultCodesRepository;
    redemptionsEventsRepo?: IRedemptionsEventsRepository;
    vaultBatchesRepo?: IVaultBatchesRepository;
    s3ClientProvider?: IS3ClientProvider;
  }) {
    const logger = createTestLogger();
    const vaultCodesRepo = override.vaultCodesRepo ? override.vaultCodesRepo : new VaultCodesRepository(connection);
    const redemptionsEventsRepo = override.redemptionsEventsRepo
      ? override.redemptionsEventsRepo
      : new RedemptionsEventsRepository();
    const vaultBatchesRepo = override.vaultBatchesRepo
      ? override.vaultBatchesRepo
      : new VaultBatchesRepository(connection);
    const s3ClientProvider = override.s3ClientProvider ? override.s3ClientProvider : ({} as IS3ClientProvider);
    const service = new VaultCodesUploadService(
      logger,
      vaultCodesRepo,
      vaultBatchesRepo,
      redemptionsEventsRepo,
      s3ClientProvider,
    );
    return service;
  }

  function mockS3ClientProvider(): IS3ClientProvider {
    return {
      getClient: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue({
          Body: {
            transformToString: () => 'code1\ncode2\ncode3',
          },
        }),
      }),
    };
  }

  function mockVaultBatchesRepo(): IVaultBatchesRepository {
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
      createMany: jest.fn(),
      withTransaction: jest.fn(),
      findManyByBatchId: jest.fn(),
      updateManyByBatchId: jest.fn(),
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
    const mockedS3ClientProvider = mockS3ClientProvider();
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.createMany = jest.fn().mockResolvedValue(undefined);
    const mockedRedemptionsEventsRepo = mockRedemptionsEventsRepo();
    mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent = jest.fn().mockResolvedValue(undefined);
    const service = makeService({
      vaultCodesRepo: mockedVaultCodesRepo,
      redemptionsEventsRepo: mockedRedemptionsEventsRepo,
      vaultBatchesRepo: mockedVaultBatchesRepo,
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
      countCodeInsertFail: 0,
      countCodeInsertSuccess: 3,
      fileName: defaultFileName,
    });
  });

  it('should throw error if fail to get s3 file', async () => {
    // Arrange
    const mockedS3ClientProvider = mockS3ClientProvider();
    mockedS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockRejectedValue(new Error('Failed to get file')),
    });
    const service = makeService({
      s3ClientProvider: mockedS3ClientProvider,
    });

    // Act & Assert
    await expect(service.handle(defaultBucketName, defaultS3Path, 1000)).rejects.toThrow(
      'Vault code upload - Failed to get s3 file',
    );
  });

  it('should throw error if empty file', async () => {
    // Arrange
    const mockedS3ClientProvider = mockS3ClientProvider();
    mockedS3ClientProvider.getClient = jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: () => '',
        },
      }),
    });
    const service = makeService({
      s3ClientProvider: mockedS3ClientProvider,
    });

    // Act & Assert
    await expect(service.handle(defaultBucketName, defaultS3Path, 1000)).rejects.toThrow(
      'Vault code upload - Empty file',
    );
  });

  it('should throw error if fail to extract file name info', async () => {
    // Arrange
    const service = makeService({});

    // Act & Assert
    await expect(service.handle(defaultBucketName, 'invalid-path', 1000)).rejects.toThrow(
      'Vault code upload - Invalid file path',
    );
  });

  it('should count failed and successful code insertions', async () => {
    // Arrange
    const mockedS3ClientProvider = mockS3ClientProvider();
    const mockedVaultBatchesRepo = mockVaultBatchesRepo();
    const mockedVaultCodesRepo = mockVaultCodesRepo();
    mockedVaultCodesRepo.createMany = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed to insert codes'))
      .mockResolvedValue(undefined);
    const mockedRedemptionsEventsRepo = mockRedemptionsEventsRepo();
    mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent = jest.fn().mockResolvedValue(undefined);
    const service = makeService({
      vaultCodesRepo: mockedVaultCodesRepo,
      redemptionsEventsRepo: mockedRedemptionsEventsRepo,
      vaultBatchesRepo: mockedVaultBatchesRepo,
      s3ClientProvider: mockedS3ClientProvider,
    });

    // Act
    await service.handle(defaultBucketName, defaultS3Path, 2);

    // Assert
    expect(mockedVaultCodesRepo.createMany).toHaveBeenCalledTimes(2);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepo.publishVaultBatchCreatedEvent).toHaveBeenCalledWith({
      vaultId: defaultVaultId,
      batchId: defaultBatchId,
      codeInsertFailArray: ['code1', 'code2'],
      countCodeInsertFail: 2,
      countCodeInsertSuccess: 1,
      fileName: defaultFileName,
    });
  });
});
