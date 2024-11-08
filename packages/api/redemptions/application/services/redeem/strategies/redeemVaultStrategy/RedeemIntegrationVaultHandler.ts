import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { EagleEyeApiRepository } from '@blc-mono/redemptions/application/repositories/EagleEyeApiRepository';
import { IntegrationCodesRepository } from '@blc-mono/redemptions/application/repositories/IntegrationCodesRepository';
import { UniqodoApiRepository } from '@blc-mono/redemptions/application/repositories/UniqodoApiRepository';
import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';

import { RedeemVaultStrategyRedemptionDetails, RedeemVaultStrategyResult } from '../IRedeemStrategy';

import { MaxPerUserReachedError } from './helpers/MaxPerUserReachedError';
import { RedeemVaultStrategyRedemptionDetailsBuilder } from './RedeemVaultStrategyRedemptionDetailsBuilder';

export type IntegrationCode = {
  code: string;
  createdAt: Date;
  expiresAt: Date;
};

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
    const integration = vaultEntity.integration;
    const integrationId = vaultEntity.integrationId;

    if (integration !== 'eagleeye' && integration !== 'uniqodo') {
      throw new Error('Integration must be either eagleEye or uniqodo');
    }

    if (integrationId === null) {
      throw new Error(`${integration} integrationId is blank/null`);
    }

    const numberOfCodesClaimedByMember = await this.integrationCodesRepository.countCodesClaimedByMember(
      vaultEntity.id,
      integrationId,
      memberId,
    );

    const maxNumberOfCodesAllowedPerUser = vaultEntity.maxPerUser ?? 1;

    if (numberOfCodesClaimedByMember >= maxNumberOfCodesAllowedPerUser) {
      throw new MaxPerUserReachedError('Maximum codes claimed for this vault');
    }

    const integrationCode: IntegrationCode = await this.getIntegrationCode(vaultEntity, memberId, memberEmail);

    await this.integrationCodesRepository.create({
      vaultId: vaultEntity.id,
      memberId: memberId,
      code: integrationCode.code,
      created: integrationCode.createdAt,
      expiry: integrationCode.expiresAt,
      integration: integration,
      integrationId: integrationId,
    });

    const redeemVaultStrategyRedemptionDetails: RedeemVaultStrategyRedemptionDetails =
      this.redeemVaultStrategyRedemptionDetailsBuilder.buildRedeemVaultStrategyRedemptionDetails(
        vaultEntity,
        redemptionType,
        redemptionUrl,
        memberId,
        integrationCode.code,
      );

    return {
      kind: 'Ok',
      redemptionType,
      redemptionDetails: redeemVaultStrategyRedemptionDetails,
    };
  }

  private async getIntegrationCode(
    vaultEntity: VaultEntity,
    memberId: string,
    memberEmail: string,
  ): Promise<IntegrationCode> {
    switch (vaultEntity.integration) {
      case 'uniqodo':
        return await this.uniqodoRepository.getCode(String(vaultEntity.integrationId), memberId, memberEmail);
      case 'eagleeye': {
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

        return await this.eagleEyeApiRepository.getCode(resourceId, memberId);
      }

      default:
        throw new Error('Integration must be either eagleEye or uniqodo');
    }
  }
}
