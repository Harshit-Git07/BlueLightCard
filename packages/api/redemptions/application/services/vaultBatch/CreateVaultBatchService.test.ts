import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import {
  DatabaseTransactionOperator,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { IS3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { ParsedRequest } from '../../controllers/adminApiGateway/vaultBatch/CreateVaultBatchController';
import { S3SignedUrl } from '../../helpers/S3SignedUrl';
import { IRedemptionConfigRepository } from '../../repositories/RedemptionConfigRepository';
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

const putObjectSignedUrl = 'https://stage-brand-vault-codes-upload.s3.amazonaws.com/bucket/key?sign-data';

function getTestEvent(vaultId: string) {
  return {
    pathParameters: {
      vaultId: vaultId,
    },
    body: {
      expiry: faker.date.future().setMilliseconds(0).toString(),
    },
  } satisfies ParsedRequest;
}

const mockRedemptionsRepository: Partial<IRedemptionConfigRepository> = {};

const mockVaultsRepository: Partial<IVaultsRepository> = {};

const mockVaultBatchesRepository: Partial<IVaultBatchesRepository> = {};
const mockVaultBatchesTransactionalRepository: Partial<IVaultBatchesRepository> = {};

const stubTransactionManager: Partial<TransactionManager> = {
  withTransaction(callback) {
    return callback(as(mockDatabaseTransactionOperator));
  },
};

const mockDatabaseTransactionOperator: Partial<DatabaseTransactionOperator> = {};

const mockS3ClientProvider: Partial<IS3ClientProvider> = {
  getClient: jest.fn(),
};

const mockS3SignedUrl: Partial<S3SignedUrl> = {};

const createVaultBatchService: CreateVaultBatchService = new CreateVaultBatchService(
  createSilentLogger(),
  as(mockRedemptionsRepository),
  as(mockVaultsRepository),
  as(mockVaultBatchesRepository),
  as(stubTransactionManager),
  as(mockS3ClientProvider),
  as(mockS3SignedUrl),
);

describe('CreateVaultBatchService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockVaultBatchesRepository.withTransaction = jest.fn().mockReturnValue(mockVaultBatchesTransactionalRepository);
  });

  /**
   * fail/error tests - legacy and standard vaultId's
   */

  it('should return kind "Error" when legacy vaultId is incorrectly formatted', async () => {
    const legacyVaultId = 'vault#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    const actual: CreateVaultBatchResult | CreateVaultBatchError =
      await createVaultBatchService.createVaultBatch(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - legacy vaultId is incorrectly formatted (vaultId=${legacyVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when legacy vaultId is missing companyId/offerId', async () => {
    const legacyVaultId = 'vault#12345#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    const actual: CreateVaultBatchResult | CreateVaultBatchError =
      await createVaultBatchService.createVaultBatch(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - legacy vaultId is missing companyId and/or offerId (vaultId=${legacyVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when legacy vaultId redemption record does not exist', async () => {
    const legacyVaultId = 'vault#12345-67890#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(null);

    const actual: CreateVaultBatchResult | CreateVaultBatchError =
      await createVaultBatchService.createVaultBatch(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - redemption does not exist for legacy vault (vaultId=${legacyVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when legacy vaultId vaults record does not exist', async () => {
    const legacyVaultId = 'vault#12345-67890#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemptionConfigEntityFactory.build());
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(null);

    const actual: CreateVaultBatchResult | CreateVaultBatchError =
      await createVaultBatchService.createVaultBatch(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - vault does not exist for legacy vault redemptionId (vaultId=${legacyVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when standard vaultId vaults record does not exist', async () => {
    const modernVaultId = `vlt-${faker.string.uuid()}`;
    const testEvent = getTestEvent(modernVaultId);

    mockVaultsRepository.findOneById = jest.fn().mockResolvedValue(null);

    const actual: CreateVaultBatchResult | CreateVaultBatchError =
      await createVaultBatchService.createVaultBatch(testEvent);

    const expected: CreateVaultBatchError = getExpectedError(
      `CreateVaultBatch - vault does not exist for standard vaultId (vaultId=${modernVaultId})`,
    );

    expect(actual).toEqual(expected);
  });

  // /**
  //  * success tests - legacy and standard vaultId's
  //  */

  it('should return kind "Ok" when legacy vaultId redemptions and vaults records exist', async () => {
    const legacyVaultId = 'vault#12345-67890#BLC';
    const testEvent = getTestEvent(legacyVaultId);

    const redemption = redemptionConfigEntityFactory.build();
    mockRedemptionsRepository.findOneByOfferId = jest.fn().mockResolvedValue(redemption);

    const vault = vaultEntityFactory.build({ redemptionId: redemption.id });
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vault);

    const vaultBatch = vaultBatchEntityFactory.build({ vaultId: vault.id });
    mockVaultBatchesTransactionalRepository.create = jest.fn().mockResolvedValue({ id: vaultBatch.id });

    mockS3SignedUrl.getPutObjectSignedUrl = jest.fn().mockResolvedValue(putObjectSignedUrl);

    const actual: CreateVaultBatchResult | CreateVaultBatchError =
      await createVaultBatchService.createVaultBatch(testEvent);

    const expected: CreateVaultBatchResult = getExpectedSuccess(vaultBatch.id, vault.id);

    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when standard vaultId vaults record exists', async () => {
    const vault = vaultEntityFactory.build();
    mockVaultsRepository.findOneById = jest.fn().mockResolvedValue(vault);

    const vaultBatch = vaultBatchEntityFactory.build({ vaultId: vault.id });
    mockVaultBatchesTransactionalRepository.create = jest.fn().mockResolvedValue({ id: vaultBatch.id });

    mockS3SignedUrl.getPutObjectSignedUrl = jest.fn().mockResolvedValue(putObjectSignedUrl);

    const testEvent = getTestEvent(vault.id);
    const actual: CreateVaultBatchResult | CreateVaultBatchError =
      await createVaultBatchService.createVaultBatch(testEvent);

    const expected: CreateVaultBatchResult = getExpectedSuccess(vaultBatch.id, vault.id);

    expect(actual).toEqual(expected);
  });
});

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
