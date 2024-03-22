import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { Platform } from '@blc-mono/redemptions/libs/database/schema';

import { ILegacyVaultApiRepository, LegacyVaultApiRepository } from '../../repositories/LegacyVaultApiRepository';

export type RedeemSpotifyResult = {
  kind: 'Ok';
  data: {
    trackingUrl: string;
    code: string;
    dwh?: boolean;
  };
};

export interface ISpotifyService {
  redeem(
    platform: Platform,
    companyId: number,
    offerId: number,
    memberId: string,
    url: string,
  ): Promise<RedeemSpotifyResult>;
}

export class SpotifyService implements ISpotifyService {
  static readonly key = 'SpotifyService';
  static readonly inject = [LegacyVaultApiRepository.key, Logger.key] as const;

  constructor(private readonly legacyVaultApiRepository: ILegacyVaultApiRepository, private readonly logger: ILogger) {}

  public async redeem(
    platform: Platform,
    companyId: number,
    offerId: number,
    memberId: string,
    url: string,
  ): Promise<RedeemSpotifyResult> {
    // Check if user has already redeemed a code
    const codesRedeemed = await this.legacyVaultApiRepository.getCodesRedeemed(companyId, offerId, memberId, platform);

    // If so, return the tracking URL with the already redeemed code
    if (codesRedeemed.length) {
      const code = codesRedeemed[0];
      const trackingUrl = await this.getTrackingUrl(url, code);

      return {
        kind: 'Ok',
        data: {
          code,
          trackingUrl,
        },
      };
    }

    // Otherwise, assign a new code to the user
    const { code } = await this.legacyVaultApiRepository.assignCodeToMember(memberId, companyId, offerId, platform);
    const trackingUrl = await this.getTrackingUrl(url, code);

    return {
      kind: 'Ok',
      data: {
        trackingUrl,
        code,
        dwh: true,
      },
    };
  }

  private async getTrackingUrl(url: string, code: string) {
    return url.replace('!!!CODE!!!', code);
  }
}
