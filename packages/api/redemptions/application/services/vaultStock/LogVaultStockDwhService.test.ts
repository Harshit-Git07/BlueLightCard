import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { as } from '@blc-mono/core/utils/testing';
import {
  IDwhRepository,
  VaultBatchStockData,
  VaultStockData,
} from '@blc-mono/redemptions/application/repositories/DwhRepository';
import {
  IVaultStockRepository,
  VaultBatchStockRecord,
  VaultStockRecord,
} from '@blc-mono/redemptions/application/repositories/VaultStockRepository';
import { LogVaultStockDwhService } from '@blc-mono/redemptions/application/services/vaultStock/LogVaultStockDwhService';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

const testVaultStockRecords: VaultStockRecord[] = [
  {
    companyId: faker.string.uuid(),
    offerId: faker.string.uuid(),
    vaultId: faker.string.uuid(),
    email: faker.internet.email(),
    status: 'active',
    integration: 'whatever',
  },
];

const mockLogger = createSilentLogger();

const mockDwhRepository: Partial<IDwhRepository> = {
  logVaultStock: jest.fn(),
  logVaultBatchStock: jest.fn(),
};

const mockVaultStockRepository: Partial<IVaultStockRepository> = {
  findAllVaults: jest.fn(),
  countUnclaimedCodesForVault: jest.fn(),
  findBatchesForVault: jest.fn(),
};

const service = new LogVaultStockDwhService(mockLogger, as(mockVaultStockRepository), as(mockDwhRepository));

describe('GetVaultStockController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should exit and not call DwhRepository if no vaults exist to process', async () => {
    mockVaultStockRepository.findAllVaults = jest.fn().mockResolvedValue([]);

    await service.logVaultStock();

    expect(mockVaultStockRepository.findAllVaults).toHaveBeenCalledTimes(1);
    expect(mockVaultStockRepository.countUnclaimedCodesForVault).toHaveBeenCalledTimes(0);
    expect(mockVaultStockRepository.findBatchesForVault).toHaveBeenCalledTimes(0);

    expect(mockDwhRepository.logVaultStock).toHaveBeenCalledTimes(0);
    expect(mockDwhRepository.logVaultBatchStock).toHaveBeenCalledTimes(0);
  });

  it('should call DwhRepository logVaultStock if vaults exist, but not call logVaultBatchStock if batches do not exist', async () => {
    const unclaimedCodes = 0;
    mockVaultStockRepository.findAllVaults = jest.fn().mockResolvedValue(testVaultStockRecords);
    mockVaultStockRepository.countUnclaimedCodesForVault = jest.fn().mockResolvedValue(unclaimedCodes);
    mockVaultStockRepository.findBatchesForVault = jest.fn().mockResolvedValue([]);

    await service.logVaultStock();

    expect(mockVaultStockRepository.findAllVaults).toHaveBeenCalledTimes(1);
    expect(mockVaultStockRepository.countUnclaimedCodesForVault).toHaveBeenCalledTimes(1);
    expect(mockVaultStockRepository.findBatchesForVault).toHaveBeenCalledTimes(1);

    expect(mockDwhRepository.logVaultStock).toHaveBeenCalledTimes(1);
    expect(mockDwhRepository.logVaultStock).toHaveBeenCalledWith([
      {
        vaultId: testVaultStockRecords[0].vaultId,
        offerId: testVaultStockRecords[0].offerId,
        companyId: testVaultStockRecords[0].companyId,
        manager: testVaultStockRecords[0].email ?? '',
        unclaimed: unclaimedCodes,
        isActive: testVaultStockRecords[0].status === 'active' ? 'true' : 'false',
        vaultProvider: testVaultStockRecords[0].integration ?? '',
      },
    ] satisfies VaultStockData[]);
    expect(mockDwhRepository.logVaultBatchStock).toHaveBeenCalledTimes(0);
  });

  it('should call DwhRepository logVaultStock and logVaultBatchStock if vaults and batches exist', async () => {
    const unclaimedCodes = 1;

    const testVaultBatchStockRecords: VaultBatchStockRecord[] = [
      {
        batchId: faker.string.uuid(),
        expiry: new Date('2029-12-31T59:59:59.999Z'),
        unclaimed: unclaimedCodes,
      },
    ];

    mockVaultStockRepository.findAllVaults = jest.fn().mockResolvedValue(testVaultStockRecords);
    mockVaultStockRepository.countUnclaimedCodesForVault = jest.fn().mockResolvedValue(unclaimedCodes);
    mockVaultStockRepository.findBatchesForVault = jest.fn().mockResolvedValue(testVaultBatchStockRecords);

    await service.logVaultStock();

    expect(mockVaultStockRepository.findAllVaults).toHaveBeenCalledTimes(1);
    expect(mockVaultStockRepository.countUnclaimedCodesForVault).toHaveBeenCalledTimes(1);
    expect(mockVaultStockRepository.findBatchesForVault).toHaveBeenCalledTimes(1);

    expect(mockDwhRepository.logVaultStock).toHaveBeenCalledTimes(1);
    expect(mockDwhRepository.logVaultStock).toHaveBeenCalledWith([
      {
        vaultId: testVaultStockRecords[0].vaultId,
        offerId: testVaultStockRecords[0].offerId,
        companyId: testVaultStockRecords[0].companyId,
        manager: testVaultStockRecords[0].email ?? '',
        unclaimed: unclaimedCodes,
        isActive: testVaultStockRecords[0].status === 'active' ? 'true' : 'false',
        vaultProvider: testVaultStockRecords[0].integration ?? '',
      },
    ] satisfies VaultStockData[]);
    expect(mockDwhRepository.logVaultBatchStock).toHaveBeenCalledTimes(1);
    expect(mockDwhRepository.logVaultBatchStock).toHaveBeenCalledWith([
      {
        batchId: testVaultBatchStockRecords[0].batchId,
        offerId: testVaultStockRecords[0].offerId,
        companyId: testVaultStockRecords[0].companyId,
        batchExpires: testVaultBatchStockRecords[0].expiry,
        batchCount: testVaultBatchStockRecords[0].unclaimed,
      },
    ] satisfies VaultBatchStockData[]);
  });
});
