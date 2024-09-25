import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { getEnv } from '@blc-mono/core/utils/getEnv';
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
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

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

  private enableStandardVault = getEnv(RedemptionsStackEnvironmentKeys.ENABLE_STANDARD_VAULT) === 'true';

  constructor(
    private readonly vaultsRepository: IVaultsRepository,
    private readonly vaultCodesRepository: IVaultCodesRepository,
    private readonly legacyVaultApiRepository: ILegacyVaultApiRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly logger: ILogger,
  ) {}

  async redeem(redemption: RedemptionConfigEntity, params: RedeemParams): Promise<RedeemVaultStrategyResult> {
    const { id, redemptionType, url, companyId, offerId } = redemption;
    const { memberId } = params;
    if (!(redemptionType === 'vault' || redemptionType === 'vaultQR')) {
      throw new Error('Unexpected redemption type');
    }

    const vault = await this.vaultsRepository.findOneByRedemptionId(redemption.id, {
      status: 'active',
    });

    if (!vault) {
      this.logger.error({
        message: `Vault not found`,
        context: {
          redemptionId: id,
        },
      });
      throw new Error('Vault not found');
    }

    if (redemptionType === 'vault' && !url) {
      throw new Error('Invalid redemption for redemption type "vault" (missing url)');
    }

    let result: RedeemVaultStrategyResult;
    switch (vault.vaultType) {
      case 'standard':
        result = await this.handleRedeemStandardVault(vault, redemptionType, url, memberId);
        break;
      case 'legacy':
        result = await this.handleRedeemLegacyVault(vault, redemptionType, url, companyId, offerId, memberId);
        break;
      default:
        exhaustiveCheck(vault.vaultType, 'Invalid vault type');
    }

    if (result.kind === 'Ok') {
      const event = createMemberRedemptionEvent(redemption, params, {
        redemptionType: redemptionType,
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
        redemptionType: redemptionType,
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
    redemptionType: 'vault' | 'vaultQR',
    redemptionUrl: string | null,
    memberId: string,
  ): Promise<RedeemVaultStrategyResult> {
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

    if (redemptionType != 'vaultQR' && redemptionUrl) {
      const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemptionUrl, memberId);
      return {
        ...vaultResponse,
        redemptionDetails: { ...redemptionDetails, url: parsedUrl },
      };
    }
    return vaultResponse;
  }

  private async handleRedeemLegacyVault(
    vault: Vault,
    redemptionType: 'vault' | 'vaultQR',
    redemptionUrl: string | null,
    redemptionCompanyId: number,
    redemptionOfferId: number,
    memberId: string,
  ): Promise<RedeemVaultStrategyResult> {
    const codesIssuedByMember = await this.legacyVaultApiRepository.getNumberOfCodesIssuedByMember(
      memberId,
      redemptionCompanyId,
      redemptionOfferId,
    );

    if (codesIssuedByMember >= (vault.maxPerUser ?? 0)) {
      return { kind: 'MaxPerUserReached' };
    }

    const assignCodeResponse = await this.legacyVaultApiRepository.assignCodeToMemberWithErrorHandling(
      memberId,
      redemptionCompanyId,
      redemptionOfferId,
    );

    if (assignCodeResponse.kind === 'NoCodesAvailable') {
      if (this.enableStandardVault) {
        await this.vaultsRepository.updateOneById(vault.id, {
          vaultType: 'standard',
        });
        return await this.handleRedeemStandardVault(vault, redemptionType, redemptionUrl, memberId);
      }

      this.logger.error({
        message: `No vault codes available on legacy for the given memberId "${memberId}" and companyId "${redemptionCompanyId}" and offerId "${redemptionOfferId}"`,
        context: {
          memberId,
          companyId: redemptionCompanyId,
          offerId: redemptionOfferId,
        },
      });
      throw new Error('No vault codes available on legacy');
    }

    const redemptionDetails = {
      code: assignCodeResponse.data.code,
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

    if (redemptionType != 'vaultQR' && redemptionUrl) {
      const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemptionUrl, memberId);
      return {
        ...vaultResponse,
        redemptionDetails: { ...redemptionDetails, url: parsedUrl },
      };
    }

    return vaultResponse;
  }
}
