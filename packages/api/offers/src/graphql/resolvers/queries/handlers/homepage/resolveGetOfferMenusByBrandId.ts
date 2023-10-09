import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { ObjectDynamicKeys } from './types';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';
import { OfferHomepageRepository } from "../../../../../repositories/offersHomepageRepository";

export class OfferMenusByBrandIdResolver {
  
  constructor(
    private brandId: string, 
    private tableName: string, 
    private offerHomepageRepository: OfferHomepageRepository, 
    private logger: Logger
  ) {
    logger.info('OfferMenusByBrandIdResolver Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {
    const data = await getHomePageMenus(this.brandId, this.offerHomepageRepository)

    if (!data || !data.Responses || !data.Responses[this.tableName]) {
      this.logger.error('No homepage menus found for brandId', { brandId: this.brandId });
      throw new Error(`No homepage menus found for brandId ${this.brandId}`);
    }

    const menus: ObjectDynamicKeys = {};

    const homePageItems = data.Responses[this.tableName]

    homePageItems.forEach(({ type, json }) => {
      menus[type] = JSON.parse(json);
    })
    
    const marketPlaceMenus = menus[TYPE_KEYS.MARKETPLACE]

    const numberOfSliders = Object.keys(marketPlaceMenus).length
    const slidersFileArray = Array.from({length: numberOfSliders}, (v, i) => `${i + 1}.txt`)

    const formattedMarketPlaceMenus = slidersFileArray.map((key: string) => {
      const slider = marketPlaceMenus[key]

      if (slider.items) {
        slider.items = Object.entries(slider.items).map(([id, item]) => ({ id, item }));
      }
      
      return slider;
    });

    return {
      features: menus[TYPE_KEYS.FEATURED],
      flexible: menus[TYPE_KEYS.FLEXIBLE],
      deals: menus[TYPE_KEYS.DEALS],
      marketPlace: formattedMarketPlaceMenus,
    };
  }
}

const getHomePageMenus = async (
  brandId: string, 
  offerHomepageRepository: OfferHomepageRepository
) =>
  offerHomepageRepository.batchGetByIds(
    [
      { id: brandId, type: TYPE_KEYS.DEALS }, 
      { id: brandId, type: TYPE_KEYS.FLEXIBLE },
      { id: brandId, type: TYPE_KEYS.MARKETPLACE }, 
      { id: brandId, type: TYPE_KEYS.FEATURED }
    ]
  )