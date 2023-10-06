import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DbHelper } from '@blc-mono/core/aws/dynamodb/dbhelper';
import { Menus } from './types';
import { TYPE_KEYS } from './consts';

const logger = new Logger({ serviceName: `queryLambdaResolver` });
const offerHomepageTableName = process.env.OFFER_HOMEPAGE_TABLE as string;

export async function resolveGetOfferMenusByBrandId(event: AppSyncResolverEvent<any>) {
  const brandId = event.arguments?.brandId;

  if (!brandId) {
    logger.error('brandId is required', { brandId });
    throw new Error('brandId is required');
  }

  const data = await getOffersHomepageFiles(brandId)

  if (!data || !data.Responses || !data.Responses[offerHomepageTableName]) {
    logger.error('No homepage menus found for brandId', { brandId });
    throw new Error(`No homepagemenus found for brandId ${brandId}`);
  }

  const menus: Menus = {};

  const homePageItems = data.Responses[offerHomepageTableName]

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

async function getOffersHomepageFiles(brandId: string) {
  const params = {
    RequestItems: {
      [offerHomepageTableName]: {
        Keys: [
          { id: brandId, type: TYPE_KEYS.DEALS }, 
          { id: brandId, type: TYPE_KEYS.FLEXIBLE },
          { id: brandId, type: TYPE_KEYS.MARKETPLACE }, 
          { id: brandId, type: TYPE_KEYS.FEATURED }
        ]
      }
    }
  };

  return DbHelper.batchGet(params);
}