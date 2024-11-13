import { as } from '@blc-mono/core/utils/testing';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';

import { IVaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository } from '../../repositories/VaultsRepository';

import GetVaultBatchService from './GetVaultBatchService';

describe('GetVaultBatchService', () => {
  it('returns vault batch information when provided a valid vaultId', async () => {
    //Arrange
    const vault = vaultEntityFactory.build();

    const vaultBatchOne = vaultBatchEntityFactory.build({
      vaultId: vault.id,
      created: new Date('2021-01-01T00:00:00Z'),
    });
    const vaultBatchTwo = vaultBatchEntityFactory.build({
      vaultId: vault.id,
      created: new Date('2021-01-02T00:00:00Z'),
    });
    const vaultBatchThree = vaultBatchEntityFactory.build({
      vaultId: vault.id,
      created: new Date('2021-01-03T00:00:00Z'),
    });

    const vaultBatches = [vaultBatchThree, vaultBatchOne, vaultBatchTwo];

    const codesRemainingByBatch = {
      [vaultBatchOne.id]: 2,
      [vaultBatchTwo.id]: 5,
      [vaultBatchThree.id]: 7,
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
        batchId: vaultBatchOne.id,
        vaultId: vault.id,
        expiry: vaultBatchOne.expiry.toISOString(),
        created: vaultBatchOne.created.toISOString(),
        codesRemaining: codesRemainingByBatch[vaultBatchOne.id],
      },
      {
        batchId: vaultBatchTwo.id,
        vaultId: vault.id,
        expiry: vaultBatchTwo.expiry.toISOString(),
        created: vaultBatchTwo.created.toISOString(),
        codesRemaining: codesRemainingByBatch[vaultBatchTwo.id],
      },
      {
        batchId: vaultBatchThree.id,
        vaultId: vault.id,
        expiry: vaultBatchThree.expiry.toISOString(),
        created: vaultBatchThree.created.toISOString(),
        codesRemaining: codesRemainingByBatch[vaultBatchThree.id],
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
    const vault = vaultEntityFactory.build();

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
