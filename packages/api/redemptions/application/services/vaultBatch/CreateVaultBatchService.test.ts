import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { IS3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';
import { redemptionFactory } from '@blc-mono/redemptions/libs/test/factories/redemption.factory';
import { vaultFactory } from '@blc-mono/redemptions/libs/test/factories/vault.factory';
import { vaultBatchFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatches.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { ParsedRequest } from '../../controllers/adminApiGateway/vaultBatch/CreateVaultBatchController';
import { S3SignedUrl } from '../../helpers/S3SignedUrl';
import { IRedemptionsRepository } from '../../repositories/RedemptionsRepository';
import { IVaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository } from '../../repositories/VaultsRepository';

import { CreateVaultBatchError, CreateVaultBatchResult, CreateVaultBatchService } from './CreateVaultBatchService';

jest.mock('@blc-mono/core/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === 'VAULT_CODES_UPLOAD_BUCKET') {
      return 'stage-brand-vault-codes-upload';
    }
  }),
}));

describe('CreateVaultBatchService', () => {
  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterAll(async () => {
    await database?.down?.();
  });

  const putObjectSignedUrl = 'https://stage-brand-vault-codes-upload.s3.amazonaws.com/bucket/key?sign-data';

  function getTestEvent(vaultId: string) {
    return {
      body: {
        vaultId: vaultId,
        expiry: faker.date.future().setMilliseconds(0).toString(),
      },
    } satisfies ParsedRequest;
  }

  const mockRedemptionsRepository: Partial<IRedemptionsRepository> = {
    findOneByOfferId: jest.fn(),
    updateManyByOfferId: jest.fn(),
    updateOneByOfferId: jest.fn(),
    createRedemption: jest.fn(),
    withTransaction: jest.fn(),
  };

  const mockVaultsRepository: IVaultsRepository = {
    findOneByRedemptionId: jest.fn(),
    findOneById: jest.fn(),
    updateOneById: jest.fn(),
    createMany: jest.fn(),
    create: jest.fn(),
    withTransaction: jest.fn(),
  };

  const mockVaultBatchesRepository: IVaultBatchesRepository = {
    create: jest.fn(),
    findByVaultId: jest.fn(),
    getCodesRemaining: jest.fn(),
    withTransaction: jest.fn(),
    updateOneById: jest.fn(),
    findOneById: jest.fn(),
    deleteById: jest.fn(),
  };

  const mockS3ClientProvider: IS3ClientProvider = {
    getClient: jest.fn(),
  };

  const mockS3SignedUrl: S3SignedUrl = {
    getPutObjectSignedUrl: jest.fn().mockResolvedValue(putObjectSignedUrl),
  };

  async function callService(testEvent: ParsedRequest): Promise<CreateVaultBatchResult | CreateVaultBatchError> {
    const transactionManager = new TransactionManager(connection);

    const service: CreateVaultBatchService = new CreateVaultBatchService(
      createSilentLogger(),
      as(mockRedemptionsRepository),
      mockVaultsRepository,
      mockVaultBatchesRepository,
      transactionManager,
      mockS3ClientProvider,
      mockS3SignedUrl,
    );
    return await service.createVaultBatch(testEvent);
  }

  function getExpectedError(message: string): CreateVaultBatchError {
    return {
      kind: 'Error',
      data: {
        message: message,
      },
    };
  }

  function getExpectedSuccess(batchId: string, vaultId: string): CreateVaultBatchResult {
    return {
      kind: 'Ok',
      data: {
        id: batchId,
        vaultId: vaultId,
        uploadUrl: putObjectSignedUrl,
      },
    };
  }

  /**
   * fail/error tests - legacy and standard vaultId's
   */

  it('should return kind "Error" when legacy vaultId is incorrectly formatted', async () => {
    const legacyVaultId = 'vault#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    const actual: CreateVaultBatchResult | CreateVaultBatchError = await callService(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - legacy vaultId is incorrectly formatted (vaultId=${legacyVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when legacy vaultId is missing companyId/offerId', async () => {
    const legacyVaultId = 'vault#12345#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    const actual: CreateVaultBatchResult | CreateVaultBatchError = await callService(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - legacy vaultId is missing companyId and/or offerId (vaultId=${legacyVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when legacy vaultId redemption record does not exist', async () => {
    const legacyVaultId = 'vault#12345-67890#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);

    const actual: CreateVaultBatchResult | CreateVaultBatchError = await callService(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - redemption does not exist for legacy vault (vaultId=${legacyVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when legacy vaultId vaults record does not exist', async () => {
    const legacyVaultId = 'vault#12345-67890#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemptionFactory.build());
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(null);

    const actual: CreateVaultBatchResult | CreateVaultBatchError = await callService(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - vault does not exist for legacy vault redemptionId (vaultId=${legacyVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when standard vaultId vaults record does not exist', async () => {
    const modernVaultId = `vlt-${faker.string.uuid()}`;
    const testEvent = getTestEvent(modernVaultId);

    mockVaultsRepository.findOneById = jest.fn().mockResolvedValue(null);

    const actual: CreateVaultBatchResult | CreateVaultBatchError = await callService(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - vault does not exist for standard vaultId (vaultId=${modernVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  /**
   * success tests - legacy and standard vaultId's
   */

  it('should return kind "Ok" when legacy vaultId redemptions and vaults records exist', async () => {
    const legacyVaultId = 'vault#12345-67890#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    const redemption = redemptionFactory.build();
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);

    const vault = vaultFactory.build({ redemptionId: redemption.id });
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vault);

    const vaultBatch = vaultBatchFactory.build({ vaultId: vault.id });
    mockVaultBatchesRepository.withTransaction = jest.fn().mockReturnValue({
      create: jest.fn().mockResolvedValue({ id: vaultBatch.id }),
    });

    const actual: CreateVaultBatchResult | CreateVaultBatchError = await callService(testEvent);

    const expected: CreateVaultBatchResult = getExpectedSuccess(vaultBatch.id, vault.id);

    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when standard vaultId vaults record exists', async () => {
    const vault = vaultFactory.build();
    mockVaultsRepository.findOneById = jest.fn().mockResolvedValue(vault);

    const vaultBatch = vaultBatchFactory.build({ vaultId: vault.id });
    mockVaultBatchesRepository.withTransaction = jest.fn().mockReturnValue({
      create: jest.fn().mockResolvedValue({ id: vaultBatch.id }),
    });

    const testEvent = getTestEvent(vault.id);
    const actual: CreateVaultBatchResult | CreateVaultBatchError = await callService(testEvent);

    const expected: CreateVaultBatchResult = getExpectedSuccess(vaultBatch.id, vault.id);

    expect(actual).toEqual(expected);
  });
});
