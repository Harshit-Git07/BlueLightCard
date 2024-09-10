import { faker } from '@faker-js/faker';

import {
  DeleteVaultBatchError,
  DeleteVaultBatchResult,
  IDeleteVaultBatchService,
} from '@blc-mono/redemptions/application/services/vaultBatch/DeleteVaultBatchService';

import { createTestLogger } from '../../../../libs/test/helpers/logger';

import { DeleteVaultBatchController } from './DeleteVaultBatchController';

describe('DeleteVaultBatchController', () => {
  const testBatchId = faker.string.uuid();

  const testEvent = {
    headers: {
      ContentType: 'application/json',
      XAPIKey: 'abcdefghijklmnopqurstuvwxyz',
    },
    body: {
      batchId: testBatchId,
    },
  };

  const logger = createTestLogger();

  const DeleteVaultBatchService = {
    deleteVaultBatch: jest.fn(),
  } satisfies IDeleteVaultBatchService;

  it('Maps "Ok" result correctly to 200 response', async () => {
    //arrange
    DeleteVaultBatchService.deleteVaultBatch.mockResolvedValue({
      kind: 'Ok',
      data: {
        vaultBatchId: testBatchId,
        vaultBatchDeleted: false,
        vaultCodesDeleted: false,
        countCodesDeleted: faker.number.int({
          min: 0,
          max: 1000,
        }),
        message: faker.string.alpha({
          length: 10,
        }),
      },
    } satisfies DeleteVaultBatchResult);

    //act
    const controller = new DeleteVaultBatchController(logger, DeleteVaultBatchService);
    const actual = await controller.handle(testEvent);

    //assert
    expect(actual.statusCode).toEqual(200);
  });

  it('Maps "Error" result correctly to 404 response', async () => {
    //arrange
    DeleteVaultBatchService.deleteVaultBatch.mockResolvedValue({
      kind: 'Error',
      data: {
        message: faker.string.alpha({
          length: 10,
        }),
      },
    } satisfies DeleteVaultBatchError);

    //act
    const controller = new DeleteVaultBatchController(logger, DeleteVaultBatchService);
    const actual = await controller.handle(testEvent);

    //assert
    expect(actual.statusCode).toEqual(404);
  });
});
