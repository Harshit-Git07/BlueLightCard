import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { VaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { redeemVaultStrategyRedemptionDetailsFactory } from '@blc-mono/redemptions/libs/test/factories/redeemVaultStrategyRedemptionDetails.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemVaultStrategyRedemptionDetails } from '../IRedeemStrategy';

import { MaxPerUserReachedError } from './helpers/MaxPerUserReachedError';
import { RedeemStandardVaultHandler } from './RedeemStandardVaultHandler';
import { RedeemVaultStrategyRedemptionDetailsBuilder } from './RedeemVaultStrategyRedemptionDetailsBuilder';

const mockVaultCodesRepository: Partial<VaultCodesRepository> = {};
const mockRedeemVaultStrategyRedemptionDetailsBuilder: Partial<RedeemVaultStrategyRedemptionDetailsBuilder> = {};
const mockLgger: ILogger = createTestLogger();

const redeemStandardVaultHandler = new RedeemStandardVaultHandler(
  as(mockVaultCodesRepository),
  as(mockRedeemVaultStrategyRedemptionDetailsBuilder),
  mockLgger,
);

const vault: VaultEntity = vaultEntityFactory.build({ maxPerUser: 10 });
const redemptionType = 'vault';
const redemptionUrl = faker.internet.url();
const memberId: string = faker.string.uuid();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('handleRedeemStandardVault', () => {
  it('returns response from buildRedeemVaultStrategyRedemptionDetails', async () => {
    mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);

    const expectedClaimedCode = faker.string.alphanumeric(10);
    mockVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue({ code: expectedClaimedCode });

    const redeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails =
      redeemVaultStrategyRedemptionDetailsFactory.build();
    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest
      .fn()
      .mockReturnValue(redeemVaultStrategyRedemptionDetails);

    const actualResult = await redeemStandardVaultHandler.handleRedeemStandardVault(
      vault,
      redemptionType,
      redemptionUrl,
      memberId,
    );

    const expectedResult = {
      kind: 'Ok',
      redemptionType,
      redemptionDetails: redeemVaultStrategyRedemptionDetails,
    };
    expect(actualResult).toEqual(expectedResult);
  });

  it('calls buildRedeemVaultStrategyRedemptionDetails with correct details', async () => {
    mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
    const expectedClaimedCode = faker.string.alphanumeric(10);
    mockVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue({ code: expectedClaimedCode });
    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest.fn();

    await redeemStandardVaultHandler.handleRedeemStandardVault(vault, redemptionType, redemptionUrl, memberId);

    expect(
      mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails,
    ).toHaveBeenCalledWith(vault, redemptionType, redemptionUrl, memberId, expectedClaimedCode);
  });

  it('throws error is claimVaultCode returns undefinded', async () => {
    mockLgger.error = jest.fn();

    mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
    mockVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue(undefined);

    await expect(() =>
      redeemStandardVaultHandler.handleRedeemStandardVault(vault, redemptionType, redemptionUrl, memberId),
    ).rejects.toThrow('No vault code found');

    expect(mockLgger.error).toHaveBeenCalledWith({
      message: `No vault code found for standard vault with vaultId "${vault.id}", memberId "${memberId}"`,
      context: {
        vaultId: vault.id,
        memberId,
      },
    });
  });

  it('calls claimVaultCode with correct details', async () => {
    mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
    mockVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue({ code: faker.string.alphanumeric(10) });
    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest.fn();

    await redeemStandardVaultHandler.handleRedeemStandardVault(vault, redemptionType, redemptionUrl, memberId);

    expect(mockVaultCodesRepository.claimVaultCode).toHaveBeenCalledWith(vault.id, memberId);
  });

  it('throws an error when the user has claimed the maximum available codes ', async () => {
    mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(true);

    await expect(() =>
      redeemStandardVaultHandler.handleRedeemStandardVault(vault, redemptionType, redemptionUrl, memberId),
    ).rejects.toThrow(MaxPerUserReachedError);
  });

  it('calls checkIfMemberReachedMaxCodeClaimed with correct details', async () => {
    mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
    mockVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue({ code: faker.string.alphanumeric(10) });
    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest.fn();

    await redeemStandardVaultHandler.handleRedeemStandardVault(vault, redemptionType, redemptionUrl, memberId);

    expect(mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed).toHaveBeenCalledWith(
      vault.id,
      memberId,
      vault.maxPerUser,
    );
  });

  it('calls checkIfMemberReachedMaxCodeClaimed when maxPerUser is null', async () => {
    const vault: VaultEntity = vaultEntityFactory.build({ maxPerUser: null });

    mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed = jest.fn().mockResolvedValue(false);
    mockVaultCodesRepository.claimVaultCode = jest.fn().mockResolvedValue({ code: faker.string.alphanumeric(10) });
    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest.fn();

    await redeemStandardVaultHandler.handleRedeemStandardVault(vault, redemptionType, redemptionUrl, memberId);

    expect(mockVaultCodesRepository.checkIfMemberReachedMaxCodeClaimed).toHaveBeenCalledWith(vault.id, memberId, 0);
  });
});
