import { faker } from '@faker-js/faker';

import { as } from '@blc-mono/core/utils/testing';
import { IVaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { IVaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import {
  DatabaseTransactionOperator,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultCodeEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCodeEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { ParsedRequest } from '../../controllers/adminApiGateway/vaultBatch/DeleteVaultBatchController';

import { DeleteVaultBatchError, DeleteVaultBatchResult, DeleteVaultBatchService } from './DeleteVaultBatchService';

const testBatchId = faker.string.uuid();

const testEvent = {
  pathParameters: {
    batchId: testBatchId,
  },
} satisfies ParsedRequest;

const mockVaultBatchesRepository: Partial<IVaultBatchesRepository> = {
  create: jest.fn(),
  findByVaultId: jest.fn(),
  getCodesRemaining: jest.fn(),
  withTransaction: jest.fn(),
  updateOneById: jest.fn(),
  findOneById: jest.fn(),
  deleteById: jest.fn(),
};

const mockVaultCodesRepository: IVaultCodesRepository = {
  findManyByBatchId: jest.fn(),
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

const stubTransactionManager: Partial<TransactionManager> = {
  withTransaction(callback) {
    return callback(as(mockDatabaseTransactionOperator));
  },
};

const mockDatabaseTransactionOperator: Partial<DatabaseTransactionOperator> = {};

const mockLogger = createTestLogger();

const deleteVaultBatchService = new DeleteVaultBatchService(
  mockLogger,
  as(mockVaultBatchesRepository),
  mockVaultCodesRepository,
  as(stubTransactionManager),
);

describe('DeleteVaultBatchService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return kind "Error" when the batch ID does not exist', async () => {
    //mock that batch ID does not exist
    mockBatchExist(false);

    //call the service
    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    //we expect the service to return an error with appropriate message as to why/what failed
    const expected: DeleteVaultBatchError = getExpectedError('the vault batch does not exist');

    //assess service returns what we expect under the above conditions
    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the batch exists, there are no unclaimed or claimed codes, and delete batch fails', async () => {
    //set up mocks
    mockBatchExist(true);
    mockNoCodesForBatch();
    mockDeleteBatchSucceeds(false);

    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    const expected: DeleteVaultBatchError = getExpectedError('there are no codes to delete, batch failed deletion');

    expect(actual).toEqual(expected);
  });

  it('should return kind "OK" when the batch exists, there are no unclaimed or claimed codes, and delete batch succeeds', async () => {
    //set up mocks
    mockBatchExist(true);
    mockNoCodesForBatch();
    mockDeleteBatchSucceeds(true);

    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    const expected: DeleteVaultBatchResult = getExpectedSuccess(
      true,
      false,
      0,
      'there are no codes to delete, batch successfully deleted',
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the batch exists, there are only unclaimed codes, and delete codes fails', async () => {
    //set up mocks
    mockBatchExist(true);
    mockUnclaimedCodesOnlyForBatchDeleteSucceeds(false);

    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    const expected: DeleteVaultBatchError = getExpectedError('deletion of codes failed, batch has not been deleted');

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the batch exists, there are only unclaimed codes, and delete batch fails', async () => {
    //set up mocks
    mockBatchExist(true);
    mockUnclaimedCodesOnlyForBatchDeleteSucceeds(true);
    mockDeleteBatchSucceeds(false);

    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    const expected: DeleteVaultBatchError = getExpectedError(
      'deletion of codes succeeded, but deletion of the batch failed',
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "OK" when the batch exists, there are only unclaimed codes, and delete codes and batch succeeds', async () => {
    //set up mocks
    mockBatchExist(true);
    mockUnclaimedCodesOnlyForBatchDeleteSucceeds(true);
    mockDeleteBatchSucceeds(true);

    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    const expected: DeleteVaultBatchResult = getExpectedSuccess(
      true,
      true,
      1,
      'the batch and codes were successfully deleted',
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the batch exists, there are claimed and unclaimed codes, and delete unclaimed codes fails', async () => {
    //set up mocks
    mockBatchExist(true);
    mockClaimedAndUnclaimedCodesForBatchDeleteUnclaimedSucceeds(false);

    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    const expected: DeleteVaultBatchError = getExpectedError(
      'batch was not deleted as it has 1 claimed code(s), unclaimed codes failed deletion',
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when the batch exists, there are claimed and unclaimed codes, and delete unclaimed codes succeeds', async () => {
    //mock that batch exists
    mockBatchExist(true);
    mockClaimedAndUnclaimedCodesForBatchDeleteUnclaimedSucceeds(true);

    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    const expected: DeleteVaultBatchResult = getExpectedSuccess(
      false,
      true,
      1,
      'batch was not deleted as it has 1 claimed code(s), unclaimed codes successfully deleted',
    );

    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when the batch exists, there are only claimed codes, and nothing is deleted', async () => {
    //set up mocks
    mockBatchExist(true);
    mockClaimedCodesOnly();

    const actual: DeleteVaultBatchResult | DeleteVaultBatchError =
      await deleteVaultBatchService.deleteVaultBatch(testEvent);

    const expected: DeleteVaultBatchResult = getExpectedSuccess(
      false,
      false,
      0,
      'batch has 1 claimed codes only, nothing deleted',
    );

    expect(actual).toEqual(expected);
  });
});

function mockBatchExist(exist: boolean): void {
  const value = exist ? vaultBatchEntityFactory.build({ id: testBatchId }) : null;
  mockVaultBatchesRepository.findOneById = jest.fn().mockResolvedValue(value);
}

function mockDeleteBatchSucceeds(success: boolean): void {
  const value = success ? [{ id: testBatchId }] : [];
  mockVaultBatchesRepository.withTransaction = jest.fn().mockReturnValue({
    deleteById: jest.fn().mockResolvedValue(value),
  });
}

function mockNoCodesForBatch(): void {
  mockVaultCodesRepository.withTransaction = jest.fn().mockReturnValue({
    findUnclaimedCodesByBatchId: jest.fn().mockResolvedValue([]),
    findClaimedCodesByBatchId: jest.fn().mockResolvedValue([]),
  });
}

function mockUnclaimedCodesOnlyForBatchDeleteSucceeds(success: boolean): void {
  const unclaimedCode = vaultCodeEntityFactory.build({
    batchId: testBatchId,
    memberId: null,
  });
  const value = success ? [{ id: unclaimedCode.id }] : [];
  mockVaultCodesRepository.withTransaction = jest.fn().mockReturnValue({
    findUnclaimedCodesByBatchId: jest.fn().mockResolvedValue([unclaimedCode]),
    findClaimedCodesByBatchId: jest.fn().mockResolvedValue([]),
    deleteUnclaimedCodesByBatchId: jest.fn().mockResolvedValue(value),
  });
}

function mockClaimedCodesOnly(): void {
  const claimedCode = vaultCodeEntityFactory.build({
    batchId: testBatchId,
    memberId: '123456',
  });
  mockVaultCodesRepository.withTransaction = jest.fn().mockReturnValue({
    findUnclaimedCodesByBatchId: jest.fn().mockResolvedValue([]),
    findClaimedCodesByBatchId: jest.fn().mockResolvedValue([claimedCode]),
  });
}

function mockClaimedAndUnclaimedCodesForBatchDeleteUnclaimedSucceeds(success: boolean): void {
  const unclaimedCode = vaultCodeEntityFactory.build({
    batchId: testBatchId,
    memberId: null,
  });
  const claimedCode = vaultCodeEntityFactory.build({
    batchId: testBatchId,
    memberId: '123456',
  });
  const value = success ? [{ id: unclaimedCode.id }] : [];
  mockVaultCodesRepository.withTransaction = jest.fn().mockReturnValue({
    findUnclaimedCodesByBatchId: jest.fn().mockResolvedValue([unclaimedCode]),
    findClaimedCodesByBatchId: jest.fn().mockResolvedValue([claimedCode]),
    deleteUnclaimedCodesByBatchId: jest.fn().mockResolvedValue(value),
  });
}

function getExpectedError(message: string): DeleteVaultBatchError {
  return {
    kind: 'Error',
    data: {
      message: `Vault Batch Delete - ${message}`,
    },
  };
}

function getExpectedSuccess(
  batchDeleted: boolean,
  codesDeleted: boolean,
  countCodesDeleted: number,
  message: string,
): DeleteVaultBatchResult {
  return {
    kind: 'Ok',
    data: {
      vaultBatchId: testBatchId,
      vaultBatchDeleted: batchDeleted,
      vaultCodesDeleted: codesDeleted,
      countCodesDeleted: countCodesDeleted,
      message: `Vault Batch Delete - ${message}`,
    },
  };
}
