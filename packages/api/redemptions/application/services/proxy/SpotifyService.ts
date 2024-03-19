import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { ILegacyVaultApiRepository, LegacyVaultApiRepository } from '../../repositories/LegacyVaultApiRepository';

export type RedeemSpotifyResult =
  | {
      kind: 'CodeRedemedOk';
      data: {
        trackingUrl: string;
        code: number;
      };
    }
  | {
      kind: 'AssignUserCodeOk';
      data: {
        trackingUrl: string;
        code: number;
        dwh?: boolean;
      };
    };

export interface ISpotifyService {
  redeem(
    platform: string,
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
    platform: string,
    companyId: number,
    offerId: number,
    memberId: string,
    url: string,
  ): Promise<RedeemSpotifyResult> {
    const codeRedeemedResponse = await this.legacyVaultApiRepository.redeemCode(platform, companyId, offerId, memberId);

    if (!codeRedeemedResponse) {
      this.logger.error({
        message: 'Could not send request to code redeemed API',
        context: {
          platform,
          companyId,
          offerId,
          memberId,
        },
      });
      throw new Error('Could not send request to code redeemed API');
    }

    const codeRedeemedData = this.legacyVaultApiRepository.getResponseData(codeRedeemedResponse, url);

    if (!codeRedeemedData) {
      this.logger.error({
        message: 'Code redeemed API request non successful',
        context: {
          platform,
          companyId,
          offerId,
          memberId,
          response: codeRedeemedResponse,
        },
      });
      throw new Error('Code redeemed API request non successful');
    }

    if (codeRedeemedData?.codes.length) {
      return {
        kind: 'CodeRedemedOk',
        data: {
          trackingUrl: codeRedeemedData.trackingUrl,
          code: codeRedeemedData.code,
        },
      };
    }

    const assignUserResponse = await this.legacyVaultApiRepository.assignCodeToMember(
      memberId,
      companyId,
      offerId,
      platform,
    );

    if (!assignUserResponse) {
      this.logger.error({
        message: 'Could not send request to assign code API',
        context: {
          memberId,
          companyId,
          offerId,
          platform,
        },
      });
      throw new Error('Could not send request to assign code API');
    }

    const assignedUserResponseData = this.legacyVaultApiRepository.getResponseData(assignUserResponse, url);

    if (!assignedUserResponseData) {
      this.logger.error({
        message: 'Assign code API request non successful',
        context: {
          memberId,
          companyId,
          offerId,
          platform,
          response: assignUserResponse,
        },
      });
      throw new Error('Assign code API request non successful');
    }

    return {
      kind: 'AssignUserCodeOk',
      data: {
        trackingUrl: assignedUserResponseData.trackingUrl,
        code: assignedUserResponseData.code,
        dwh: true,
      },
    };
  }
}
