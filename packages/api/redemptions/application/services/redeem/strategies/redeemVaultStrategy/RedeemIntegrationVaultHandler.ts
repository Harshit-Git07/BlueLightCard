import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { EagleEyeApiRepository } from '@blc-mono/redemptions/application/repositories/EagleEyeApiRepository';
import { IntegrationCodesRepository } from '@blc-mono/redemptions/application/repositories/IntegrationCodesRepository';
import { UniqodoApiRepository } from '@blc-mono/redemptions/application/repositories/UniqodoApiRepository';
import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';

import { RedeemVaultStrategyRedemptionDetails, RedeemVaultStrategyResult } from '../IRedeemStrategy';

import { MaxPerUserReachedError } from './helpers/MaxPerUserReachedError';
import { NoCodesAvailableError } from './helpers/NoCodesAvailableError';
import { RedeemVaultStrategyRedemptionDetailsBuilder } from './RedeemVaultStrategyRedemptionDetailsBuilder';

export class RedeemIntegrationVaultHandler {
  static readonly key = 'RedeemIntegrationVaultHandler' as const;
  static readonly inject = [
    UniqodoApiRepository.key,
    EagleEyeApiRepository.key,
    IntegrationCodesRepository.key,
    RedeemVaultStrategyRedemptionDetailsBuilder.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly uniqodoRepository: UniqodoApiRepository,
    private readonly eagleEyeApiRepository: EagleEyeApiRepository,
    private readonly integrationCodesRepository: IntegrationCodesRepository,
    private readonly redeemVaultStrategyRedemptionDetailsBuilder: RedeemVaultStrategyRedemptionDetailsBuilder,
    private readonly logger: ILogger,
  ) {}

  public async handleRedeemIntegrationVault(
    vaultEntity: VaultEntity,
    redemptionType: 'vault' | 'vaultQR',
    redemptionUrl: string | null,
    memberId: string,
    memberEmail: string,
  ): Promise<RedeemVaultStrategyResult> {
    if (vaultEntity.integrationId === null) {
      throw new Error(`${vaultEntity.integration} integrationId is blank/null`);
    }

    const numberOfCodesClaimedByMember = await this.integrationCodesRepository.countCodesClaimedByMember(
      vaultEntity.id,
      String(vaultEntity.integrationId),
      memberId,
    );

    const maxPerUser = vaultEntity.maxPerUser ?? 1;

    if (numberOfCodesClaimedByMember >= maxPerUser) {
      throw new MaxPerUserReachedError('Maximum codes claimed for this vault');
    }

    let claimedCode;
    if (vaultEntity.integration == 'uniqodo') {
      claimedCode = await this.uniqodoRepository.getCode(String(vaultEntity.integrationId), memberId, memberEmail);
    } else if (vaultEntity.integration == 'eagleeye') {
      const resourceId = Number(vaultEntity.integrationId);
      if (isNaN(resourceId)) {
        this.logger.error({
          message: `integrationId must be a number when calling eagleeye`,
          context: {
            vaultId: vaultEntity.id,
            integrationId: vaultEntity.integrationId,
            memberId,
          },
        });
        throw new Error(`integrationId: "${vaultEntity.integrationId}" must be a number when calling eagleeye`);
      }
      claimedCode = await this.eagleEyeApiRepository.getCode(resourceId, memberId);
    } else {
      throw new Error('Integration must be either eagleEye or uniqodo');
    }

    if (claimedCode.kind !== 'Ok') {
      this.logger.error({
        message: `${claimedCode.data.message} error - vaultId: "${vaultEntity.id}", memberId: "${memberId}"`,
        context: {
          vaultId: vaultEntity.id,
          memberId,
        },
      });
      throw new NoCodesAvailableError(`No vault code retrieved for ${vaultEntity.integration} vault`);
    }

    await this.integrationCodesRepository.create({
      vaultId: vaultEntity.id,
      memberId: memberId,
      code: claimedCode.data.code,
      created: claimedCode.data.createdAt,
      expiry: claimedCode.data.expiresAt,
      integration: vaultEntity.integration,
      integrationId: String(vaultEntity.integrationId),
    });

    const redeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails =
      this.redeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        memberId,
        claimedCode.data.code,
      );

    return {
      kind: 'Ok',
      redemptionType,
      redemptionDetails: redeemVaultStrategyRedemptionDetails,
    };
  }
}
