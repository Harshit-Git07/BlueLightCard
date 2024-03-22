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
}

export type PromotionUpdateResult =
  | {
      kind: PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS;
    }
  | {
      kind: PromotionUpdateResults.NO_PROMOTIONS_UPDATED;
    };

type RedemptionConnection = {
  affiliate?: Affiliate;
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

  private parseAffiliateLink(link: string): RedemptionConnection {
    const affiliateConfig = this.getAffiliateLink(link);
    if (!affiliateConfig) {
      return {
        connection: 'direct',
        offerType: 'online',
        url: link,
      };
    }
    return {
      affiliate: affiliateConfig.affiliate,
      connection: 'affiliate',
      offerType: 'online',
    };
  }

  private parseConnection(link: string): RedemptionConnection | undefined {
    const affiliateConfig = this.parseAffiliateLink(link);
    if (affiliateConfig) {
      return affiliateConfig;
    }
    if (!this.isDirectLink(link)) {
      return {
        connection: 'direct',
        offerType: 'in-store',
      };
    }
    if (this.isSpotifyLink(link)) {
      return {
        connection: 'spotify',
        offerType: 'online',
        url: link,
      };
    }
  }

  public async handlePromotionUpdate(event: PromotionUpdatedEvent): Promise<PromotionUpdateResult> {
    const { companyId, platform, link, id: linkId } = event.detail;

    const legacyVaults = await this.legacyVaultApiRepository.findVaultsRelatingToLinkId(linkId, platform);
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
      companyId,
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
