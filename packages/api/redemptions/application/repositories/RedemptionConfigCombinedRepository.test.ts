import { as } from '@blc-mono/core/utils/testing';
import { ballotEntityFactory } from '@blc-mono/redemptions/libs/test/factories/ballotEntity.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';

import { BallotsRepository } from './BallotsRepository';
import { GenericsRepository } from './GenericsRepository';
import { RedemptionConfigCombinedRepository } from './RedemptionConfigCombinedRepository';
import { IRedemptionConfigRepository, RedemptionConfigEntity } from './RedemptionConfigRepository';
import { VaultBatchesRepository } from './VaultBatchesRepository';
import { VaultsRepository } from './VaultsRepository';

const mockRedemptionConfigRepository: Partial<IRedemptionConfigRepository> = {
  createRedemption: jest.fn(),
  findOneById: jest.fn(),
  findOneByOfferId: jest.fn(),
  deleteById: jest.fn(),
};

const mockVaultsRepository: Partial<VaultsRepository> = {
  findOneByRedemptionId: jest.fn(),
  deleteById: jest.fn(),
};

const mockBallotsRepository: Partial<BallotsRepository> = {
  findOneByRedemptionId: jest.fn(),
  deleteById: jest.fn(),
};

const mockVaultBatchesRepository: Partial<VaultBatchesRepository> = {
  deleteByVaultId: jest.fn(),
  deleteById: jest.fn(),
};

const mockGenericsRepository: Partial<GenericsRepository> = {
  deleteByRedemptionId: jest.fn(),
};

const redemptionConfigCombinedRepository = new RedemptionConfigCombinedRepository(
  as(mockRedemptionConfigRepository),
  as(mockVaultsRepository),
  as(mockVaultBatchesRepository),
  as(mockGenericsRepository),
  as(mockBallotsRepository),
);

const redemptionConfigEntityOne: RedemptionConfigEntity = redemptionConfigEntityFactory.build();
const redemptionConfigEntityTwo: RedemptionConfigEntity = redemptionConfigEntityFactory.build();
const redemptionConfigEntityThree: RedemptionConfigEntity = redemptionConfigEntityFactory.build();

const vaultEntityOne = vaultEntityFactory.build();
const vaultEntityTwo = vaultEntityFactory.build();
const vaultEntityThree = vaultEntityFactory.build();

const ballotEntityOne = ballotEntityFactory.build();
const ballotEntityTwo = ballotEntityFactory.build();
const ballotEntityThree = ballotEntityFactory.build();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('deleteRedemptionsFromDatabaseByOfferIds', () => {
  test('should delete all vaultBatches for redemptions with offerId', async () => {
    const offerIds = ['1', '2', '3'];

    mockRedemptionConfigRepository.findOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntityOne)
      .mockResolvedValueOnce(redemptionConfigEntityTwo)
      .mockResolvedValueOnce(redemptionConfigEntityThree);

    mockVaultsRepository.findOneByRedemptionId = jest
      .fn()
      .mockResolvedValueOnce(vaultEntityOne)
      .mockResolvedValueOnce(vaultEntityTwo)
      .mockResolvedValueOnce(vaultEntityThree);

    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds(offerIds);

    expect(mockVaultBatchesRepository.deleteByVaultId).toHaveBeenCalledTimes(3);
    expect(mockVaultBatchesRepository.deleteByVaultId).toHaveBeenCalledWith(vaultEntityOne.id);
    expect(mockVaultBatchesRepository.deleteByVaultId).toHaveBeenCalledWith(vaultEntityTwo.id);
    expect(mockVaultBatchesRepository.deleteByVaultId).toHaveBeenCalledWith(vaultEntityThree.id);
  });

  test('should delete all vaults for redemptions with offerId', async () => {
    const offerIds = ['1', '2', '3'];

    mockRedemptionConfigRepository.findOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntityOne)
      .mockResolvedValueOnce(redemptionConfigEntityTwo)
      .mockResolvedValueOnce(redemptionConfigEntityThree);

    mockVaultsRepository.findOneByRedemptionId = jest
      .fn()
      .mockResolvedValueOnce(vaultEntityOne)
      .mockResolvedValueOnce(vaultEntityTwo)
      .mockResolvedValueOnce(vaultEntityThree);

    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds(offerIds);

    expect(mockVaultsRepository.deleteById).toHaveBeenCalledTimes(3);
    expect(mockVaultsRepository.deleteById).toHaveBeenCalledWith(vaultEntityOne.id);
    expect(mockVaultsRepository.deleteById).toHaveBeenCalledWith(vaultEntityTwo.id);
    expect(mockVaultsRepository.deleteById).toHaveBeenCalledWith(vaultEntityThree.id);
  });

  test('should find all vaults for redemptions with offerId', async () => {
    const offerIds = ['1', '2', '3'];

    mockRedemptionConfigRepository.findOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntityOne)
      .mockResolvedValueOnce(redemptionConfigEntityTwo)
      .mockResolvedValueOnce(redemptionConfigEntityThree);

    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds(offerIds);

    expect(mockVaultsRepository.findOneByRedemptionId).toHaveBeenCalledTimes(3);
    expect(mockVaultsRepository.findOneByRedemptionId).toHaveBeenCalledWith(redemptionConfigEntityOne.id);
    expect(mockVaultsRepository.findOneByRedemptionId).toHaveBeenCalledWith(redemptionConfigEntityTwo.id);
    expect(mockVaultsRepository.findOneByRedemptionId).toHaveBeenCalledWith(redemptionConfigEntityThree.id);
  });

  test('should delete all redemptions for all offerIds', async () => {
    const offerIds = ['1', '2', '3'];

    mockRedemptionConfigRepository.findOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntityOne)
      .mockResolvedValueOnce(redemptionConfigEntityTwo)
      .mockResolvedValueOnce(redemptionConfigEntityThree);

    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds(offerIds);

    expect(mockRedemptionConfigRepository.deleteById).toHaveBeenCalledTimes(3);
    expect(mockRedemptionConfigRepository.deleteById).toHaveBeenCalledWith(redemptionConfigEntityOne.id);
    expect(mockRedemptionConfigRepository.deleteById).toHaveBeenCalledWith(redemptionConfigEntityTwo.id);
    expect(mockRedemptionConfigRepository.deleteById).toHaveBeenCalledWith(redemptionConfigEntityThree.id);
  });

  test('should delete generics for all offerIds', async () => {
    const offerIds = ['1', '2', '3'];

    mockRedemptionConfigRepository.findOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntityOne)
      .mockResolvedValueOnce(redemptionConfigEntityTwo)
      .mockResolvedValueOnce(redemptionConfigEntityThree);

    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds(offerIds);

    expect(mockGenericsRepository.deleteByRedemptionId).toHaveBeenCalledTimes(3);
    expect(mockGenericsRepository.deleteByRedemptionId).toHaveBeenCalledWith(redemptionConfigEntityOne.id);
    expect(mockGenericsRepository.deleteByRedemptionId).toHaveBeenCalledWith(redemptionConfigEntityTwo.id);
    expect(mockGenericsRepository.deleteByRedemptionId).toHaveBeenCalledWith(redemptionConfigEntityThree.id);
  });

  test('should do nothing more if no redemption config is found', async () => {
    const offerIds = ['1'];

    mockRedemptionConfigRepository.findOneById = jest.fn().mockResolvedValue(null);

    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds(offerIds);

    expect(mockVaultsRepository.findOneByRedemptionId).not.toHaveBeenCalled();
    expect(mockVaultBatchesRepository.deleteByVaultId).not.toHaveBeenCalled();
    expect(mockVaultsRepository.deleteById).not.toHaveBeenCalled();
    expect(mockGenericsRepository.deleteByRedemptionId).not.toHaveBeenCalled();
    expect(mockRedemptionConfigRepository.deleteById).not.toHaveBeenCalled();
  });

  test('should call findOneByOfferId for all offerIds', async () => {
    const offerIds = ['1', '2', '3'];

    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds(offerIds);

    expect(mockRedemptionConfigRepository.findOneByOfferId).toHaveBeenCalledTimes(3);
    expect(mockRedemptionConfigRepository.findOneByOfferId).toHaveBeenCalledWith('1');
    expect(mockRedemptionConfigRepository.findOneByOfferId).toHaveBeenCalledWith('2');
    expect(mockRedemptionConfigRepository.findOneByOfferId).toHaveBeenCalledWith('3');
  });

  test('should do nothing if there is no offerIds', async () => {
    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds([]);

    expect(mockRedemptionConfigRepository.findOneByOfferId).not.toHaveBeenCalled();
  });

  test('should delete all ballots for redemptions with offerId', async () => {
    const offerIds = ['1', '2', '3'];

    mockRedemptionConfigRepository.findOneByOfferId = jest
      .fn()
      .mockResolvedValueOnce(redemptionConfigEntityOne)
      .mockResolvedValueOnce(redemptionConfigEntityTwo)
      .mockResolvedValueOnce(redemptionConfigEntityThree);

    mockBallotsRepository.findOneByRedemptionId = jest
      .fn()
      .mockResolvedValueOnce(ballotEntityOne)
      .mockResolvedValueOnce(ballotEntityTwo)
      .mockResolvedValueOnce(ballotEntityThree);

    await redemptionConfigCombinedRepository.deleteRedemptionsFromDatabaseByOfferIds(offerIds);

    expect(mockBallotsRepository.deleteById).toHaveBeenCalledTimes(3);
    expect(mockBallotsRepository.deleteById).toHaveBeenCalledWith(ballotEntityOne.id);
    expect(mockBallotsRepository.deleteById).toHaveBeenCalledWith(ballotEntityTwo.id);
    expect(mockBallotsRepository.deleteById).toHaveBeenCalledWith(ballotEntityThree.id);
  });
});
