import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PromotionUpdatedEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/promotions/PromotionUpdateController';
import {
  AffiliateConfiguration,
  AffiliateConfigurationHelper,
} from '@blc-mono/redemptions/application/helpers/affiliateConfiguration';
import { isSpotifyUrl } from '@blc-mono/redemptions/application/helpers/isSpotifyUrl';
import { LegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { RedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { Affiliate, Connection, OfferType, Platform } from '@blc-mono/redemptions/libs/database/schema';
import { SecretsErrorResponse } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

export enum PromotionUpdateResults {
  PROMOTION_UPDATE_UNSUCCESSFUL = 'PROMOTION_UPDATE_UNSUCCESSFUL',
  PROMOTION_UPDATED_SUCCESS = 'PROMOTION_UPDATED_SUCCESS',
}

interface PromotionsUpdatePayload {
  message: string;
}

export interface PromotionUpdateResult {
  kind: PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS | PromotionUpdateResults.PROMOTION_UPDATE_UNSUCCESSFUL;
  payload: PromotionsUpdatePayload;
}

interface RedemptionConnection {
  affiliate?: Affiliate;
  connection?: Connection;
  offerType: OfferType;
  url?: string | null;
}

export interface metaData {
  platform?: Platform;
  dependentEntities: {
    type: string;
    offerId: number;
    companyId: number;
  }[];
}

export interface RedemptionUpdate extends RedemptionConnection {
  companyId: number;
  meta: metaData;
}

const bandMap = {
  BLC_UK: 'BLC',
  DDS_UK: 'BLC',
  BLC_AU: 'BLC_AU',
};

const isMetaData = (metaData: metaData | SecretsErrorResponse): metaData is metaData => {
  const data = metaData as unknown as metaData;
  return data.dependentEntities !== undefined;
};

interface IPromotionUpdateServiceInterface {
  handlePromotionUpdate(event: PromotionUpdatedEvent): Promise<PromotionUpdateResult>;
}

export class PromotionUpdateService implements IPromotionUpdateServiceInterface {
  public static key = 'PromotionUpdateService' as const;

  static readonly inject = [Logger.key, LegacyVaultApiRepository.key, RedemptionsRepository.key] as const;

  constructor(
    protected logger: ILogger,
    private readonly legacyVaultApiRepository: LegacyVaultApiRepository,
    private readonly redemptionRepository: RedemptionsRepository,
  ) {}
  private getMetaData(linkId: number, brand: string) {
    return this.legacyVaultApiRepository.getVaultByLinkId(linkId, brand);
  }

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
    const {
      detail: { companyId, platform, link, id: linkId },
    } = event;

    const currentPlatform = platform as Platform;

    if (!link) {
      this.logger.info({ message: 'event not supported link is not defined' });
      throw new Error('event not supported link is not defined');
    }

    const brand = bandMap[currentPlatform];

    const meta = await this.getMetaData(linkId, brand);

    if (!isMetaData(meta)) {
      return {
        kind: PromotionUpdateResults.PROMOTION_UPDATE_UNSUCCESSFUL,
        payload: {
          message: 'unexpected meta data receive',
        },
      };
    }

    this.logger.info({
      message: `Processing promotion updated event ${linkId} ${JSON.stringify(meta)}`,
    });

    const connection = this.parseConnection(link);
    if (!connection) {
      this.logger.info({ message: 'failed to parse connection' });
      throw new Error('failed to parse connection');
    }

    const redemptionUpdate: RedemptionUpdate = {
      ...connection,
      companyId,
      meta: {
        platform: currentPlatform,
        ...meta,
      },
    };

    const results = await this.redemptionRepository.updateManyByOfferId(redemptionUpdate);
    const message = results.length ? `promotion updated` : `no promotion updated`;

    const payload: PromotionsUpdatePayload = {
      message,
    };

    if (!results.length) {
      return {
        kind: PromotionUpdateResults.PROMOTION_UPDATE_UNSUCCESSFUL,
        payload,
      };
    }
    return {
      kind: PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS,
      payload,
    };
  }
}
