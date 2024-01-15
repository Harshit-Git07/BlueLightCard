import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { ObjectDynamicKeys } from './types';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';
import { OfferHomepageRepository } from '../../../../../repositories/offersHomepageRepository';
import sortNumbers from '../../../../../../../core/src/utils/sortNumbers';
import { OfferRestriction } from '../../../../../../../core/src/offers/offerRestriction';
import { OfferRestrictionQueryInput } from '../../../../../models/queries-input/offerRestrictionQueryInput';
import { validateBrand, validateOfferRestrictionInput } from '../../../../../utils/validation';

export class OfferMenusByBrandIdResolver {
  constructor(
    private tableName: string,
    private offerHomepageRepository: OfferHomepageRepository,
    private logger: Logger,
  ) {
    logger.info('OfferMenusByBrandIdResolver Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {
    this.logger.info('OfferMenusByBrandIdResolver handler', { event });
    const brandId = event.arguments.brandId;
    if (!validateBrand(brandId)) {
      this.logger.error('Invalid brandId', { brandId });
      throw new Error(`Invalid brandId ${brandId}`);
    }
    const { isUnder18, organisation }: OfferRestrictionQueryInput = validateOfferRestrictionInput(
      event.arguments.input,
      this.logger,
    );

    let menus: ObjectDynamicKeys = {};

    this.logger.debug('OfferMenusByBrandIdResolver - Cache Does not exist. retrieve data from Dynamo', { brandId });
    const data = await getHomePageMenus(brandId, this.offerHomepageRepository);
    this.logger.debug('OfferMenusByBrandIdResolver - Data from Dynamo', { data });

    if (!data || !data.Responses || !data.Responses[this.tableName]) {
      this.logger.error('No homepage menus found for brandId', { brandId });
      throw new Error(`No homepage menus found for brandId ${brandId}`);
    }

    const homePageItems = data.Responses[this.tableName];

    homePageItems.forEach(({ type, json }) => {
      menus[type] = JSON.parse(json);
    });

    this.logger.debug('OfferMenusByBrandIdResolver - Apply OfferRestriction', { brandId, isUnder18, organisation });
    const restrictOffers = new OfferRestriction({ organisation, isUnder18 });
    this.logger.debug('OfferMenusByBrandIdResolver - OfferRestriction applied', { brandId, isUnder18, organisation });

    const marketPlaceMenus = menus[TYPE_KEYS.MARKETPLACE];

    const slidersFileArray = Object.keys(marketPlaceMenus)
      .map((sliderFileName) => parseInt(sliderFileName.split('.')[0]))
      .sort(sortNumbers);

    this.logger.debug('OfferMenusByBrandIdResolver - slidersFileArray before reduce', { slidersFileArray });
    const formattedMarketPlaceMenus = slidersFileArray.reduce((accumulator: any[], key: number) => {
      const slider = marketPlaceMenus[`${key}.txt`];
      if (slider && !slider.hidden) {
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
    this.logger.debug('OfferMenusByBrandIdResolver - formattedMarketPlaceMenus after reduce', {
      formattedMarketPlaceMenus,
    });

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
