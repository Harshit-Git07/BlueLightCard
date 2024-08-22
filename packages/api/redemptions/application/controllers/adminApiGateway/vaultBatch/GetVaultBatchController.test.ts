import { IGetVaultBatchService } from '@blc-mono/redemptions/application/services/vault/GetVaultBatchService';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { GetVaultBatchController } from './GetVaultBatchController';

describe('GetVaultBatchController', () => {
  it('returns a successful response for a valid request', async () => {
    const VAULT_ID = 'my-vault-id';
    const vaultBatch = {
      id: 'vaultBatchId',
      vaultId: VAULT_ID,
      created: '2011-01-01T00:00:00Z',
      expiry: '2029-12-12T23:59:59Z',
      codesRemaining: 46,
    };
    const mockVaultBatchService = {
      getVaultBatch: jest.fn().mockResolvedValueOnce({ kind: 'Ok', data: [vaultBatch] }),
    } satisfies Partial<IGetVaultBatchService>;

    const controller = new GetVaultBatchController(createTestLogger(), mockVaultBatchService);

    const result = await controller.handle({
      pathParameters: {
        vaultId: VAULT_ID,
      },
    });

    expect(result).toStrictEqual({
      statusCode: 200,
      data: [vaultBatch],
    });
    expect(mockVaultBatchService.getVaultBatch).toHaveBeenCalledTimes(1);
    expect(mockVaultBatchService.getVaultBatch).toHaveBeenCalledWith(VAULT_ID);
  });

  it('returns a vault not found error when the vault is not available', async () => {
    const mockVaultBatchService = {
      getVaultBatch: jest.fn().mockResolvedValueOnce({ kind: 'VaultNotFound' }),
    } satisfies Partial<IGetVaultBatchService>;

    const controller = new GetVaultBatchController(createTestLogger(), mockVaultBatchService);

    const result = await controller.handle({
      pathParameters: {
        vaultId: 'my-vault-id',
      },
    });

    expect(result).toStrictEqual({
      statusCode: 404,
      data: {
        message: 'No Vault found with this id',
      },
    });
  });
});
