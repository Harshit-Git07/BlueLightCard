import { FC, useContext, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { CombinedBannersType, TenancyBannerProps } from '../types';
import { makeHomePageQueryWithDislikeRestrictions, makeQuery } from '@/root/src/graphql/makeQuery';
import { advertQuery } from '@/root/src/graphql/advertQuery';
import { BRAND, OFFERS_BRAND } from '@/root/global-vars';
import UserContext from '@/context/User/UserContext';
import AuthContext from '@/context/Auth/AuthContext';
import { useRouter } from 'next/router';
import TenancyBannerPresenter from './TenancyBannerPresenter';
import { homePageQuery } from '@/root/src/graphql/homePageQueries';

const bannersAtom = atom<CombinedBannersType>({ small: [], large: [] });

const TenancyBannerContainer: FC<TenancyBannerProps> = (props) => {
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const [banners, setBanners] = useAtom(bannersAtom);

  useEffect(() => {
    const fetchBannersData = async () => {
      const user = userCtx.user;

      try {
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
      } catch (error) {
        setBanners({ small: [], large: [] });
      }
    };

    if (authCtx.authState.idToken && Boolean(userCtx.user) && router.isReady) {
      fetchBannersData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx.authState.idToken, userCtx.isAgeGated, userCtx.user, router.isReady]);

  return <TenancyBannerPresenter bannersData={banners} {...props} />;
};

export default TenancyBannerContainer;
