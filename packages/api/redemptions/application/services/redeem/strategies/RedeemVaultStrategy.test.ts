import { MemberRedemptionEventDetail } from '@blc-mono/core/schemas/redemptions';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { IRedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { IVaultsRepository, VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { memberRedemptionEventDetailFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { redeemParamsFactory } from '@blc-mono/redemptions/libs/test/factories/redeemParams.factory';
import { redeemVaultStrategyRedemptionDetailsFactory } from '@blc-mono/redemptions/libs/test/factories/redeemVaultStrategyRedemptionDetails.factory';
import { redeemVaultStrategyResultFactory } from '@blc-mono/redemptions/libs/test/factories/redeemVaultStrategyResult.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams, RedeemVaultStrategyResult } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { RedeemVaultStrategy } from './RedeemVaultStrategy';
import { RedeemIntegrationVaultHandler } from './redeemVaultStrategy/RedeemIntegrationVaultHandler';
import { RedeemLegacyVaultHandler } from './redeemVaultStrategy/RedeemLegacyVaultHandler';
import { RedeemStandardVaultHandler } from './redeemVaultStrategy/RedeemStandardVaultHandler';

const mockVaultsRepository: Partial<IVaultsRepository> = {};
const mockRedemptionsEventsRepository: Partial<IRedemptionsEventsRepository> = {
  publishRedemptionEvent: jest.fn(),
};
const mockRedeemIntegrationVaultHandler: Partial<RedeemIntegrationVaultHandler> = {};
const mockRedeemStandardVaultHandler: Partial<RedeemStandardVaultHandler> = {};
const mockRedeemLegacyVaultHandler: Partial<RedeemLegacyVaultHandler> = {};
const mockMemberRedemptionEventDetailBuilder: Partial<MemberRedemptionEventDetailBuilder> = {
  buildMemberRedemptionEventDetail: jest.fn(),
};
const mockLogger: ILogger = createTestLogger();

const redeemVaultStrategy = new RedeemVaultStrategy(
  as(mockVaultsRepository),
  as(mockRedemptionsEventsRepository),
  as(mockRedeemIntegrationVaultHandler),
  as(mockRedeemStandardVaultHandler),
  as(mockRedeemLegacyVaultHandler),
  as(mockMemberRedemptionEventDetailBuilder),
  mockLogger,
);

const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({ redemptionType: 'vault' });
const redeemParams: RedeemParams = redeemParamsFactory.build();
const vaultEntity: VaultEntity = vaultEntityFactory.build();
const redeemVaultStrategyResult: RedeemVaultStrategyResult = redeemVaultStrategyResultFactory.build();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RedeemVaultStrategy', () => {
  it('logs error when publishRedemptionEvent throws error', async () => {
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
    mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault = jest
      .fn()
      .mockResolvedValue(redeemVaultStrategyResult);

    const error = new Error('error');
    mockRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockRejectedValue(error);

    mockLogger.error = jest.fn();

    await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

    expect(mockLogger.error).toHaveBeenCalledWith({
      message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
      error: error,
    });
  });

  it('calls publishRedemptionEvent with correct params', async () => {
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
    mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault = jest
      .fn()
      .mockResolvedValue(redeemVaultStrategyResult);

    const memberRedemptionEventDetail: MemberRedemptionEventDetail = memberRedemptionEventDetailFactory.build();
    mockMemberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail = jest
      .fn()
      .mockReturnValue(memberRedemptionEventDetail);

    await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

    expect(mockRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith(memberRedemptionEventDetail);
  });

  it('calls buildMemberRedemptionEventDetail with correct params', async () => {
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
    mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault = jest
      .fn()
      .mockResolvedValue(redeemVaultStrategyResult);

    await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

    expect(mockMemberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail).toHaveBeenCalledWith({
      redemptionConfigEntity,
      params: redeemParams,
      url: redeemVaultStrategyResult.redemptionDetails!.url,
      code: redeemVaultStrategyResult.redemptionDetails!.code,
      vaultDetails: redeemVaultStrategyResult.redemptionDetails!.vaultDetails,
    });
  });

  it('calls buildMemberRedemptionEventDetail with correct params when url is undefined', async () => {
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);

    const redeemVaultStrategyResult: RedeemVaultStrategyResult = redeemVaultStrategyResultFactory.build({
      redemptionDetails: redeemVaultStrategyRedemptionDetailsFactory.build({ url: undefined }),
    });
    mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault = jest
      .fn()
      .mockResolvedValue(redeemVaultStrategyResult);

    await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

    expect(mockMemberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail).toHaveBeenCalledWith({
      redemptionConfigEntity,
      params: redeemParams,
      url: '',
      code: redeemVaultStrategyResult.redemptionDetails!.code,
      vaultDetails: redeemVaultStrategyResult.redemptionDetails!.vaultDetails,
    });
  });

  it('returns response from handleRedeemStandardVault when vaultType is legacy and integration is null', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: null, vaultType: 'legacy' });
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);

    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vault',
    });
    mockRedeemLegacyVaultHandler.handleRedeemLegacyVault = jest.fn().mockResolvedValue(redeemVaultStrategyResult);

    const actualRedeemVaultStrategyResult: RedeemVaultStrategyResult = await redeemVaultStrategy.redeem(
      redemptionConfigEntity,
      redeemParams,
    );

    const expectedRedeemVaultStrategyResult: RedeemVaultStrategyResult = {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: {
        code: redeemVaultStrategyResult.redemptionDetails!.code,
        url: redeemVaultStrategyResult.redemptionDetails!.url,
      },
    };

    expect(actualRedeemVaultStrategyResult).toEqual(expectedRedeemVaultStrategyResult);
  });

  it('calls handleRedeemLegacyVault with correct params when vaultType is legacy and integration is null', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: null, vaultType: 'legacy' });
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
    mockRedeemLegacyVaultHandler.handleRedeemLegacyVault = jest.fn().mockResolvedValue(redeemVaultStrategyResult);

    await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

    expect(mockRedeemLegacyVaultHandler.handleRedeemLegacyVault).toHaveBeenCalledWith(
      vaultEntity,
      redemptionConfigEntity.redemptionType,
      redemptionConfigEntity.url,
      redemptionConfigEntity.companyId,
      redemptionConfigEntity.offerId,
      redeemParams.memberId,
    );
  });

  it('returns response from handleRedeemStandardVault when vaultType is standard and integration is null', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: null, vaultType: 'standard' });
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);

    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vault',
    });
    mockRedeemStandardVaultHandler.handleRedeemStandardVault = jest.fn().mockResolvedValue(redeemVaultStrategyResult);

    const actualRedeemVaultStrategyResult: RedeemVaultStrategyResult = await redeemVaultStrategy.redeem(
      redemptionConfigEntity,
      redeemParams,
    );

    const expectedRedeemVaultStrategyResult: RedeemVaultStrategyResult = {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: {
        code: redeemVaultStrategyResult.redemptionDetails!.code,
        url: redeemVaultStrategyResult.redemptionDetails!.url,
      },
    };

    expect(actualRedeemVaultStrategyResult).toEqual(expectedRedeemVaultStrategyResult);
  });

  it('calls handleRedeemStandardVault with correct params when vaultType is standard and integration is null', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: null, vaultType: 'standard' });
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
    mockRedeemStandardVaultHandler.handleRedeemStandardVault = jest.fn().mockResolvedValue(redeemVaultStrategyResult);

    await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

    expect(mockRedeemStandardVaultHandler.handleRedeemStandardVault).toHaveBeenCalledWith(
      vaultEntity,
      redemptionConfigEntity.redemptionType,
      redemptionConfigEntity.url,
      redeemParams.memberId,
    );
  });

  it.each(['eagleeye', 'uniqodo'] as const)(
    'calls handleRedeemIntegrationVault with correct params when vaultType is standard and integration is %s',
    async (integration) => {
      const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: integration, vaultType: 'standard' });
      mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
      mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault = jest
        .fn()
        .mockResolvedValue(redeemVaultStrategyResult);

      await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

      expect(mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault).toHaveBeenCalledWith(
        vaultEntity,
        redemptionConfigEntity.redemptionType,
        redemptionConfigEntity.url,
        redeemParams.memberId,
        redeemParams.memberEmail,
      );
    },
  );

  it.each(['eagleeye', 'uniqodo'] as const)(
    'returns response from handleRedeemIntegrationVault when integration is %s',
    async (integration) => {
      const vaultEntity: VaultEntity = vaultEntityFactory.build({ integration: integration, vaultType: 'standard' });
      mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);

      const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
        redemptionType: 'vault',
      });
      mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault = jest
        .fn()
        .mockResolvedValue(redeemVaultStrategyResult);

      const actualRedeemVaultStrategyResult: RedeemVaultStrategyResult = await redeemVaultStrategy.redeem(
        redemptionConfigEntity,
        redeemParams,
      );

      const expectedRedeemVaultStrategyResult: RedeemVaultStrategyResult = {
        kind: 'Ok',
        redemptionType: 'vault',
        redemptionDetails: {
          code: redeemVaultStrategyResult.redemptionDetails!.code,
          url: redeemVaultStrategyResult.redemptionDetails!.url,
        },
      };

      expect(actualRedeemVaultStrategyResult).toEqual(expectedRedeemVaultStrategyResult);
    },
  );

  it('throws error if publishRedemptionEvent throws error', async () => {
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
    mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault = jest
      .fn()
      .mockResolvedValue(redeemVaultStrategyResult);

    const error = new Error('error');
    mockRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockRejectedValue(error);

    mockLogger.error = jest.fn();

    await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

    expect(mockLogger.error).toHaveBeenCalledWith({
      message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
      error,
    });
  });

  it('throws error if redemptionType is vault and there is no url', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'vault',
      url: null,
    });

    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);

    mockLogger.error = jest.fn();

    await expect(() => redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams)).rejects.toThrow(
      'Invalid redemption for redemption type "vault" (missing url)',
    );
  });

  it('throws error if findOneByRedemptionId returns undefinded', async () => {
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(undefined);

    mockLogger.error = jest.fn();

    await expect(() => redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams)).rejects.toThrow(
      'Vault not found',
    );

    expect(mockLogger.error).toHaveBeenCalledWith({
      message: 'Vault not found',
      context: {
        redemptionId: redemptionConfigEntity.id,
      },
    });
  });

  it('throws error if redemptionType is not vault or vaultQR', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      redemptionType: 'generic',
    });
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(undefined);

    mockLogger.error = jest.fn();

    await expect(() => redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams)).rejects.toThrow(
      'Unexpected redemption type',
    );
  });

  it('calls findOneByRedemptionId with correct params', async () => {
    mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(vaultEntity);
    mockRedeemIntegrationVaultHandler.handleRedeemIntegrationVault = jest
      .fn()
      .mockResolvedValue(redeemVaultStrategyResult);

    await redeemVaultStrategy.redeem(redemptionConfigEntity, redeemParams);

    expect(mockVaultsRepository.findOneByRedemptionId).toHaveBeenCalledWith(redemptionConfigEntity.id, {
      status: 'active',
    });
  });
});
