import { faker } from '@faker-js/faker';

import {
  CreateVaultBatchError,
  CreateVaultBatchResult,
  ICreateVaultBatchService,
} from '@blc-mono/redemptions/application/services/vaultBatch/CreateVaultBatchService';

import { createTestLogger } from '../../../../libs/test/helpers/logger';

import { CreateVaultBatchController } from './CreateVaultBatchController';

describe('CreateVaultBatchController', () => {
  const testVaultId = `vlt-${faker.string.uuid()}`;

  const testEvent = {
    headers: {
      ContentType: 'application/json',
      XAPIKey: 'abcdefghijklmnopqurstuvwxyz',
    },
    body: {
      vaultId: testVaultId,
      expiry: faker.date.future().setMilliseconds(0).toString(),
    },
  };

  const testLogger = createTestLogger();

  const MockCreateVaultBatchService = {
    createVaultBatch: jest.fn(),
  } satisfies ICreateVaultBatchService;

  it('Maps "Ok" result correctly to 200 response', async () => {
    //arrange
    const testBatchId = `vbt-${faker.string.uuid()}`;
    MockCreateVaultBatchService.createVaultBatch.mockResolvedValue({
      kind: 'Ok',
      data: {
        id: testBatchId,
        vaultId: testVaultId,
        uploadUrl: `https://stage-brand-vault-codes-upload/${testVaultId}/${testBatchId}/${faker.date.soon()}.csv?signedData`,
      },
    } satisfies CreateVaultBatchResult);

    //act
    const controller = new CreateVaultBatchController(testLogger, MockCreateVaultBatchService);
    const actual = await controller.handle(testEvent);

    //assert
    expect(actual.statusCode).toEqual(200);
  });

  it('Maps "Error" result correctly to 404 response', async () => {
    //arrange
    MockCreateVaultBatchService.createVaultBatch.mockResolvedValue({
      kind: 'Error',
      data: {
        message: 'some sort of error has occurred',
      },
    } satisfies CreateVaultBatchError);

    //act
    const controller = new CreateVaultBatchController(testLogger, MockCreateVaultBatchService);
    const actual = await controller.handle(testEvent);

    //assert
    expect(actual.statusCode).toEqual(404);
  });
});
