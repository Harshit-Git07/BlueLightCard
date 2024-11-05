import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { LegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { VaultEntity, VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { RedeemVaultStrategyRedemptionDetails, RedeemVaultStrategyResult } from '../IRedeemStrategy';

import { MaxPerUserReachedError } from './helpers/MaxPerUserReachedError';
import { NoCodesAvailableError } from './helpers/NoCodesAvailableError';
import { RedeemStandardVaultHandler } from './RedeemStandardVaultHandler';
import { RedeemVaultStrategyRedemptionDetailsBuilder } from './RedeemVaultStrategyRedemptionDetailsBuilder';

export class RedeemLegacyVaultHandler {
  static readonly key = 'RedeemLegacyVaultHandler' as const;
  static readonly inject = [
    LegacyVaultApiRepository.key,
    VaultsRepository.key,
    RedeemStandardVaultHandler.key,
    RedeemVaultStrategyRedemptionDetailsBuilder.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly legacyVaultApiRepository: LegacyVaultApiRepository,
    private readonly vaultsRepository: VaultsRepository,
    private readonly redeemStandardVaultHandler: RedeemStandardVaultHandler,
    private readonly redeemVaultStrategyRedemptionDetailsBuilder: RedeemVaultStrategyRedemptionDetailsBuilder,
    private readonly logger: ILogger,
  ) {}

  public async handleRedeemLegacyVault(
    vaultEntity: VaultEntity,
    redemptionType: 'vault' | 'vaultQR',
    redemptionUrl: string | null,
    redemptionCompanyId: string,
    redemptionOfferId: string,
    memberId: string,
  ): Promise<RedeemVaultStrategyResult> {
    const codesIssuedByMember = await this.legacyVaultApiRepository.getNumberOfCodesIssuedByMember(
      memberId,
      Number(redemptionCompanyId),
      Number(redemptionOfferId),
    );

    if (codesIssuedByMember >= (vaultEntity.maxPerUser ?? 0)) {
      throw new MaxPerUserReachedError('Maximum codes claimed for this vault');
    }

    const assignCodeResponse = await this.legacyVaultApiRepository.assignCodeToMemberWithErrorHandling(
      memberId,
      Number(redemptionCompanyId),
      Number(redemptionOfferId),
    );

    if (assignCodeResponse.kind === 'NoCodesAvailable') {
      const enableStandardVault = getEnv(RedemptionsStackEnvironmentKeys.ENABLE_STANDARD_VAULT) === 'true';
      if (enableStandardVault) {
        await this.vaultsRepository.updateOneById(vaultEntity.id, {
          vaultType: 'standard',
        });
        return await this.redeemStandardVaultHandler.handleRedeemStandardVault(
          vaultEntity,
          redemptionType,
          redemptionUrl,
          memberId,
        );
      }

      this.logger.error({
        message: `No vault codes available on legacy for the given memberId "${memberId}" and companyId "${redemptionCompanyId}" and offerId "${redemptionOfferId}"`,
        context: {
          memberId,
          companyId: redemptionCompanyId,
          offerId: redemptionOfferId,
        },
      });
      throw new NoCodesAvailableError('No vault codes available on legacy');
    }

    const redemptionDetails: RedeemVaultStrategyRedemptionDetails =
      this.redeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        memberId,
        assignCodeResponse.data.code,
      );

    return {
      kind: 'Ok',
      redemptionType,
      redemptionDetails,
    };
  }
}
