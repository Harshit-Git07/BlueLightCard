import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';

import { RedeemVaultStrategyRedemptionDetails, RedeemVaultStrategyResult } from '../IRedeemStrategy';

import { MaxPerUserReachedError } from './helpers/MaxPerUserReachedError';
import { NoCodesAvailableError } from './helpers/NoCodesAvailableError';
import { RedeemVaultStrategyRedemptionDetailsBuilder } from './RedeemVaultStrategyRedemptionDetailsBuilder';

export class RedeemStandardVaultHandler {
  static readonly key = 'RedeemStandardVaultHandler' as const;
  static readonly inject = [
    VaultCodesRepository.key,
    RedeemVaultStrategyRedemptionDetailsBuilder.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly vaultCodesRepository: VaultCodesRepository,
    private readonly redeemVaultStrategyRedemptionDetailsBuilder: RedeemVaultStrategyRedemptionDetailsBuilder,
    private readonly logger: ILogger,
  ) {}

  public async handleRedeemStandardVault(
    vault: VaultEntity,
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
      throw new MaxPerUserReachedError('Maximum codes claimed for this vault');
    }

    const claimedCode = await this.vaultCodesRepository.claimVaultCode(vault.id, memberId);
    if (!claimedCode) {
      this.logger.error({
        message: `No vault code found for standard vault with vaultId "${vault.id}", memberId "${memberId}"`,
        context: {
          vaultId: vault.id,
          memberId,
        },
      });
      throw new NoCodesAvailableError('No vault code found');
    }

    const redemptionDetails: RedeemVaultStrategyRedemptionDetails =
      this.redeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails(
        vault,
        redemptionType,
        redemptionUrl,
        memberId,
        claimedCode.code,
      );

    return {
      kind: 'Ok',
      redemptionType,
      redemptionDetails,
    };
  }
}
