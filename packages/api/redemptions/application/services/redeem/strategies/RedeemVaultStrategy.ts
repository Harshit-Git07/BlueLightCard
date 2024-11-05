import { MemberRedemptionEventDetail } from '@blc-mono/core/schemas/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { IVaultsRepository, VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

import { IRedeemStrategy, RedeemParams, RedeemVaultStrategyResult } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { NotFoundError } from './redeemVaultStrategy/helpers/NotFoundError';
import { RedemptionConfigError } from './redeemVaultStrategy/helpers/RedemptionConfigError';
import { RedeemIntegrationVaultHandler } from './redeemVaultStrategy/RedeemIntegrationVaultHandler';
import { RedeemLegacyVaultHandler } from './redeemVaultStrategy/RedeemLegacyVaultHandler';
import { RedeemStandardVaultHandler } from './redeemVaultStrategy/RedeemStandardVaultHandler';

export class RedeemVaultStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemVaultStrategy' as const;
  static readonly inject = [
    VaultsRepository.key,
    RedemptionsEventsRepository.key,
    RedeemIntegrationVaultHandler.key,
    RedeemStandardVaultHandler.key,
    RedeemLegacyVaultHandler.key,
    MemberRedemptionEventDetailBuilder.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly vaultsRepository: IVaultsRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly redeemIntegrationVaultHandler: RedeemIntegrationVaultHandler,
    private readonly redeemStandardVaultHandler: RedeemStandardVaultHandler,
    private readonly redeemLegacyVaultHandler: RedeemLegacyVaultHandler,
    private readonly memberRedemptionEventDetailBuilder: MemberRedemptionEventDetailBuilder,
    private readonly logger: ILogger,
  ) {}

  async redeem(
    redemptionConfigEntity: RedemptionConfigEntity,
    params: RedeemParams,
  ): Promise<RedeemVaultStrategyResult> {
    const { id, redemptionType, url, companyId, offerId } = redemptionConfigEntity;
    const { memberId, memberEmail } = params;
    if (!(redemptionType === 'vault' || redemptionType === 'vaultQR')) {
      throw new Error('Unexpected redemption type');
    }

    const vault = await this.vaultsRepository.findOneByRedemptionId(redemptionConfigEntity.id, {
      status: 'active',
    });

    if (!vault) {
      this.logger.error({
        message: `Vault not found`,
        context: {
          redemptionId: id,
        },
      });
      throw new NotFoundError('Vault not found', 'VaultNotFound');
    }

    if (redemptionType === 'vault' && !url) {
      throw new RedemptionConfigError('Invalid redemption for redemption type "vault" (missing url)');
    }

    //test from here down
    let redeemVaultStrategyResult: RedeemVaultStrategyResult;
    switch (vault.vaultType) {
      case 'standard':
        if (vault.integration === 'uniqodo' || vault.integration === 'eagleeye') {
          redeemVaultStrategyResult = await this.redeemIntegrationVaultHandler.handleRedeemIntegrationVault(
            vault,
            redemptionType,
            url,
            memberId,
            memberEmail,
          );
        } else {
          redeemVaultStrategyResult = await this.redeemStandardVaultHandler.handleRedeemStandardVault(
            vault,
            redemptionType,
            url,
            memberId,
          );
        }
        break;
      case 'legacy':
        redeemVaultStrategyResult = await this.redeemLegacyVaultHandler.handleRedeemLegacyVault(
          vault,
          redemptionType,
          url,
          companyId,
          offerId,
          memberId,
        );
        break;
      default:
        exhaustiveCheck(vault.vaultType, 'Invalid vault type');
    }

    if (redeemVaultStrategyResult.kind === 'Ok') {
      const memberRedemptionEventDetail: MemberRedemptionEventDetail =
        this.memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
          redemptionConfigEntity,
          params,
          url: redeemVaultStrategyResult.redemptionDetails.url ?? '',
          code: redeemVaultStrategyResult.redemptionDetails.code,
          vaultDetails: redeemVaultStrategyResult.redemptionDetails.vaultDetails,
        });

      try {
        await this.redemptionsEventsRepository.publishRedemptionEvent(memberRedemptionEventDetail);
      } catch (error) {
        this.logger.error({
          message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
          error,
        });
      }

      //TODO: check if this is needed
      return {
        kind: redeemVaultStrategyResult.kind,
        redemptionType: redemptionType,
        redemptionDetails: {
          code: redeemVaultStrategyResult.redemptionDetails.code,
          url: redeemVaultStrategyResult.redemptionDetails.url ?? '',
        },
      };
    }

    return redeemVaultStrategyResult;
  }
}
