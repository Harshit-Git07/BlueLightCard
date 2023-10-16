import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { ObjectDynamicKeys } from './types';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';
import { OfferHomepageRepository } from '../../../../../repositories/offersHomepageRepository';
import { unpackJWT } from '../../../../../../../core/src/utils/unpackJWT';
import { getAge } from '../../../../../../../core/src/utils/getAge';
import { CompanyDislikes } from '../../../../../services/CompanyDislikes';
import { UserProfile } from '../../../../../services/UserProfile';
import { OfferRestriction } from '../../../../../services/OfferRestriction';

export class OfferMenusByBrandIdResolver {
  constructor(
    private brandId: string,
    private tableName: string,
    private offerHomepageRepository: OfferHomepageRepository,
    private logger: Logger,
  ) {
    logger.info('OfferMenusByBrandIdResolver Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {
    const data = await getHomePageMenus(this.brandId, this.offerHomepageRepository);

    if (!data || !data.Responses || !data.Responses[this.tableName]) {
      this.logger.error('No homepage menus found for brandId', { brandId: this.brandId });
      throw new Error(`No homepage menus found for brandId ${this.brandId}`);
    }

    const authHeader: string = event.request.headers.authorization ?? '';
    const { 'custom:blc_old_id': legacyUserId } = unpackJWT(authHeader);
    //dislike data from microservice
    let dislikedCompanyIds: number[] = [];
    const dislikes = new CompanyDislikes(Number(legacyUserId));
    const userDislikesRequest = dislikes.getDislikesRequest();

    const profile = new UserProfile(authHeader);
    const userProfileRequest = profile.getUserProfileRequest();

    //user profile data for organisation and dob
    let organisation: string = '';
    let dob: string = '';

    try {
      const [dislikeResponse, userProfileResponse] = await Promise.all([userDislikesRequest, userProfileRequest]);
      dislikedCompanyIds = dislikeResponse.data.data;
      organisation = userProfileResponse.data.data.profile.organisation;
      dob = userProfileResponse.data.data.profile.dob;
    } catch (e) {
      console.log(e);
    }

    const isUnder18 = getAge(dob); // calculate from dob
    const restrictOffers = new OfferRestriction(organisation, isUnder18, dislikedCompanyIds);

    const menus: ObjectDynamicKeys = {};

    const homePageItems = data.Responses[this.tableName];

    homePageItems.forEach(({ type, json }) => {
      menus[type] = JSON.parse(json);
    });

    const marketPlaceMenus = menus[TYPE_KEYS.MARKETPLACE];

    const numberOfSliders = Object.keys(marketPlaceMenus).length;
    const slidersFileArray = Array.from({ length: numberOfSliders }, (value, index) => `${index + 1}.txt`);

    const formattedMarketPlaceMenus = slidersFileArray.map((key: string) => {
      const slider = marketPlaceMenus[key];

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
      return slider;
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
