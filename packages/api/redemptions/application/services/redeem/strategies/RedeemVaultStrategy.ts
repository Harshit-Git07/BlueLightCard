import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { getKeysFromSecretManager } from '@blc-mono/redemptions/application/helpers/newVaultAuth';
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
import { StrategyParams } from '../RedeemService';

import { IRedeemStrategy, RedeemVaultStrategyResult } from './IRedeemStrategy';

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

  async redeem(redemption: Redemption, params: StrategyParams): Promise<RedeemVaultStrategyResult> {
    const memberId = params.memberId;
    const vault = await this.vaultsRepository.findOneByRedemptionId(redemption.id);
    if (!vault) {
      this.logger.error({
        message: `Vault not found`,
        context: {
          redemptionId: redemption.id,
        },
      });
      return {
        kind: 'VaultNotFound',
      };
    }
    switch (vault.vaultType) {
      case 'standard':
        return this.handleRedeemStandardVault(vault, redemption, memberId);
      case 'legacy':
        return this.handleRedeemLegacyVault(vault, redemption, memberId);
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
      return {
        kind: 'RedemptionUrlNotFound',
      };
    }
    if (vault.status !== 'active') {
      return {
        kind: 'VaultInactive',
      };
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
      return {
        kind: 'ErrorWhileRedeemingVault',
      };
    }

    return {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: {
        url: redemption.url,
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
      return {
        kind: 'RedemptionUrlNotFound',
      };
    }
    // AWS Key setup
    const secrets = await getKeysFromSecretManager('blc-mono-redemptions/NewVaultSecrets');
    const checkHowManyCodesIssuedResponse = await this.legacyVaultApiRepository.getNumberOfCodesIssued(
      secrets,
      memberId,
      redemption.companyId,
      redemption.offerId,
    );
    if (!checkHowManyCodesIssuedResponse) {
      return {
        kind: 'ErrorWhileRedeemingVault',
      };
    }

    if (checkHowManyCodesIssuedResponse.status !== 200 || !checkHowManyCodesIssuedResponse.data) {
      this.logger.error({
        message: `Lambda Scripts API - Error while hitting endpoint of get number of codes issued`,
        context: {
          kind: 'CheckHowManyCodesIssuedApiRequestNonSuccessful',
          response: checkHowManyCodesIssuedResponse,
        },
      });
      return { kind: 'CheckHowManyCodesIssuedApiRequestNonSuccessful' };
    }

    const amountIssued = checkHowManyCodesIssuedResponse.data;
    if (amountIssued >= (vault.maxPerUser ?? 0)) return { kind: 'MaxPerUserReached' };

    const assignCodeResponse = await this.legacyVaultApiRepository.assignCodeToMember(
      secrets,
      memberId,
      redemption.companyId,
      redemption.offerId,
    );
    if (!assignCodeResponse) {
      return {
        kind: 'ErrorWhileRedeemingVault',
      };
    }

    if (assignCodeResponse?.status !== 200 || !assignCodeResponse.data?.code) {
      this.logger.error({
        message: `Lambda Scripts API - Error while hitting endpoint of assign code to member`,
        context: {
          kind: 'AssignCodeApiRequestNonSuccessful',
          response: assignCodeResponse,
        },
      });
      return { kind: 'AssignCodeApiRequestNonSuccessful' };
    }

    return {
      kind: 'Ok',
      redemptionType: 'vault',
      redemptionDetails: {
        url: redemption.url,
        code: assignCodeResponse.data.code,
      },
    };
  }
}
