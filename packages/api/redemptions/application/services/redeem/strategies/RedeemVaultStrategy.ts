import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import { IntegrationCodesRepository } from '@blc-mono/redemptions/application/repositories/IntegrationCodesRepository';
import {
  ILegacyVaultApiRepository,
  LegacyVaultApiRepository,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { UniqodoApiRepository } from '@blc-mono/redemptions/application/repositories/UniqodoApiRepository';
import {
  IVaultCodesRepository,
  VaultCodesRepository,
} from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import {
  IVaultsRepository,
  VaultEntity,
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
    UniqodoApiRepository.key,
    IntegrationCodesRepository.key,
    Logger.key,
  ] as const;

  private enableStandardVault = getEnv(RedemptionsStackEnvironmentKeys.ENABLE_STANDARD_VAULT) === 'true';

  constructor(
    private readonly vaultsRepository: IVaultsRepository,
    private readonly vaultCodesRepository: IVaultCodesRepository,
    private readonly legacyVaultApiRepository: ILegacyVaultApiRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly uniqodoRepository: UniqodoApiRepository,
    private readonly integrationCodesRepository: IntegrationCodesRepository,
    private readonly logger: ILogger,
  ) {}

  async redeem(redemption: RedemptionConfigEntity, params: RedeemParams): Promise<RedeemVaultStrategyResult> {
    const { id, redemptionType, url, companyId, offerId } = redemption;
    const { memberId, memberEmail } = params;
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
        if (vault.integration === 'uniqodo' || vault.integration === 'eagleeye') {
          result = await this.handleRedeemIntegrationVault(vault, redemptionType, url, memberId, memberEmail);
        } else {
          result = await this.handleRedeemStandardVault(vault, redemptionType, url, memberId);
        }
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

  private async handleRedeemIntegrationVault(
    vault: VaultEntity,
    redemptionType: 'vault' | 'vaultQR',
    redemptionUrl: string | null,
    memberId: string,
    memberEmail: string,
  ): Promise<RedeemVaultStrategyResult> {
    if (vault.integrationId === null) {
      throw new Error(`${vault.integration} integrationId is blank/null`);
    }

    const countCodesClaimedByMember = await this.integrationCodesRepository.countCodesClaimedByMember(
      vault.id,
      String(vault.integrationId),
      memberId,
    );

    const maxPerUser = vault.maxPerUser ?? 1;

    if (countCodesClaimedByMember >= maxPerUser) {
      return {
        kind: 'MaxPerUserReached',
      };
    }

    let claimedCode;
    if (vault.integration == 'uniqodo') {
      claimedCode = await this.uniqodoRepository.getCode(String(vault.integrationId), memberId, memberEmail);
    } else {
      //claimedCode = await this.eagleeyeRepository.getCode(vault.integrationId ?? 0, memberId, memberEmail);
      throw new Error('Eagleeye integration not supported');
    }

    if (claimedCode.kind !== 'Ok') {
      this.logger.error({
        message: `${claimedCode.data.message} error - vaultId: "${vault.id}", memberId: "${memberId}"`,
        context: {
          vaultId: vault.id,
          memberId,
        },
      });
      throw new Error(`No vault code retrieved for ${vault.integration} vault`);
    }

    await this.integrationCodesRepository.create({
      vaultId: vault.id,
      memberId: memberId,
      code: claimedCode.data.code,
      created: claimedCode.data.createdAt,
      expiry: claimedCode.data.expiresAt,
      integration: vault.integration,
      integrationId: String(vault.integrationId),
    });

    const redemptionDetails = {
      code: claimedCode.data.code,
      vaultDetails: {
        id: vault.id,
        alertBelow: vault.alertBelow,
        email: vault.email ?? '',
        vaultType: vault.vaultType,
        integration: vault.integration,
        integrationId: String(vault.integrationId),
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

  private async handleRedeemStandardVault(
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
      return {
        kind: 'MaxPerUserReached',
      };
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
    vault: VaultEntity,
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

    if (codesIssuedByMember >= (vault.maxPerUser ?? 0)) {
      return { kind: 'MaxPerUserReached' };
    }

    const assignCodeResponse = await this.legacyVaultApiRepository.assignCodeToMemberWithErrorHandling(
      memberId,
      Number(redemptionCompanyId),
      Number(redemptionOfferId),
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
