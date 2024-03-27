import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PromotionUpdatedEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/promotions/PromotionUpdateController';
import {
  AffiliateConfiguration,
  AffiliateConfigurationHelper,
} from '@blc-mono/redemptions/application/helpers/affiliateConfiguration';
import { isSpotifyUrl } from '@blc-mono/redemptions/application/helpers/isSpotifyUrl';
import {
  ILegacyVaultApiRepository,
  LegacyVaultApiRepository,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import {
  IRedemptionsRepository,
  RedemptionsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { Affiliate, Connection, OfferType } from '@blc-mono/redemptions/libs/database/schema';

export enum PromotionUpdateResults {
  NO_PROMOTIONS_UPDATED = 'NO_PROMOTIONS_UPDATED',
  PROMOTION_UPDATED_SUCCESS = 'PROMOTION_UPDATED_SUCCESS',
  NO_PROMOTION_TO_UPDATE = 'NO_PROMOTION_TO_UPDATE',
}

export type PromotionUpdateResult =
  | {
      kind: PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS;
    }
  | {
      kind: PromotionUpdateResults.NO_PROMOTIONS_UPDATED;
    }
  | {
      kind: PromotionUpdateResults.NO_PROMOTION_TO_UPDATE;
    };

type RedemptionConnection = {
  affiliate?: Affiliate | null;
  connection?: Connection;
  offerType: OfferType;
  url?: string | null;
};

export interface IPromotionUpdateService {
  handlePromotionUpdate(event: PromotionUpdatedEvent): Promise<PromotionUpdateResult>;
}

export class PromotionUpdateService implements IPromotionUpdateService {
  public static key = 'PromotionUpdateService' as const;

  static readonly inject = [Logger.key, LegacyVaultApiRepository.key, RedemptionsRepository.key] as const;

  constructor(
    protected logger: ILogger,
    private readonly legacyVaultApiRepository: ILegacyVaultApiRepository,
    private readonly redemptionRepository: IRedemptionsRepository,
  ) {}

  private isDirectLink(link: string): boolean {
    return !!link;
  }

  private isSpotifyLink(link: string): boolean {
    return isSpotifyUrl(link);
  }

  private getAffiliateLink(link: string): AffiliateConfiguration | null {
    return new AffiliateConfigurationHelper(link).getConfig();
  }

  private parseAffiliateLink(link: string): RedemptionConnection | null {
    const affiliateConfig = this.getAffiliateLink(link);
    if (affiliateConfig) {
      return {
        affiliate: affiliateConfig.affiliate,
        url: link,
        connection: 'affiliate',
        offerType: 'online',
      };
    }
    return null;
  }

  private parseConnection(link: string): RedemptionConnection | undefined {
    if (!this.isDirectLink(link)) {
      return {
        affiliate: null,
        url: null,
        connection: 'none',
        offerType: 'in-store',
      };
    }
    if (this.isSpotifyLink(link)) {
      return {
        affiliate: null,
        url: link,
        connection: 'spotify',
        offerType: 'online',
      };
    }
    const affiliateConfig = this.parseAffiliateLink(link);
    if (affiliateConfig) {
      return affiliateConfig;
    }
    return {
      affiliate: null,
      url: link,
      connection: 'direct',
      offerType: 'online',
    };
  }

  public async handlePromotionUpdate(event: PromotionUpdatedEvent): Promise<PromotionUpdateResult> {
    const { platform, link, id: linkId } = event.detail;

    const legacyVaults = await this.legacyVaultApiRepository.findVaultsRelatingToLinkId(linkId, platform);
    if (legacyVaults.length === 0) {
      //this is possible if a link has been created that has not assigned to a vault, that is then updated
      return {
        kind: PromotionUpdateResults.NO_PROMOTION_TO_UPDATE,
      };
    }

    const offerIds = legacyVaults.map((vault) => vault.offerId);

    this.logger.info({
      message: 'Processing promotion updated event',
      context: {
        linkId,
        offerIds,
      },
    });

    const connection = this.parseConnection(link);
    if (!connection) {
      this.logger.error({
        message: 'Promotion Update - Parse connection failed',
        context: {
          link,
        },
      });
      throw new Error(`Promotion Update - Parse connection failed (link="${link}")`);
    }

    const results = await this.redemptionRepository.updateManyByOfferId(offerIds, {
      ...connection,
    });

    if (!results.length) {
      return {
        kind: PromotionUpdateResults.NO_PROMOTIONS_UPDATED,
      };
    }

    return {
      kind: PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS,
    };
  }
}
