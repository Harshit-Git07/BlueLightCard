import { as } from '@blc-mono/core/utils/testing';
import { vaultFactory } from '@blc-mono/redemptions/libs/test/factories/vault.factory';
import { vaultBatchFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatches.factory';

import { IVaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository } from '../../repositories/VaultsRepository';

import GetVaultBatchService from './GetVaultBatchService';

describe('GetVaultBatchService', () => {
  it('returns vault batch information when provided a valid vaultId', async () => {
    //Arrange
    const vault = vaultFactory.build();
    const vaultBatches = vaultBatchFactory.buildList(3, {
      vaultId: vault.id,
    });

    const codesRemainingByBatch = {
      [vaultBatches[0].id]: 2,
      [vaultBatches[1].id]: 5,
      [vaultBatches[2].id]: 7,
    };

    const vaultsRepository = {
      findOneById: jest.fn().mockResolvedValue(vault),
    } satisfies Partial<IVaultsRepository>;
    const vaultBatchesRepository = {
      findByVaultId: jest.fn().mockResolvedValue(vaultBatches),
      getCodesRemaining: jest.fn((batchId) => Promise.resolve(codesRemainingByBatch[batchId])),
    } satisfies Partial<IVaultBatchesRepository>;

    const service = new GetVaultBatchService(as(vaultsRepository), as(vaultBatchesRepository));

    const expectedResult = [
      {
        batchId: vaultBatches[0].id,
        vaultId: vault.id,
        expiry: vaultBatches[0].expiry.toISOString(),
        created: vaultBatches[0].created.toISOString(),
        codesRemaining: codesRemainingByBatch[vaultBatches[0].id],
      },
      {
        batchId: vaultBatches[1].id,
        vaultId: vault.id,
        expiry: vaultBatches[1].expiry.toISOString(),
        created: vaultBatches[1].created.toISOString(),
        codesRemaining: codesRemainingByBatch[vaultBatches[1].id],
      },
      {
        batchId: vaultBatches[2].id,
        vaultId: vault.id,
        expiry: vaultBatches[2].expiry.toISOString(),
        created: vaultBatches[2].created.toISOString(),
        codesRemaining: codesRemainingByBatch[vaultBatches[2].id],
      },
    ];

    //Act
    const result = await service.getVaultBatch(vault.id);

    //Assert
    expect(result.kind).toBe('Ok');
    expect(result.data).toStrictEqual(expectedResult);
    expect(vaultsRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(vaultBatchesRepository.findByVaultId).toHaveBeenCalledWith(vault.id);
    expect(vaultBatchesRepository.getCodesRemaining).toHaveBeenCalledTimes(3);
  });

  it('returns an error if a vault cannot be found', async () => {
    //Arrange
    const vaultsRepository = {
      findOneById: jest.fn().mockResolvedValue(null),
    } satisfies Partial<IVaultsRepository>;
    const vaultBatchesRepository = {} satisfies Partial<IVaultBatchesRepository>;

    const service = new GetVaultBatchService(as(vaultsRepository), as(vaultBatchesRepository));

    //Act
    const result = await service.getVaultBatch('invalid-vaultId');

    //Assert
    expect(result.kind).toBe('VaultNotFound');
  });

  it('returns an empty array if there are no batches found for the given vaultId', async () => {
    //Arrange
    const vault = vaultFactory.build();

    const vaultsRepository = {
      findOneById: jest.fn().mockResolvedValue(vault),
    } satisfies Partial<IVaultsRepository>;
    const vaultBatchesRepository = {
      findByVaultId: jest.fn().mockResolvedValue([]),
      getCodesRemaining: jest.fn(),
    } satisfies Partial<IVaultBatchesRepository>;

    const service = new GetVaultBatchService(as(vaultsRepository), as(vaultBatchesRepository));

    //Act
    const result = await service.getVaultBatch(vault.id);

    //Assert
    expect(result.kind).toBe('Ok');
    expect(result.data).toStrictEqual([]);
    expect(vaultsRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(vaultBatchesRepository.findByVaultId).toHaveBeenCalledWith(vault.id);
    expect(vaultBatchesRepository.getCodesRemaining).not.toHaveBeenCalled();
  });
});
