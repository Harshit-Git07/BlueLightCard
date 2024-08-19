import { faker } from '@faker-js/faker';

import { VaultBatchCreatedEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/vaultBatch/VaultBatchCreatedController';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedemptionsVaultBatchEvents } from '../../../infrastructure/eventBridge/events/vaultBatch';
import { IAdminEmailRepository } from '../../repositories/AdminEmailRepository';
import { IVaultsRepository } from '../../repositories/VaultsRepository';

import { VaultBatchCreatedService } from './VaultBatchCreatedService';

const mockEmailRepository = {
  sendVaultThresholdEmail: jest.fn(),
  sendVaultBatchCreatedEmail: jest.fn(),
} satisfies IAdminEmailRepository;

const mockEvent = {
  id: faker.string.uuid(),
  version: '0',
  account: faker.string.numeric(12),
  time: faker.date.recent().toISOString(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: [RedemptionsVaultBatchEvents.BATCH_CREATED],
  source: RedemptionsVaultBatchEvents.BATCH_CREATED,
  'detail-type': RedemptionsVaultBatchEvents.BATCH_CREATED_DETAIL,
  detail: {
    vaultId: `vlt-${faker.string.uuid()}`,
    batchId: `vbt-${faker.string.uuid()}`,
    fileName: faker.string.alpha(5),
    countCodeInsertSuccess: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
    countCodeInsertFail: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
    codeInsertFailArray: [],
  },
} satisfies VaultBatchCreatedEvent;

function mockVaultsRepository(): IVaultsRepository {
  return {
    findOneByRedemptionId: jest.fn(),
    findOneById: jest.fn(),
    updateOneById: jest.fn(),
    createMany: jest.fn(),
    create: jest.fn(),
    withTransaction: jest.fn(),
  } satisfies IVaultsRepository;
}

describe('VaultBatchCreatedService', () => {
  it('should send email for vaultBatchCreated events', async () => {
    const logger = createTestLogger();

    //mock the return value for admin email as is an optional value
    const mockedVaultsRepo = mockVaultsRepository();
    mockedVaultsRepo.findOneById = jest.fn().mockReturnValue({
      email: 'vaultManager@email.co.uk',
    });

    const service = new VaultBatchCreatedService(logger, mockEmailRepository, mockedVaultsRepo);

    await service.vaultBatchCreated(mockEvent);

    expect(mockEmailRepository.sendVaultBatchCreatedEmail).toHaveBeenCalled();
  });

  it('should throw for vault manager email missing for vaultBatchCreated events', async () => {
    const logger = createSilentLogger();

    //mock the return value for admin email as is an optional value
    const mockedVaultsRepo = mockVaultsRepository();
    mockedVaultsRepo.findOneById = jest.fn().mockReturnValue({
      email: null,
    });

    const service = new VaultBatchCreatedService(logger, mockEmailRepository, mockedVaultsRepo);

    await expect(service.vaultBatchCreated(mockEvent)).rejects.toThrow();
  });

  it('should throw for vault not exist for vaultBatchCreated events', async () => {
    const logger = createSilentLogger();

    const mockedVaultsRepo = mockVaultsRepository();

    const service = new VaultBatchCreatedService(logger, mockEmailRepository, mockedVaultsRepo);

    await expect(service.vaultBatchCreated(mockEvent)).rejects.toThrow();
  });
});
