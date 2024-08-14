import { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import AuthContext from '@/context/Auth/AuthContext';
import { COGNITO_LOGOUT_URL, LOGOUT_ROUTE } from '@/global-vars';
import LoadingPlaceholder from '@/offers/components/LoadingSpinner/LoadingSpinner';
import { unpackJWT } from '@core/utils/unpackJWT';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';
import AuthTokensService from '../services/authTokensService';
import { AmplitudeExperimentFlags } from '../utils/amplitude/AmplitudeExperimentFlags';
import AmplitudeDeviceExperimentClient from '../utils/amplitude/AmplitudeDeviceExperimentClient';
import { nowInSecondsSinceEpoch } from '@/utils/dates';

export async function redirectToLogin(router: NextRouter) {
  const deviceExperimentClient = await AmplitudeDeviceExperimentClient.Instance();
  const cognitoUIExperimentVariant = deviceExperimentClient.variant(
    AmplitudeExperimentFlags.IDENTITY_COGNITO_UI_ENABLED,
    'control'
  );

  const isCognitoUIEnabled = cognitoUIExperimentVariant.value === 'treatment';

  const legacyLogoutUrl = `${LOGOUT_ROUTE}?redirect=${router.asPath}`;
  const logoutUrl = isCognitoUIEnabled ? COGNITO_LOGOUT_URL : legacyLogoutUrl;

  if (process.env.NODE_ENV === 'production') {
    window.location.replace(logoutUrl);
  } else {
    router.push(logoutUrl);
  }
}

async function isAuthenticated(idToken: string, refreshToken: string) {
  const { exp: tokenExpiryInSecondsSinceEpoch, sub: usernameFromToken } = unpackJWT(idToken);

  if (nowInSecondsSinceEpoch() >= tokenExpiryInSecondsSinceEpoch) {
    //refresh token and update storage and return true or false based on if it works
    return await reAuthFromRefreshToken(usernameFromToken, refreshToken);
  }

  return true;
}

const requireAuth = function (AuthComponent: NextPage<any> | React.FC<any>) {
  const Component: React.FC<any> = (props: any) => {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      async function performTokenRefreshIfRequired() {
        if (AuthTokensService.authTokensPresent()) {
          const refreshToken = AuthTokensService.getRefreshToken();
          const username = AuthTokensService.getUsername();
          const idToken = AuthTokensService.getIdToken();

          const isAuthed = await isAuthenticated(idToken, refreshToken);

          // need to get the idToken again as it may have been refreshed
          authContext.authState.idToken = AuthTokensService.getIdToken();
          authContext.authState.accessToken = AuthTokensService.getAccessToken();
          authContext.authState.refreshToken = refreshToken;
          authContext.authState.username = username;
          authContext.isReady = isAuthed;
          authContext.isUserAuthenticated = () => isAuthed;
        }

        if (authContext.isReady && !authContext.isUserAuthenticated()) {
          await redirectToLogin(router);
        }
      }
      performTokenRefreshIfRequired();
    }, [authContext, router]);

    return (
      <>
        {authContext.isUserAuthenticated() ? (
          <AuthComponent {...props} />
        ) : (
          <LoadingPlaceholder
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
