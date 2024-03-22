import { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import AuthContext from '@/context/Auth/AuthContext';
import { LOGOUT_ROUTE, COGNITO_LOGOUT_URL } from '@/global-vars';
import { unpackJWT } from '@core/utils/unpackJWT';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';
import { FlagsmithFeatureFlags } from '@/utils/flagsmith/flagsmithFlags';
import getFlag from '@/utils/flagsmith/getFlag';
import LoadingSpinner from '@/offers/components/LoadingSpinner/LoadingSpinner';

export function redirectToLogin(router: NextRouter) {
  const isCognitoUIEnabled = getFlag(FlagsmithFeatureFlags.IDENTITY_COGNITO_UI_ENABLED);

  const legacyLogoutUrl = `${LOGOUT_ROUTE}?redirect=${router.asPath}`;
  const logoutUrl = isCognitoUIEnabled ? COGNITO_LOGOUT_URL : legacyLogoutUrl;

  if (process.env.NODE_ENV == 'production') {
    window.location.replace(logoutUrl);
  } else {
    router.push(logoutUrl);
  }
}

function isAuthed(idToken: string, refreshToken: string) {
  const { exp: tokenExpiryTimeStamp, sub: usernameFromToken } = unpackJWT(idToken);

  const currentTimeStamp = Math.ceil(Date.now() / 1000);

  if (currentTimeStamp >= tokenExpiryTimeStamp) {
    //refresh token and update storage and return true or false based on if it works
    return reAuthFromRefreshToken(usernameFromToken, refreshToken);
  }
  return true;
}

const requireAuth = function (AuthComponent: NextPage<any> | React.FC<any>) {
  const Component: React.FC<any> = (props: any) => {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      const idToken: string = localStorage.getItem('idToken') as string;
      const accessToken: string = localStorage.getItem('accessToken') as string;
      const refreshToken: string = localStorage.getItem('refreshToken') as string;
      const username: string = localStorage.getItem('username') as string;

      if (idToken && username && accessToken && refreshToken) {
        authContext.authState.idToken = idToken;
        authContext.authState.accessToken = accessToken;
        authContext.authState.refreshToken = refreshToken;
        authContext.authState.username = username;
        const isAuthenticated = isAuthed(idToken, refreshToken);
        authContext.isReady = isAuthenticated;
        authContext.isUserAuthenticated = () => isAuthenticated;
      }
      if (authContext.isReady && !authContext.isUserAuthenticated()) {
        redirectToLogin(router);
      }
    }, [authContext, router]);

    return (
      <>
        {authContext.isUserAuthenticated() ? (
          <AuthComponent {...props} />
        ) : (
          <LoadingSpinner
            containerClassName="w-full h-[100vh]"
            spinnerClassName="text-[5em] text-palette-primary dark:text-palette-secondary"
          />
        )}
      </>
    );
  };
  return Component;
};

export default requireAuth;
