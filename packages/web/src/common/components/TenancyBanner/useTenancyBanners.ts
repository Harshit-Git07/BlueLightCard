import AuthContext from '@/context/Auth/AuthContext';
import UserContext from '@/context/User/UserContext';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { BRAND, OFFERS_BRAND } from '@/root/global-vars';
import { BrazeContentCard, useBrazeContentCards } from '@/hooks/useBrazeContentCards';
import { CombinedBannersType } from './types';
import { advertQuery } from '@/root/src/graphql/advertQuery';
import { homePageQuery } from '@/root/src/graphql/homePageQueries';
import { makeHomePageQueryWithDislikeRestrictions, makeQuery } from '@/root/src/graphql/makeQuery';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useTenancyBanners = () => {
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const [banners, setBanners] = useState<CombinedBannersType>({ small: [], large: [] });
  const [loaded, setLoaded] = useState(false);

  const brazeContentCardsEnabled = useAmplitudeExperiment(
    AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED,
    'control'
  );
  const contentCards = useBrazeContentCards();

  useEffect(() => {
    setLoaded(false);
  }, []);

  // GraphQL banners
  useEffect(() => {
    if (
      !authCtx.authState.idToken ||
      !userCtx.user ||
      !router.isReady ||
      brazeContentCardsEnabled.status === 'pending' ||
      brazeContentCardsEnabled.data?.variantName === 'treatment'
    )
      return;

    const fetchBannersData = async () => {
      const user = userCtx.user;

      // Fetch both small and large banner data
      const smallBannerData = await makeQuery(advertQuery(BRAND, userCtx.isAgeGated ?? true));
      const largeBannerData = await makeHomePageQueryWithDislikeRestrictions(
        homePageQuery(
          OFFERS_BRAND,
          userCtx.isAgeGated ?? true,
          user?.profile.organisation ?? 'NHS'
        ),
        userCtx.dislikes
      );

      const combinedBanners = {
        small: smallBannerData.data.banners,
        large: largeBannerData.data.banners,
      };

      setBanners(combinedBanners as CombinedBannersType);
      setLoaded(true);
    };

    fetchBannersData();
  }, [authCtx.authState.idToken, userCtx, router.isReady, brazeContentCardsEnabled, setBanners]);

  // Braze banners
  useEffect(() => {
    if (
      !contentCards.length ||
      brazeContentCardsEnabled.status === 'pending' ||
      brazeContentCardsEnabled.data?.variantName === 'control'
    )
      return;

    const mapContentCards = (card: BrazeContentCard) => ({
      imageSource: card.imageUrl,
      link: card.url,
      title: card.title,
      logClick: card.logClick,
    });

    const combinedBanners = {
      small: contentCards
        .filter((card) => !card.isControl && card.extras?.destination === 'bottom-banner')
        .map(mapContentCards),
      large: contentCards
        .filter((card) => !card.isControl && card.extras?.destination === 'takeover-banner')
        .map(mapContentCards),
    };

    setBanners(combinedBanners as CombinedBannersType);
    setLoaded(true);
  }, [brazeContentCardsEnabled, contentCards, setBanners]);

  return { loaded, banners };
};

export default useTenancyBanners;
