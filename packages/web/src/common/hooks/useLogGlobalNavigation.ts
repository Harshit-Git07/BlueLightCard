import AmplitudeContext from '@/context/AmplitudeContext';
import UserContext from '@/context/User/UserContext';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';
import {
  logGlobalNavigationBrowseCategoriesClicked,
  logGlobalNavigationMyAccountClicked,
  logGlobalNavigationMyCardClicked,
  logGlobalNavigationNotificationsClicked,
  logGlobalNavigationOffersClicked,
} from '@/utils/amplitude/logGlobalNavigation';
export function useLogGlobalNavigationOffersClicked() {
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const amplitude = useContext(AmplitudeContext);

  const logOffersClicked = useCallback(
    async (navigationTarget: string) => {
      await logGlobalNavigationOffersClicked({
        amplitude,
        userUuid: userCtx.user?.uuid,
        origin: getOrigin(router.route),
        offerPage: navigationTarget,
      });
    },
    [amplitude, router.route, userCtx.user?.uuid]
  );

  const logBrowseCategoriesClicked = useCallback(
    async (navigationTarget: string) => {
      await logGlobalNavigationBrowseCategoriesClicked({
        amplitude,
        userUuid: userCtx.user?.uuid,
        origin: getOrigin(router.route),
        categoryPage: navigationTarget,
      });
    },
    [amplitude, router.route, userCtx.user?.uuid]
  );

  const logMyCardClicked = useCallback(async () => {
    await logGlobalNavigationMyCardClicked({
      amplitude,
      userUuid: userCtx.user?.uuid,
      origin: getOrigin(router.route),
    });
  }, [amplitude, router.route, userCtx.user?.uuid]);

  const logMyAccountClicked = useCallback(async () => {
    await logGlobalNavigationMyAccountClicked({
      amplitude,
      userUuid: userCtx.user?.uuid,
      origin: getOrigin(router.route),
    });
  }, [amplitude, router.route, userCtx.user?.uuid]);

  const logNotificationsClicked = useCallback(async () => {
    await logGlobalNavigationNotificationsClicked({
      amplitude,
      userUuid: userCtx.user?.uuid,
      origin: getOrigin(router.route),
    });
  }, [amplitude, router.route, userCtx.user?.uuid]);

  return {
    logOffersClicked,
    logBrowseCategoriesClicked,
    logMyCardClicked,
    logMyAccountClicked,
    logNotificationsClicked,
  };
}

const getOrigin = (route: string) => route.substring(1);
