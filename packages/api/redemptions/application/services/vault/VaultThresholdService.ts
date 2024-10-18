import { MemberRedemptionEvent } from '@blc-mono/core/schemas/redemptions';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { AdminEmailRepository, IAdminEmailRepository } from '../../repositories/AdminEmailRepository';
import { IVaultCodesRepository, VaultCodesRepository } from '../../repositories/VaultCodesRepository';

export type VaultThresholdEmailShouldBeSentData = {
  offerId: string;
  companyId: string;
  platform: 'BLC_UK' | 'BLC_AU' | 'DDS_UK';
  vaultDetails: {
    id: string;
    alertBelow: number;
    vaultType: 'legacy' | 'standard';
    email: string;
  };
};

export type VaultThresholdEmailShouldBeSentResponse =
  | {
      decision: true;
      vault: {
        thresholdPercentage: number;
        alertBelow: number;
        remainingCodes: number;
      };
    }
  | {
      decision: false;
    };

export type CheckIfRemainingVaultCodesThresholdIsValidResponse = {
  thresholdPercentage: number | false;
  remainingCodes: number;
};

export interface IVaultThresholdService {
  handleVaultThresholdEmail(data: MemberRedemptionEvent['detail']): Promise<void>;
}

export class VaultThresholdService implements IVaultThresholdService {
  static readonly key = 'VaultThresholdService';
  static readonly inject = [Logger.key, VaultCodesRepository.key, AdminEmailRepository.key] as const;

  private readonly acceptedThresholds = [100, 75, 50, 25, 0];

  constructor(
    private readonly logger: ILogger,
    private readonly vaultCodesRepo: IVaultCodesRepository,
    private readonly adminEmailRepo: IAdminEmailRepository,
  ) {}

  public checkIfVaultThresholdHit(alertBelow: number, unclaimedCodes: number): number | false {
    /**
     * Iterate through the list of thresholds, converting them to the number of unclaimed
     * codes required to trigger the threshold. Keyed by unclaimed, example for 5000 alert below:
     *
     * {0: 0, 1250: 25, 2500: 50, 3750: 75, 5000: 100}
     *
     * In this example, we:
     * - trigger the 100% threshold at 5000 remaining unclaimed codes;
     * - trigger the 75% threshold at 3750 remaining unclaimed codes;
     * - trigger the 50% threshold at 2500 remaining unclaimed codes;
     * - trigger the 25% threshold at 1250 remaining unclaimed codes;
     * - trigger the 0% threshold at 0 remaining unclaimed codes.
     */
    const thresholds: Record<number, number> = this.acceptedThresholds.reduce(
      (accumulator, thresholdPercentage) => {
        // Float precision is lost when dividing by 100 due to javascript, so we need to use a high precision divide
        const highPrecisionDivide = Number(((alertBelow / 100) * thresholdPercentage).toFixed(3));
        const totalUnclaimedPercentage = Math.floor(highPrecisionDivide);
        // Map the calculated unclaimed percentage to its corresponding threshold percentage.
        accumulator[totalUnclaimedPercentage] = thresholdPercentage;
        return accumulator;
      },
      {} as Record<number, number>, // Initialize the accumulator as an empty object.
    );

    this.logger.info({
      message: 'Vault Threshold Email - Thresholds',
      context: { thresholds, unclaimedCodes },
    });

    const thresholdPercentage = thresholds[unclaimedCodes];
    return thresholdPercentage ?? false;
  }

  public async handleVaultThresholdEmail(detailData: MemberRedemptionEvent['detail']): Promise<void> {
    const { redemptionDetails } = detailData;
    const vaultDetails = redemptionDetails.vaultDetails;
    if (!vaultDetails) {
      this.logger.error({
        message: 'Vault Threshold Email - Vault details are missing',
        context: { detailData },
      });
      return;
    }
    if (vaultDetails.vaultType !== 'standard') return;
    const unclaimedCodes = await this.vaultCodesRepo.checkVaultCodesRemaining(vaultDetails.id);
    const thresholdPercentage = this.checkIfVaultThresholdHit(vaultDetails.alertBelow, unclaimedCodes);
    if (thresholdPercentage !== false && this.acceptedThresholds.includes(thresholdPercentage)) {
      await this.adminEmailRepo.sendVaultThresholdEmail({
        alertBelow: vaultDetails.alertBelow,
        companyName: redemptionDetails.companyName,
        offerId: redemptionDetails.offerId,
        offerName: redemptionDetails.offerName,
        remainingCodes: unclaimedCodes,
        thresholdPercentage: thresholdPercentage,
        recipient: vaultDetails.email,
      });
      return;
    }
    this.logger.error({
      message: 'Vault Threshold Email Standard - Email was not sent',
      context: {
        redemptionDetails,
        vaultDetails,
        thresholdPercentage,
      },
    });
  }
}
