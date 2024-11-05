import { faker } from '@faker-js/faker';

import * as getEnv from '@blc-mono/core/utils/getEnv';
import { as } from '@blc-mono/core/utils/testing';
import {
  AssignCodeToMemberData,
  ILegacyVaultApiRepository,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { IVaultsRepository, VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { redeemVaultStrategyRedemptionDetailsFactory } from '@blc-mono/redemptions/libs/test/factories/redeemVaultStrategyRedemptionDetails.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemVaultStrategyRedemptionDetails, RedeemVaultStrategyResult } from '../IRedeemStrategy';

import { MaxPerUserReachedError } from './helpers/MaxPerUserReachedError';
import { RedeemLegacyVaultHandler } from './RedeemLegacyVaultHandler';
import { RedeemStandardVaultHandler } from './RedeemStandardVaultHandler';
import { RedeemVaultStrategyRedemptionDetailsBuilder } from './RedeemVaultStrategyRedemptionDetailsBuilder';

jest.mock('@blc-mono/core/utils/getEnv');

const mockLegacyVaultApiRepository: Partial<ILegacyVaultApiRepository> = {};
const mockVaultsRepository: Partial<IVaultsRepository> = {};
const mockRedeemStandardVaultHandler: Partial<RedeemStandardVaultHandler> = {};
const mockRedeemVaultStrategyRedemptionDetailsBuilder: Partial<RedeemVaultStrategyRedemptionDetailsBuilder> = {};
const mockLogger = createTestLogger();

const redeemLegacyVaultHandler: RedeemLegacyVaultHandler = new RedeemLegacyVaultHandler(
  as(mockLegacyVaultApiRepository),
  as(mockVaultsRepository),
  as(mockRedeemStandardVaultHandler),
  as(mockRedeemVaultStrategyRedemptionDetailsBuilder),
  as(mockLogger),
);

const redemptionType = 'vault';
const redemptionUrl = faker.string.alphanumeric();
const redemptionCompanyId = faker.number.int().toString();
const redemptionOfferId = faker.number.int().toString();
const memberId: string = faker.string.alphanumeric();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('handleRedeemLegacyVault', () => {
  it('returns response from buildRedeemVaultStrategyRedemptionDetails', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ maxPerUser: 1 });

    mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(0);

    const assignCodeToMemberData: AssignCodeToMemberData = { code: faker.string.alphanumeric() };
    mockLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
      .fn()
      .mockResolvedValue({ kind: 'Ok', data: assignCodeToMemberData });

    const redeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails =
      redeemVaultStrategyRedemptionDetailsFactory.build();
    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest
      .fn()
      .mockReturnValue(redeemVaultStrategyRedemptionDetails);

    const actualRedeemVaultStrategyResult: RedeemVaultStrategyResult =
      await redeemLegacyVaultHandler.handleRedeemLegacyVault(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        redemptionCompanyId,
        redemptionOfferId,
        memberId,
      );

    const expectedRedeemVaultStrategyResult: RedeemVaultStrategyResult = {
      kind: 'Ok',
      redemptionDetails: redeemVaultStrategyRedemptionDetails,
      redemptionType: 'vault',
    };

    expect(actualRedeemVaultStrategyResult).toStrictEqual(expectedRedeemVaultStrategyResult);
  });

  it('calls buildRedeemVaultStrategyRedemptionDetails with correct arguments', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ maxPerUser: 1 });

    mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(0);

    const assignCodeToMemberData: AssignCodeToMemberData = { code: faker.string.alphanumeric() };
    mockLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
      .fn()
      .mockResolvedValue({ kind: 'Ok', data: assignCodeToMemberData });

    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest.fn();

    await redeemLegacyVaultHandler.handleRedeemLegacyVault(
      vaultEntity,
      redemptionType,
      redemptionUrl,
      redemptionCompanyId,
      redemptionOfferId,
      memberId,
    );

    expect(
      mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails,
    ).toHaveBeenCalledWith(vaultEntity, redemptionType, redemptionUrl, memberId, assignCodeToMemberData.code);
  });

  it('calls assignCodeToMemberWithErrorHandling with correct arguments', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ maxPerUser: 1 });

    mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(0);
    mockLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
      .fn()
      .mockResolvedValue({ kind: 'Ok', data: { code: faker.string.alphanumeric() } });

    mockRedeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails = jest.fn();

    await redeemLegacyVaultHandler.handleRedeemLegacyVault(
      vaultEntity,
      redemptionType,
      redemptionUrl,
      redemptionCompanyId,
      redemptionOfferId,
      memberId,
    );

    expect(mockLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling).toHaveBeenCalledWith(
      memberId,
      Number(redemptionCompanyId),
      Number(redemptionOfferId),
    );
  });

  it.each([
    [2, 1],
    [1, 1],
    [0, 0],
    [0, null],
    [1, null],
  ])(
    'throws an error when the user has claimed %s of the available %s codes',
    async (codesIssuedByMember: number, maxPerUser: number | null) => {
      const vaultEntity: VaultEntity = vaultEntityFactory.build({ maxPerUser: maxPerUser });

      mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(codesIssuedByMember);

      await expect(() =>
        redeemLegacyVaultHandler.handleRedeemLegacyVault(
          vaultEntity,
          redemptionType,
          redemptionUrl,
          redemptionCompanyId,
          redemptionOfferId,
          memberId,
        ),
      ).rejects.toThrow(MaxPerUserReachedError);

      expect(mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember).toHaveBeenCalledTimes(1);
      expect(mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember).toHaveBeenCalledWith(
        memberId,
        Number(redemptionCompanyId),
        Number(redemptionOfferId),
      );
    },
  );

  describe('when assignCodeToMemberWithErrorHandling returns NoCodesAvailable', () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ maxPerUser: 1 });

    jest.spyOn(getEnv, 'getEnv').mockImplementation(() => {
      return 'true';
    });

    it('calls updateOneById when ENABLE_STANDARD_VAULT is true', async () => {
      mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(0);
      mockLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
        .fn()
        .mockResolvedValue({ kind: 'NoCodesAvailable' });

      mockVaultsRepository.updateOneById = jest.fn();
      mockRedeemStandardVaultHandler.handleRedeemStandardVault = jest.fn();

      await redeemLegacyVaultHandler.handleRedeemLegacyVault(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        redemptionCompanyId,
        redemptionOfferId,
        memberId,
      );

      expect(mockVaultsRepository.updateOneById).toHaveBeenCalledWith(vaultEntity.id, {
        vaultType: 'standard',
      });
    });

    it('calls handleRedeemStandardVault when ENABLE_STANDARD_VAULT is true', async () => {
      mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(0);
      mockLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
        .fn()
        .mockResolvedValue({ kind: 'NoCodesAvailable' });

      mockVaultsRepository.updateOneById = jest.fn();
      mockRedeemStandardVaultHandler.handleRedeemStandardVault = jest.fn();

      await redeemLegacyVaultHandler.handleRedeemLegacyVault(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        redemptionCompanyId,
        redemptionOfferId,
        memberId,
      );

      expect(mockRedeemStandardVaultHandler.handleRedeemStandardVault).toHaveBeenCalledWith(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        memberId,
      );
    });

    it('return response from handleRedeemStandardVault when ENABLE_STANDARD_VAULT is true', async () => {
      mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(0);
      mockLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
        .fn()
        .mockResolvedValue({ kind: 'NoCodesAvailable' });

      mockVaultsRepository.updateOneById = jest.fn();

      const expectedRedeemVaultStrategyResult: RedeemVaultStrategyResult = {
        kind: 'Ok',
        redemptionDetails: redeemVaultStrategyRedemptionDetailsFactory.build(),
        redemptionType: 'vault',
      };
      mockRedeemStandardVaultHandler.handleRedeemStandardVault = jest
        .fn()
        .mockResolvedValue(expectedRedeemVaultStrategyResult);

      const actualRedeemVaultStrategyResult: RedeemVaultStrategyResult =
        await redeemLegacyVaultHandler.handleRedeemLegacyVault(
          vaultEntity,
          redemptionType,
          redemptionUrl,
          redemptionCompanyId,
          redemptionOfferId,
          memberId,
        );

      expect(actualRedeemVaultStrategyResult).toEqual(expectedRedeemVaultStrategyResult);
    });

    it('throws error when ENABLE_STANDARD_VAULT is false', async () => {
      jest.spyOn(getEnv, 'getEnv').mockImplementation(() => {
        return 'false';
      });

      mockLegacyVaultApiRepository.getNumberOfCodesIssuedByMember = jest.fn().mockResolvedValue(0);
      mockLegacyVaultApiRepository.assignCodeToMemberWithErrorHandling = jest
        .fn()
        .mockResolvedValue({ kind: 'NoCodesAvailable' });

      mockVaultsRepository.updateOneById = jest.fn();
      mockRedeemStandardVaultHandler.handleRedeemStandardVault = jest.fn();

      mockLogger.error = jest.fn();

      await expect(() =>
        redeemLegacyVaultHandler.handleRedeemLegacyVault(
          vaultEntity,
          redemptionType,
          redemptionUrl,
          redemptionCompanyId,
          redemptionOfferId,
          memberId,
        ),
      ).rejects.toThrow('No vault codes available on legacy');

      expect(mockLogger.error).toHaveBeenCalledWith({
        message: `No vault codes available on legacy for the given memberId "${memberId}" and companyId "${redemptionCompanyId}" and offerId "${redemptionOfferId}"`,
        context: {
          memberId,
          companyId: redemptionCompanyId,
          offerId: redemptionOfferId,
        },
      });
    });
  });
});
