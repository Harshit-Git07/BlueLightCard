import React, { useEffect, useState } from 'react';
import { unpackJWT } from '@core/utils/unpackJWT';
import AuthContext from './AuthContext';

type AuthProviderProps = {
  children: React.ReactNode;
  isReady?: boolean;
  isUserAuthenticated?: () => boolean;
};

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  isReady: isReadyOverride,
  isUserAuthenticated: isUserAuthenticatedOverride,
}) => {
  const [isReady, setIsReady] = useState<boolean>(isReadyOverride || false);
  const [authState, setAuthState] = useState({
    accessToken: '',
    idToken: '',
    refreshToken: '',
  });

  const setUserAuthInfo = ({
    accessToken,
    idToken,
    refreshToken,
  }: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);

    setAuthState({
      accessToken,
      idToken,
      refreshToken,
    });
  };

  useEffect(() => {
    setAuthState({
      accessToken: localStorage.getItem('accessToken') || '',
      idToken: localStorage.getItem('idToken') || '',
      refreshToken: localStorage.getItem('refreshToken') || '',
    });

    setIsReady(true);
  }, []);

  // checks if the user is authenticated or not
  const isUserAuthenticated = () => {
    if (!authState.accessToken && !authState.idToken) {
      return false;
    }

    const { exp: tokenExpiryTimeStamp } = unpackJWT(authState.idToken);

    const currentTimeStamp = Math.ceil(Date.now() / 1000);

    if (currentTimeStamp >= tokenExpiryTimeStamp) {
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        updateAuthTokens: setUserAuthInfo,
        isUserAuthenticated: isUserAuthenticatedOverride || isUserAuthenticated,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
