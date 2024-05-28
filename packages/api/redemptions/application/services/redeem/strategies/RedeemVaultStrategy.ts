import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import {
  ILegacyVaultApiRepository,
  LegacyVaultApiRepository,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
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

import { IRedeemStrategy, RedeemParams, RedeemVaultStrategyResult } from './IRedeemStrategy';

export class RedeemVaultStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemVaultStrategy' as const;
  static readonly inject = [
    VaultsRepository.key,
    VaultCodesRepository.key,
    LegacyVaultApiRepository.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly vaultsRepository: IVaultsRepository,
    private readonly vaultCodesRepository: IVaultCodesRepository,
    private readonly legacyVaultApiRepository: ILegacyVaultApiRepository,
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

    switch (vault.vaultType) {
      case 'standard':
        return this.handleRedeemStandardVault(vault, redemption, params.memberId);
      case 'legacy':
        return this.handleRedeemLegacyVault(vault, redemption, params.memberId);
      default:
        exhaustiveCheck(vault.vaultType, 'Invalid vault type');
    }
  }

  private async handleRedeemStandardVault(
    vault: Vault,
    redemption: Redemption,
    memberId: string,
  ): Promise<RedeemVaultStrategyResult> {
    if (!redemption.url) {
      throw new Error('Invalid redemption for redemption type "vault" (missing url)');
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

    const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemption.url, memberId);
    return {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: {
        url: parsedUrl,
        code: claimedCode.code,
      },
    };
  }

  private async handleRedeemLegacyVault(
    vault: Vault,
    redemption: Redemption,
    memberId: string,
  ): Promise<RedeemVaultStrategyResult> {
    if (!redemption.url) {
      throw new Error('Invalid redemption for redemption type "vault" (missing url)');
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

    const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemption.url, memberId);
    return {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: {
        url: parsedUrl,
        code: assignCodeResponse.code,
      },
    };
  }
}
