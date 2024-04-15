import { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '@/context/Auth/AuthContext';
import { LOGOUT_ROUTE, COGNITO_LOGOUT_URL } from '@/global-vars';
import LoadingPlaceholder from '@/offers/components/LoadingSpinner/LoadingSpinner';
import { unpackJWT } from '@core/utils/unpackJWT';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';
import AuthTokensService from '../services/authTokensService';
import { AmplitudeExperimentFlags } from '../utils/amplitude/AmplitudeExperimentFlags';
import AmplitudeDeviceExperimentClient from '../utils/amplitude/AmplitudeDeviceExperimentClient';

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
  const { exp: tokenExpiryTimeStamp, sub: usernameFromToken } = unpackJWT(idToken);

  const currentTimeStamp = Math.ceil(Date.now() / 1000);

  if (currentTimeStamp >= tokenExpiryTimeStamp) {
    //refresh token and update storage and return true or false based on if it works
    const authenticated = await reAuthFromRefreshToken(usernameFromToken, refreshToken);
    return authenticated;
  }

  return true;
}

const requireAuth = function (AuthComponent: NextPage<any> | React.FC<any>) {
  const Component: React.FC<any> = (props: any) => {
    const [, setIdToken] = useState<string>('');
    const authContext = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      async function performTokenRefreshIfRequired() {
        if (AuthTokensService.authTokensPresent()) {
          const refreshToken = AuthTokensService.getRefreshToken();
          const username = AuthTokensService.getUsername();

          const isAuthed = await isAuthenticated(AuthTokensService.getIdToken(), refreshToken);

          authContext.authState.idToken = AuthTokensService.getIdToken();
          authContext.authState.accessToken = AuthTokensService.getAccessToken();
          authContext.authState.refreshToken = refreshToken;
          authContext.authState.username = username;
          authContext.isReady = isAuthed;
          authContext.isUserAuthenticated = () => isAuthed;
          setIdToken(AuthTokensService.getIdToken());
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
