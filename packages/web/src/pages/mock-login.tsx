import Button from '@bluelightcard/shared-ui/components/Button-V2';
import Heading from '@/components/Heading/Heading';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { secretHash } from '@/utils/secret_hash';
import InputTextFieldWithRef from '@/components/InputTextField/InputTextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { useRouter } from 'next/router';
import AuthContext from '@/context/Auth/AuthContext';
import {
  COGNITO_CLIENT_ID,
  COGNITO_CLIENT_REGION,
  COGNITO_CLIENT_SECRET,
  AUTH0_LOGIN_URL,
  BRAND,
} from '@/global-vars';
import { unpackJWT } from '@core/utils/unpackJWT';
import withAuthProviderLayout from '../common/hoc/withAuthProviderLayout';
import { Auth0Service } from '@/root/src/common/services/auth0Service';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { getAuth0FeatureFlagBasedOnBrand } from '@/utils/amplitude/getAuth0FeatureFlagBasedOnBrand';
import getDeviceFingerprint from '@/utils/amplitude/getDeviceFingerprint';

function MockLogin() {
  // As this exposes client_secret which should not be exposed.
  // This is only a mock of the login, used to get a token for testing GraphQL queries it is NOT INTENDED FOR PRODUCTION.

  function getUsername(token: string) {
    const { sub: username } = unpackJWT(token);
    return username;
  }

  async function getToken(username: string, password: string) {
    const secret = secretHash(username, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET);

    const axios = require('axios');
    const data = {
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secret,
      },
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://cognito-idp.${COGNITO_CLIENT_REGION}.amazonaws.com`,
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      },
      data: data,
    };

    setIsLoading(true);
    setErrorMessage(undefined);
    axios
      .request(config)
      .then((response: { data: any }) => {
        authContext?.updateAuthTokens({
          accessToken: response.data.AuthenticationResult.AccessToken,
          idToken: response.data.AuthenticationResult.IdToken,
          refreshToken: response.data.AuthenticationResult.RefreshToken,
          username: getUsername(response.data.AuthenticationResult.AccessToken),
        });

        const redirect = router.query.redirect as string;

        if (!localStorage.getItem('deviceFingerprint')) {
          const { deviceFingerprint } = getCookies();

          if (deviceFingerprint) {
            localStorage.setItem('deviceFingerprint', deviceFingerprint);
          }
        }
        router.push(redirect ? redirect : '/members-home');
        setIsLoading(false);
      })
      .catch((error: any) => {
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
      });
  }

  const authContext = useContext(AuthContext);

  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authenticating = useRef(false);

  useEffect(() => {
    async function performTokenCodeExchangeIfRequired() {
      if (router.query['code']) {
        authenticating.current = true;
        const code = router.query['code'];
        if (code && typeof code === 'string') {
          const success = await Auth0Service.getTokensUsingCode(code, authContext.updateAuthTokens);
          if (success) {
            await router.push('/members-home');
          }
        }
        authenticating.current = false;
      }
    }
    if (!authenticating.current) {
      performTokenCodeExchangeIfRequired();
    }
  }, [authContext, router]);

  const auth0Experiment = useAmplitudeExperiment(
    getAuth0FeatureFlagBasedOnBrand(BRAND),
    'off',
    getDeviceFingerprint()
  );

  const isAuth0LoginLogoutWebEnabled = auth0Experiment.data?.variantName === 'on';

  return (
    <div className="flex justify-center">
      <div className="px-auto py-16 min-w-[600px] flex flex-col gap-4">
        {isAuth0LoginLogoutWebEnabled && (
          <>
            <Button
              onClick={() => {
                router.push(AUTH0_LOGIN_URL);
              }}
            >
              Login with Auth0
            </Button>
            <hr />
          </>
        )}

        <Heading headingLevel={'h1'}>Login with Cognito</Heading>

        <hr />

        <Heading headingLevel={'h3'}>Username</Heading>
        <InputTextFieldWithRef
          placeholder="Username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <Heading headingLevel={'h3'}>Password</Heading>
        <InputTextFieldWithRef
          placeholder="Password"
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <Button
          onClick={() => {
            getToken(username, password);
          }}
          disabled={isLoading}
        >
          {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : 'Login'}
        </Button>
        {errorMessage && (
          <div className="border border-red-600 bg-red-300 rounded text-red-950 w-full p-3">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuthProviderLayout(MockLogin, {
  requireAuth: false,
  seo: { title: 'Dev Env login' },
});

const getCookies = (): Record<string, string> => {
  return document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=').map((c) => c.trim());
    acc[key] = value || '';
    return acc;
  }, {} as Record<string, string>);
};
