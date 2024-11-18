import { useContext, useEffect, useState } from 'react';
import { OFFERS_BRAND } from '@/global-vars';
import { homePageQuery } from '../../graphql/homePageQueries';
import { makeHomePageQueryWithDislikeRestrictions } from '../../graphql/makeQuery';
import {
  BannerType,
  DealsOfTheWeekType,
  FeaturedOffersType,
  FlexibleMenuType,
  MarketPlaceItemType,
  MarketPlaceMenuType,
} from '@/page-types/members-home';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { shuffle } from 'lodash';
import { bannerQuery } from '@/root/src/graphql/bannerQuery';
import UserContext, { User } from '@/context/User/UserContext';
import { WebPlatformAdapter } from '@/utils/WebPlatformAdapter';
import { V5_API_URL } from '@/globals/apiUrl';
import AuthContext from '../context/Auth/AuthContext';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';

const useFetchHomepageData = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [dealsOfTheWeek, setDealsOfTheWeek] = useState<DealsOfTheWeekType[]>([]);
  const [marketplaceMenus, setMarketplaceMenus] = useState<MarketPlaceMenuType[]>([]);
  const [flexibleMenu, setFlexibleMenu] = useState<FlexibleMenuType[]>([]);
  const [featuredOffers, setFeaturedOffers] = useState<FeaturedOffersType[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  const searchV5Experiment = useAmplitudeExperiment(AmplitudeExperimentFlags.SEARCH_V5, 'control');
  const offersCmsExperiment = useAmplitudeExperiment(AmplitudeExperimentFlags.CMS_OFFERS, 'off');
  const brazeContentCardsEnabled = useAmplitudeExperiment(
    AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED,
    'control'
  );
  const useLegacyIds = offersCmsExperiment.data?.variantName !== 'on';

  const platformAdapter = usePlatformAdapter();

  useEffect(() => {
    if (
      searchV5Experiment.status === 'pending' ||
      offersCmsExperiment.status === 'pending' ||
      brazeContentCardsEnabled.status === 'pending'
    ) {
      return;
    }

    const user = userCtx.user;

    let homePage;

    const currentFetchHomepageData = async () => {
      if (!userCtx.user || userCtx.error) return;

      try {
        const homePageData = await makeHomePageQueryWithDislikeRestrictions(
          homePageQuery(
            OFFERS_BRAND,
            userCtx.isAgeGated ?? true,
            user?.profile.organisation ?? 'NHS'
          ),
          userCtx.dislikes
        );
        homePage = homePageData.data;
      } catch (e) {
        setLoadingError(true);
        return;
      }
      const slicedBanners = shuffle(homePage.banners).slice(0, 3);

      setBanners(slicedBanners as BannerType[]);

      setDealsOfTheWeek(homePage.offerMenus?.deals as DealsOfTheWeekType[]);
      setMarketplaceMenus(homePage.offerMenus?.marketPlace as MarketPlaceMenuType[]);
      setFlexibleMenu(homePage.offerMenus?.flexible as FlexibleMenuType[]);
      setFeaturedOffers(homePage.offerMenus.features as FeaturedOffersType[]);
      setLoadingError(false);

      setHasLoaded(true);
    };

    const experimentFetchHomepageData = async (shouldFetchLegacyBanners: boolean) => {
      if (!userCtx.user || userCtx.error) return;

      try {
        const [menusData, legacyBanners] = await Promise.all([
          getMenus(user, platformAdapter, useLegacyIds),
          shouldFetchLegacyBanners
            ? getBanners(userCtx.isAgeGated, userCtx.dislikes)
            : Promise.resolve([]),
        ]);

        const slicedBanners = shuffle(legacyBanners).slice(0, 3);
        setBanners(slicedBanners);

        setDealsOfTheWeek(menusData.dealsOfTheWeek);
        setMarketplaceMenus(menusData.marketplaceMenus);
        setFlexibleMenu(menusData.flexibleMenu);
        setFeaturedOffers(menusData.featuredOffers);
        setLoadingError(false);

        setHasLoaded(true);
      } catch (e) {
        setLoadingError(true);
        return;
      }
    };

    if (searchV5Experiment.data?.variantName === 'treatment') {
      const shouldFetchLegacyBanners = brazeContentCardsEnabled.data?.variantName === 'control';
      experimentFetchHomepageData(shouldFetchLegacyBanners);
    } else {
      currentFetchHomepageData();
    }
  }, [
    userCtx.dislikes,
    userCtx.error,
    userCtx.isAgeGated,
    userCtx.user,
    authCtx.isReady,
    searchV5Experiment.data?.variantName,
    searchV5Experiment.status,
    offersCmsExperiment.status,
    brazeContentCardsEnabled.status,
    authCtx.authState.idToken,
    useLegacyIds,
    platformAdapter,
    brazeContentCardsEnabled.data?.variantName,
  ]);

  return {
    banners,
    dealsOfTheWeek,
    marketplaceMenus,
    flexibleMenu,
    featuredOffers,
    hasLoaded,
    loadingError,
  };
};

const getBanners = async (isAgeGated: boolean, dislikes: number[]): Promise<BannerType[]> => {
  const banners = await makeHomePageQueryWithDislikeRestrictions(
    bannerQuery(OFFERS_BRAND, isAgeGated),
    dislikes
  );

  return banners.data.banners as BannerType[];
};

const getMenus = async (
  user: User | undefined,
  platformAdapter: WebPlatformAdapter,
  useLegacyIds: boolean
) => {
  const params = {
    dob: user?.profile.dob ?? '',
    organisation: user?.profile.organisation ?? '',
  };

  const menusResponse = await platformAdapter.invokeV5Api(V5_API_URL.Menus, {
    method: 'GET',
    queryParameters: params,
  });

  return mapMenusResponse(JSON.parse(menusResponse.data).data, useLegacyIds);
};

const mapMenusResponse = (
  menusResponse: any,
  useLegacyIds: boolean
): {
  dealsOfTheWeek: DealsOfTheWeekType[];
  marketplaceMenus: MarketPlaceMenuType[];
  flexibleMenu: FlexibleMenuType[];
  featuredOffers: FeaturedOffersType[];
} => {
  return {
    dealsOfTheWeek: mapDealsOfTheWeek(menusResponse.dealsOfTheWeek, useLegacyIds),
    marketplaceMenus: menusResponse.marketplace.map((menu: any) =>
      mapMarketplaceMenu(menu, useLegacyIds)
    ),
    featuredOffers: mapFeaturedOffers(menusResponse.featured, useLegacyIds),
    flexibleMenu: menusResponse.flexible.map((menu: any) => mapFlexibleMenu(menu)),
  };
};

const mapDealsOfTheWeek = (menu: any, useLegacyIds: boolean): DealsOfTheWeekType[] => {
  return menu.offers.map((offer: any) => {
    return {
      id: useLegacyIds && offer.legacyOfferID ? offer.legacyOfferID : offer.offerID,
      compid: useLegacyIds && offer.legacyCompanyID ? offer.legacyCompanyID : offer.companyID,
      companyname: offer.companyName,
      offername: offer.offerName,
      image: offer.imageURL,
      logos: offer.imageURL,
      href: '',
    };
  });
};

const mapMarketplaceMenu = (menu: any, useLegacyIds: boolean): MarketPlaceMenuType => {
  return {
    name: menu.title,
    hidden: menu.hidden,
    items: menu.offers.map((offer: any) => mapMarketplaceOffer(offer, useLegacyIds)),
  };
};

const mapMarketplaceOffer = (offer: any, useLegacyIds: boolean): MarketPlaceItemType => {
  return {
    item: {
      offerId: useLegacyIds && offer.legacyOfferID ? offer.legacyOfferID : offer.offerID,
      compid: useLegacyIds && offer.legacyCompanyID ? offer.legacyCompanyID : offer.companyID,
      offername: offer.offerName,
      companyname: offer.companyName,
      image: offer.imageURL,
      logos: offer.imageURL,
    },
  };
};

const mapFeaturedOffers = (menu: any, useLegacyIds: boolean): FeaturedOffersType[] => {
  return menu.offers.map((offer: any) => {
    return {
      id: useLegacyIds && offer.legacyOfferID ? offer.legacyOfferID : offer.offerID,
      compid: useLegacyIds && offer.legacyCompanyID ? offer.legacyCompanyID : offer.companyID,
      companyname: offer.companyName,
      offername: offer.offerName,
      image: offer.imageURL,
      logos: offer.imageURL,
    };
  });
};

const mapFlexibleMenu = (menu: any): FlexibleMenuType => {
  return {
    title: menu.title,
    imagehome: menu.imageURL,
    hide: false,
  };
};

export default useFetchHomepageData;
