import { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { useContext, useEffect, useRef } from 'react';
import AuthContext, { AuthState } from '@/context/Auth/AuthContext';
import { BRAND, LOGOUT_ROUTE } from '@/global-vars';
import LoadingPlaceholder from '@/offers/components/LoadingSpinner/LoadingSpinner';
import { unpackJWT } from '@core/utils/unpackJWT';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';
import AuthTokensService from '../services/authTokensService';
import { AmplitudeExperimentFlags } from '../utils/amplitude/AmplitudeExperimentFlags';
import AmplitudeDeviceExperimentClient from '../utils/amplitude/AmplitudeDeviceExperimentClient';
import { nowInSecondsSinceEpoch } from '@/utils/dates';
import { getAuth0FeatureFlagBasedOnBrand } from '@/utils/amplitude/getAuth0FeatureFlagBasedOnBrand';
import { getLogoutUrl } from '@/root/src/common/auth/authUrls';
import { Auth0Service } from '@/root/src/common/services/auth0Service';

export async function redirectToLogin(router: NextRouter) {
  const deviceExperimentClient = await AmplitudeDeviceExperimentClient.Instance();
  const cognitoUIExperimentVariant = deviceExperimentClient.variant(
    AmplitudeExperimentFlags.IDENTITY_COGNITO_UI_ENABLED,
    'control'
  );
  const auth0ExperimentVariant = deviceExperimentClient.variant(
    getAuth0FeatureFlagBasedOnBrand(BRAND),
    'off'
  );

  const isCognitoUIEnabled = cognitoUIExperimentVariant.value === 'treatment';
  const isAuth0LoginLogoutWebEnabled = auth0ExperimentVariant.value === 'on';

  const legacyLogoutUrl = `${LOGOUT_ROUTE}?redirect=${router.asPath}`;
  const logoutUrl = getLogoutUrl(
    { isAuth0LoginLogoutWebEnabled, isCognitoUIEnabled },
    legacyLogoutUrl
  );

  if (process.env.NODE_ENV === 'production') {
    window.location.replace(logoutUrl);
  } else {
    router.push(logoutUrl);
  }
}

async function isAuthenticated(
  idToken: string,
  refreshToken: string,
  updateAuthTokens: (tokens: AuthState) => void
) {
  const {
    exp: tokenExpiryInSecondsSinceEpoch,
    sub: usernameFromToken,
    iss: issuer,
  } = unpackJWT(idToken);
  if (nowInSecondsSinceEpoch() >= tokenExpiryInSecondsSinceEpoch) {
    //refresh token and update storage and return true or false based on if it works
    return Auth0Service.isAuth0Issuer(issuer)
      ? await Auth0Service.updateTokensUsingRefreshToken(refreshToken, updateAuthTokens)
      : await reAuthFromRefreshToken(usernameFromToken, refreshToken, updateAuthTokens);
  }
  return true;
}

const requireAuth = function (AuthComponent: NextPage<any> | React.FC<any>) {
  const Component: React.FC<any> = (props: any) => {
    const authContext = useContext(AuthContext);
    const router = useRouter();
    const authenticating = useRef(false);

    useEffect(() => {
      async function performTokenRefreshIfRequired() {
        if (AuthTokensService.authTokensPresent()) {
          authenticating.current = true;
          const refreshToken = AuthTokensService.getRefreshToken();
          const username = AuthTokensService.getUsername();
          const idToken = AuthTokensService.getIdToken();

          const isAuthed = await isAuthenticated(
            idToken,
            refreshToken,
            authContext.updateAuthTokens
          );

          // need to get the idToken again as it may have been refreshed
          authContext.authState.idToken = AuthTokensService.getIdToken();
          authContext.authState.accessToken = AuthTokensService.getAccessToken();
          authContext.authState.refreshToken = AuthTokensService.getRefreshToken();
          authContext.authState.username = username;
          authContext.isReady = isAuthed;
          authContext.isUserAuthenticated = () => isAuthed;
          authenticating.current = false;
        }

        if (authContext.isReady && !authContext.isUserAuthenticated()) {
          await redirectToLogin(router);
        }
      }
      if (!authenticating.current) {
        performTokenRefreshIfRequired();
      }
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
