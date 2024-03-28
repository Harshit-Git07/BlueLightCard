import React, { useEffect, useState } from 'react';
import { unpackJWT } from '@core/utils/unpackJWT';
import AuthContext from './AuthContext';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';

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
    username: '',
  });

  const setUserAuthInfo = ({
    accessToken,
    idToken,
    refreshToken,
    username,
  }: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    username: string;
  }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);

    setAuthState({
      accessToken,
      idToken,
      refreshToken,
      username,
    });
  };

  useEffect(() => {
    setAuthState({
      accessToken: localStorage.getItem('accessToken') || '',
      idToken: localStorage.getItem('idToken') || '',
      refreshToken: localStorage.getItem('refreshToken') || '',
      username: localStorage.getItem('username') || '',
    });

    setIsReady(true);
  }, []);

  // Checks if the user is authenticated or not.
  // No need to refresh here as this is the default state.
  // Context will be injected and overridden by requireAuth.ts
  const isUserAuthenticated = () => {
    if (
      !authState.accessToken &&
      !authState.idToken &&
      !authState.username &&
      !authState.refreshToken
    ) {
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
