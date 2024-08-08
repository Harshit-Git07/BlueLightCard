import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import {
  ILegacyVaultApiRepository,
  LegacyVaultApiRepository,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import {
  IVaultCodesRepository,
  VaultCodesRepository,
} from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import {
  IVaultsRepository,
  Vault,
  VaultsRepository,
} from '@blc-mono/redemptions/application/repositories/VaultsRepository';

import { Redemption } from '../../../repositories/RedemptionsRepository';

import { createMemberRedemptionEvent } from './helpers';
import { IRedeemStrategy, RedeemParams, RedeemVaultStrategyResult } from './IRedeemStrategy';

export class RedeemVaultStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemVaultStrategy' as const;
  static readonly inject = [
    VaultsRepository.key,
    VaultCodesRepository.key,
    LegacyVaultApiRepository.key,
    RedemptionsEventsRepository.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly vaultsRepository: IVaultsRepository,
    private readonly vaultCodesRepository: IVaultCodesRepository,
    private readonly legacyVaultApiRepository: ILegacyVaultApiRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly logger: ILogger,
  ) {}

  async redeem(redemption: Redemption, params: RedeemParams): Promise<RedeemVaultStrategyResult> {
    const vault = await this.vaultsRepository.findOneByRedemptionId(redemption.id, {
      status: 'active',
    });

    if (!vault) {
      this.logger.error({
        message: `Vault not found`,
        context: {
          redemptionId: redemption.id,
        },
      });
      throw new Error('Vault not found');
    }

    let result: RedeemVaultStrategyResult;
    switch (vault.vaultType) {
      case 'standard':
        result = await this.handleRedeemStandardVault(vault, redemption, params.memberId);
        break;
      case 'legacy':
        result = await this.handleRedeemLegacyVault(vault, redemption, params.memberId);
        break;
      default:
        exhaustiveCheck(vault.vaultType, 'Invalid vault type');
    }

    if (result.kind === 'Ok') {
      const event = createMemberRedemptionEvent(redemption, params, {
        redemptionType: redemption.redemptionType,
        code: result.redemptionDetails.code,
        url: result.redemptionDetails.url ?? '',
        vaultDetails: result.redemptionDetails.vaultDetails,
      });
      await this.redemptionsEventsRepository.publishRedemptionEvent(event).catch((error) => {
        this.logger.error({
          message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
          error,
        });
      });
      return {
        kind: result.kind,
        redemptionType: result.redemptionType,
        redemptionDetails: {
          code: result.redemptionDetails.code,
          url: result.redemptionDetails.url ?? '',
        },
      };
    }

    return result;
  }

  private async handleRedeemStandardVault(
    vault: Vault,
    redemption: Redemption,
    memberId: string,
  ): Promise<RedeemVaultStrategyResult> {
    if (redemption.redemptionType === 'vault' && !redemption.url) {
      throw new Error('Invalid redemption for redemption type "vault" (missing url)');
    }

    const { redemptionType } = redemption;

    const isVaultRedemptionType = redemptionType === 'vault' || redemptionType === 'vaultQR';

    if (!isVaultRedemptionType) {
      throw new Error('Unexpected redemption type');
    }

    const reachedMaxCodeClaimed = await this.vaultCodesRepository.checkIfMemberReachedMaxCodeClaimed(
      vault.id,
      memberId,
      vault.maxPerUser ?? 0, // TODO: Check what default limit is
    );

    if (reachedMaxCodeClaimed) {
      return {
        kind: 'MaxPerUserReached',
      };
    }

    const claimedCode = await this.vaultCodesRepository.claimVaultCode(vault.id, memberId);
    if (!claimedCode) {
      this.logger.error({
        message: `No vault code not found for the given vaultId "${vault.id}" and memberId "${memberId}"`,
        context: {
          vaultId: vault.id,
          memberId,
        },
      });
      throw new Error('No vault code found');
    }

    const redemptionDetails = {
      code: claimedCode.code,
      vaultDetails: {
        id: vault.id,
        alertBelow: vault.alertBelow,
        email: vault.email ?? '',
        vaultType: vault.vaultType,
      },
    };
    const vaultResponse: RedeemVaultStrategyResult = {
      kind: 'Ok',
      redemptionType,
      redemptionDetails,
    };

    if (redemptionType != 'vaultQR' && redemption.url) {
      const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemption.url, memberId);
      return {
        ...vaultResponse,
        redemptionDetails: { ...redemptionDetails, url: parsedUrl },
      };
    }
    return vaultResponse;
  }

  private async handleRedeemLegacyVault(
    vault: Vault,
    redemption: Redemption,
    memberId: string,
  ): Promise<RedeemVaultStrategyResult> {
    if (redemption.redemptionType === 'vault' && !redemption.url) {
      throw new Error('Invalid redemption for redemption type "vault" (missing url)');
    }
    const { redemptionType } = redemption;
    const isVaultRedemptionType = redemptionType == 'vault' || redemptionType === 'vaultQR';

    if (!isVaultRedemptionType) {
      throw new Error('Unexpected redemption type');
    }

    // AWS Key setup
    const codesIssued = await this.legacyVaultApiRepository.getNumberOfCodesIssued(
      memberId,
      redemption.companyId,
      redemption.offerId,
    );

    if (codesIssued >= (vault.maxPerUser ?? 0)) {
      return { kind: 'MaxPerUserReached' };
    }

    const assignCodeResponse = await this.legacyVaultApiRepository.assignCodeToMember(
      memberId,
      redemption.companyId,
      redemption.offerId,
      // TODO: This should not be hard-coded to BLC_UK
      'BLC_UK',
    );

    const redemptionDetails = {
      code: assignCodeResponse.code,
      vaultDetails: {
        id: vault.id,
        alertBelow: vault.alertBelow,
        email: vault.email ?? '',
        vaultType: vault.vaultType,
      },
    };
    const vaultResponse: RedeemVaultStrategyResult = {
      kind: 'Ok',
      redemptionType,
      redemptionDetails,
    };

    if (redemptionType != 'vaultQR' && redemption.url) {
      const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemption.url, memberId);
      return {
        ...vaultResponse,
        redemptionDetails: { ...redemptionDetails, url: parsedUrl },
      };
    }

    return vaultResponse;
  }
}
