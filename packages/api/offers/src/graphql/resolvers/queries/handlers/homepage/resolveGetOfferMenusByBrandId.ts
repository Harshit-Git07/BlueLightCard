import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { ObjectDynamicKeys } from './types';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';
import { OfferHomepageRepository } from '../../../../../repositories/offersHomepageRepository';
import { unpackJWT } from '../../../../../../../core/src/utils/unpackJWT';
import { MemberProfile } from "../../../../../services/MemberProfile";
import { OfferRestriction } from "../../../../../services/OfferRestriction";
import { FIFTEEN_MINUTES } from "../../../../../utils/duration"
import { CacheService } from '../../../../../services/CacheService';

export class OfferMenusByBrandIdResolver {

  private readonly cacheKey = `${this.brandId}-offers-homepage`
  constructor(
    private brandId: string,
    private tableName: string,
    private offerHomepageRepository: OfferHomepageRepository,
    private logger: Logger,
    private cacheService: CacheService
  ) {
    logger.info('OfferMenusByBrandIdResolver Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {
    this.logger.info('OfferMenusByBrandIdResolver handler', { event })

    const cache = await this.cacheService.get(this.cacheKey);
    let menus: ObjectDynamicKeys = {};

    if (!cache) {
      const data = await getHomePageMenus(this.brandId, this.offerHomepageRepository);
      
      if (!data || !data.Responses || !data.Responses[this.tableName]) {
        this.logger.error('No homepage menus found for brandId', { brandId: this.brandId });
        throw new Error(`No homepage menus found for brandId ${this.brandId}`);
      }

      const homePageItems = data.Responses[this.tableName];
      
      homePageItems.forEach(({ type, json }) => {
        menus[type] = JSON.parse(json);
      });

      await this.cacheService.set(this.cacheKey, JSON.stringify(menus), FIFTEEN_MINUTES);
    } else {
      menus = JSON.parse(cache);
    }

    const authHeader: string = event.request.headers.authorization ?? '';
    const { 'custom:blc_old_id': legacyUserId } = unpackJWT(authHeader);

    const memberProfileService = new MemberProfile(legacyUserId, authHeader, this.logger);
    const { organisation, isUnder18, dislikedCompanyIds } = await memberProfileService.getProfile();

    const restrictOffers = new OfferRestriction(organisation, isUnder18, dislikedCompanyIds);

    const marketPlaceMenus = menus[TYPE_KEYS.MARKETPLACE];

    const numberOfSliders = Object.keys(marketPlaceMenus).length;
    const slidersFileArray = Array.from({ length: numberOfSliders }, (value, index) => `${index + 1}.txt`);

    const formattedMarketPlaceMenus = slidersFileArray.reduce((accumulator: any [], key: string) => {
      const slider = marketPlaceMenus[key];
      if (!slider.hidden) {
        if (slider.items) {
          slider.items = Object.entries(slider.items).reduce((accumulator: { id: String; item: any }[], [id, item]) => {
            if (!restrictOffers.isMarketPlaceMenuItemRestricted(item)) {
              accumulator.push({
                id,
                item,
              });
            }
            return accumulator;
          }, []);
        }
        accumulator.push(slider);
      }
      return accumulator;
    }, []);

    const flexibleMenus = menus[TYPE_KEYS.FLEXIBLE];

    flexibleMenus.forEach((flexible: any) => {
      if (flexible.items) {
        flexible.items = flexible.items.filter((offer: any) => !restrictOffers.isFlexibleMenuItemRestricted(offer));
      }
    });
    const filteredFeaturedOffers = menus[TYPE_KEYS.FEATURED].filter(
      (offer: any) => !restrictOffers.isFeaturedOfferRestricted(offer),
    );
    const filteredDeals = menus[TYPE_KEYS.DEALS].filter(
      (offer: any) => !restrictOffers.isDealOfTheWeekRestricted(offer),
    );

    return {
      features: filteredFeaturedOffers,
      flexible: flexibleMenus,
      deals: filteredDeals,
      marketPlace: formattedMarketPlaceMenus,
    };
  }
}

const getHomePageMenus = async (brandId: string, offerHomepageRepository: OfferHomepageRepository) =>
  offerHomepageRepository.batchGetByIds([
    {
      id: brandId,
      type: TYPE_KEYS.DEALS,
    },
    {
      id: brandId,
      type: TYPE_KEYS.FLEXIBLE,
    },
    {
      id: brandId,
      type: TYPE_KEYS.MARKETPLACE,
    },
    {
      id: brandId,
      type: TYPE_KEYS.FEATURED,
    },
  ]);
