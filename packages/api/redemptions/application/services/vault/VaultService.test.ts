import { ILogger, ILoggerDetail } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import {
  DatabaseTransactionOperator,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { updateRedemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/updateRedemptionConfigEntity.factory';
import {
  newVaultEntityFactory,
  updateVaultEntityFactory,
  vaultEntityFactory,
} from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { vaultCreatedEventFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEvents.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { VaultCreatedEvent } from '../../controllers/eventBridge/vault/VaultCreatedController';
import {
  IRedemptionConfigRepository,
  RedemptionConfigEntity,
  UpdateRedemptionConfigEntity,
} from '../../repositories/RedemptionConfigRepository';
import { IVaultsRepository, NewVaultEntity, UpdateVaultEntity, VaultEntity } from '../../repositories/VaultsRepository';

import { UpdateRedemptionConfigEntityBuilder } from './builders/UpdateRedemptionConfigEntityBuilder';
import { VaultEntityBuilder } from './builders/VaultEntityBuilder';
import { VaultService } from './VaultService';

const mockRedemptionsConfigTransactionRepository: Partial<IRedemptionConfigRepository> = {};
const mockRedemptionConfigRepository: Partial<IRedemptionConfigRepository> = {};

const mockVaultsTransactionRepository: Partial<IVaultsRepository> = {};
const mockVaultsRepository: Partial<IVaultsRepository> = {};

const mockDatabaseTransactionOperator: Partial<DatabaseTransactionOperator> = {};

const stubTransactionManager: Partial<TransactionManager> = {
  withTransaction(callback) {
    return callback(as(mockDatabaseTransactionOperator));
  },
};

const mockUpdateRedemptionConfigEntityBuilder: Partial<UpdateRedemptionConfigEntityBuilder> = {};
const mockVaultEntityBuilder: Partial<VaultEntityBuilder> = {};

const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build();

const vaultEntity: VaultEntity = vaultEntityFactory.build();
const newVaultEntity: NewVaultEntity = newVaultEntityFactory.build();
const updateVaultEntity: UpdateVaultEntity = updateVaultEntityFactory.build();

const updateRedemptionConfigEntity: UpdateRedemptionConfigEntity = updateRedemptionConfigEntityFactory.build();

const vaultCreatedEvent: VaultCreatedEvent = vaultCreatedEventFactory.build({
  detail: {
    link: 'someLink',
    linkId: 12346,
  },
});

const vaultUpdatedEvent: VaultCreatedEvent = vaultCreatedEventFactory.build({
  detail: {
    link: 'someLink1',
    linkId: 7654,
  },
});

let mockLogger: ILogger<ILoggerDetail>;
let vaultService: VaultService;

beforeEach(() => {
  jest.resetAllMocks();
  mockRedemptionConfigRepository.withTransaction = jest
    .fn()
    .mockReturnValue(mockRedemptionsConfigTransactionRepository);
  mockVaultsRepository.withTransaction = jest.fn().mockReturnValue(mockVaultsTransactionRepository);
  mockLogger = createTestLogger();
  vaultService = new VaultService(
    mockLogger,
    as(mockRedemptionConfigRepository),
    as(mockVaultsRepository),
    as(stubTransactionManager),
    as(mockUpdateRedemptionConfigEntityBuilder),
    as(mockVaultEntityBuilder),
  );
});

describe('updateVault', () => {
  it('update vault if vault is found', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(vaultEntity);

    mockVaultEntityBuilder.buildUpdateVaultEntity = jest.fn().mockReturnValueOnce(updateVaultEntity);

    mockVaultsTransactionRepository.updateOneById = jest.fn().mockResolvedValueOnce('20');

    await vaultService.updateVault(vaultUpdatedEvent);

    expect(mockVaultsTransactionRepository.updateOneById).toHaveBeenCalledWith(vaultEntity.id, updateVaultEntity);
  });

  it('build UpdateVaultEntity if vault is found', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(vaultEntity);

    mockVaultEntityBuilder.buildUpdateVaultEntity = jest.fn().mockReturnValueOnce(updateVaultEntity);

    mockVaultsTransactionRepository.updateOneById = jest.fn().mockResolvedValueOnce('20');

    await vaultService.updateVault(vaultUpdatedEvent);

    expect(mockVaultEntityBuilder.buildUpdateVaultEntity).toHaveBeenCalledWith(
      vaultUpdatedEvent.detail,
      redemptionConfigEntity.id,
    );
  });

  it('creates new vault if no vault is found', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(null);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn().mockReturnValueOnce(newVaultEntity);

    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(vaultEntity);

    await vaultService.updateVault(vaultUpdatedEvent);

    expect(mockVaultsTransactionRepository.create).toHaveBeenCalledWith(newVaultEntity);
  });

  it('build NewVaultEntity if no vault is found', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(null);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn().mockReturnValueOnce(newVaultEntity);

    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(vaultEntity);

    await vaultService.updateVault(vaultUpdatedEvent);

    expect(mockVaultEntityBuilder.buildNewVaultEntity).toHaveBeenCalledWith(
      vaultUpdatedEvent.detail,
      redemptionConfigEntity.id,
    );
  });

  it('finds vault by redemptionId', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(vaultEntity);

    mockVaultEntityBuilder.buildUpdateVaultEntity = jest.fn().mockReturnValueOnce(updateVaultEntity);

    mockVaultsTransactionRepository.updateOneById = jest.fn().mockResolvedValueOnce('10');

    await vaultService.updateVault(vaultUpdatedEvent);

    expect(mockVaultsRepository.findOneByRedemptionId).toHaveBeenCalledWith(redemptionConfigEntity.id);
  });

  it('updates redemption with updateRedemptionConfigEntity and offerId', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(vaultEntity);

    mockVaultEntityBuilder.buildUpdateVaultEntity = jest.fn().mockReturnValueOnce(updateVaultEntity);

    mockVaultsTransactionRepository.updateOneById = jest.fn().mockResolvedValueOnce('10');

    await vaultService.updateVault(vaultUpdatedEvent);

    expect(mockRedemptionsConfigTransactionRepository.updateOneByOfferId).toHaveBeenCalledWith(
      vaultUpdatedEvent.detail.offerId,
      updateRedemptionConfigEntity,
    );
  });

  it('calls buildUpdateRedemptionConfigEntity to build UpdateRedemptionConfigEntity', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(vaultEntity);

    mockVaultEntityBuilder.buildUpdateVaultEntity = jest.fn().mockReturnValueOnce(updateVaultEntity);

    mockVaultsTransactionRepository.updateOneById = jest.fn().mockResolvedValueOnce('10');

    await vaultService.updateVault(vaultUpdatedEvent);

    expect(mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity).toHaveBeenCalledWith(
      vaultUpdatedEvent.detail.link,
    );
  });

  it('loads redemptionConfig by offerId', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(vaultEntity);

    mockVaultEntityBuilder.buildUpdateVaultEntity = jest.fn().mockReturnValueOnce(updateVaultEntity);

    mockVaultsTransactionRepository.updateOneById = jest.fn().mockResolvedValueOnce('10');

    await vaultService.updateVault(vaultUpdatedEvent);

    expect(mockRedemptionConfigRepository.findOneByOfferId).toHaveBeenCalledWith(vaultUpdatedEvent.detail.offerId);
  });

  it('throws error if failure to update vault', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(vaultEntity);

    mockVaultEntityBuilder.buildUpdateVaultEntity = jest.fn().mockReturnValueOnce(updateVaultEntity);

    mockVaultsTransactionRepository.updateOneById = jest.fn().mockResolvedValueOnce(null);

    mockLogger.error = jest.fn();

    await expect(() => vaultService.updateVault(vaultUpdatedEvent)).rejects.toThrow(
      `Vault update failed: No vaults were updated (offerId="${vaultUpdatedEvent.detail.offerId}")`,
    );

    expect(mockLogger.error).toHaveBeenCalledWith({
      context: {
        offerId: vaultUpdatedEvent.detail.offerId,
        updateVaultEntity,
      },
      message: 'Vault update failed: No vaults were updated',
    });
  });

  it('throws error if failure to create vault', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(updateRedemptionConfigEntity);

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValueOnce(null);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn().mockReturnValueOnce(newVaultEntity);

    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(null);

    mockLogger.error = jest.fn();

    await expect(() => vaultService.updateVault(vaultUpdatedEvent)).rejects.toThrow(
      `Vault create failed: No vaults were created (offerId="${vaultUpdatedEvent.detail.offerId}")`,
    );

    expect(mockLogger.error).toHaveBeenCalledWith({
      context: {
        offerId: vaultUpdatedEvent.detail.offerId,
        newVaultEntity,
      },
      message: 'Vault create failed: No vaults were created',
    });
  });

  it('throws error if failure to update redemption config entity', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);
    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest.fn().mockResolvedValueOnce(null);

    mockLogger.error = jest.fn();

    await expect(() => vaultService.updateVault(vaultUpdatedEvent)).rejects.toThrow(
      `Redemption update by offer id failed: No redemptions found (offerId="${vaultUpdatedEvent.detail.offerId}")`,
    );

    expect(mockLogger.error).toHaveBeenCalledWith({
      context: {
        offerId: vaultUpdatedEvent.detail.offerId,
        updateRedemptionConfigEntity: updateRedemptionConfigEntity,
      },
      message: 'Redemption update by offer id failed: No redemptions found',
    });
  });

  it('throws error if redemption config entity can not be found', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(null);

    mockLogger.error = jest.fn();

    await expect(() => vaultService.updateVault(vaultUpdatedEvent)).rejects.toThrow(
      `Redemption find one by offer id failed: No redemptions found (offerId="${vaultUpdatedEvent.detail.offerId}")`,
    );

    expect(mockLogger.error).toHaveBeenCalledWith({
      context: { offerId: vaultUpdatedEvent.detail.offerId },
      message: 'Redemption find one by offer id failed: Redemption not found',
    });
  });
});

describe('createVault', () => {
  it('throws error if create vaultEntity fails', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntity);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn().mockReturnValueOnce(vaultEntity);
    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(null);

    mockLogger.error = jest.fn();

    const offerId = vaultCreatedEvent.detail.offerId;

    await expect(() => vaultService.createVault(vaultCreatedEvent)).rejects.toThrow(
      `Vault create failed: No vaults were created (offerId="${offerId}")`,
    );

    expect(mockLogger.error).toHaveBeenCalledWith({
      context: { offerId: offerId, newVaultEntity: vaultEntity },
      message: `Vault create failed: No vaults were created`,
    });
  });

  it('creates new vaultEntity', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntity);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn().mockReturnValueOnce(vaultEntity);
    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(vaultEntity);

    await vaultService.createVault(vaultCreatedEvent);

    expect(mockVaultsTransactionRepository.create).toHaveBeenCalledWith(vaultEntity);
  });

  it('calls buildNewVaultEntity to build NewVaultEntity', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntity);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn();
    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(vaultEntity);

    await vaultService.createVault(vaultCreatedEvent);

    expect(mockVaultEntityBuilder.buildNewVaultEntity).toHaveBeenCalledWith(
      vaultCreatedEvent.detail,
      redemptionConfigEntity.id,
    );
  });

  it('calls updateOneByOfferId to update redemption config entity', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntity);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn();
    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(vaultEntity);

    await vaultService.createVault(vaultCreatedEvent);

    expect(mockRedemptionsConfigTransactionRepository.updateOneByOfferId).toHaveBeenCalledWith(
      vaultCreatedEvent.detail.offerId,
      updateRedemptionConfigEntity,
    );
  });

  it('calls buildUpdateRedemptionConfigEntity to build UpdateRedemptionConfigEntity', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);

    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntity);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn();
    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(vaultEntity);

    await vaultService.createVault(vaultCreatedEvent);

    expect(mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity).toHaveBeenCalledWith(
      vaultCreatedEvent.detail.link,
    );
  });

  it('throws error if failure to update redemption config entity', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest
      .fn()
      .mockReturnValueOnce(updateRedemptionConfigEntity);
    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest.fn().mockResolvedValueOnce(null);

    mockLogger.error = jest.fn();

    const offerId = vaultCreatedEvent.detail.offerId;
    await expect(() => vaultService.createVault(vaultCreatedEvent)).rejects.toThrow(
      `Redemption update by offer id failed: No redemptions found (offerId="${offerId}")`,
    );

    expect(mockLogger.error).toHaveBeenCalledWith({
      context: {
        offerId: vaultCreatedEvent.detail.offerId,
        updateRedemptionConfigEntity: updateRedemptionConfigEntity,
      },
      message: 'Redemption update by offer id failed: No redemptions found',
    });
  });

  it('throws error if redemption config entity can not be found', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(null);

    mockLogger.error = jest.fn();

    await expect(() => vaultService.createVault(vaultCreatedEvent)).rejects.toThrow(
      `Redemption find one by offer id failed: No redemptions found (offerId="${vaultCreatedEvent.detail.offerId}")`,
    );

    expect(mockLogger.error).toHaveBeenCalledWith({
      context: { offerId: vaultCreatedEvent.detail.offerId },
      message: 'Redemption find one by offer id failed: Redemption not found',
    });
  });

  it('loads the redemption config entity by offerId', async () => {
    mockRedemptionConfigRepository.findOneByOfferId = jest.fn().mockResolvedValueOnce(redemptionConfigEntity);
    mockUpdateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity = jest.fn();
    mockRedemptionsConfigTransactionRepository.updateOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntity);

    mockVaultEntityBuilder.buildNewVaultEntity = jest.fn();
    mockVaultsTransactionRepository.create = jest.fn().mockResolvedValueOnce(vaultEntity);

    await vaultService.createVault(vaultCreatedEvent);

    expect(mockRedemptionConfigRepository.findOneByOfferId).toHaveBeenCalledWith(vaultCreatedEvent.detail.offerId);
  });
});
