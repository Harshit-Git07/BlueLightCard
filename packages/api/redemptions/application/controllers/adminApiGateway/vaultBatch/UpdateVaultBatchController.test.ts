import { IUpdateVaultBatchService } from '@blc-mono/redemptions/application/services/vaultBatch/UpdateVaultBatchService';
import { updateVaultBatchEventFactory } from '@blc-mono/redemptions/libs/test/factories/updateVaultBatch.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { UpdateVaultBatchController } from './UpdateVaultBatchController';

describe('UpdateVaultBatchController', () => {
  it.each([
    ['NoContent', undefined, 204],
    ['VaultBatchNotFound', 'Vault Batch not found', 404],
    ['VaultCodesNotFound', 'Vault Codes not found', 404],
    ['ErrorUpdatingVaultBatch', 'Vault Batch not updated', 400],
    ['ErrorUpdatingVaultCodes', 'Vault Codes not updated', 400],
  ])('it should return %s when %s with status code %d', async (kind, message, statusCode) => {
    // Arrange
    const logger = createTestLogger();
    const updateVaultBatchService = {
      handle: jest.fn().mockResolvedValue({
        kind,
        message,
      }),
    } satisfies IUpdateVaultBatchService;
    const controller = new UpdateVaultBatchController(logger, updateVaultBatchService);

    // Act
    const result = await controller.handle({
      body: { ...updateVaultBatchEventFactory.build() },
    });

    // Assert
    expect(result.statusCode).toEqual(statusCode);
    if (message) {
      expect(result?.data).toEqual({ message });
    }
  });
});
