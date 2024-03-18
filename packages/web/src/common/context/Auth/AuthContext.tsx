import React from 'react';

export type AuthState = {
  username: string;
  refreshToken: string;
  accessToken: string;
  idToken: string;
};

export type AuthContextType = {
  authState: AuthState;
  updateAuthTokens: any;
  isUserAuthenticated: () => boolean;
  isReady: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  authState: {
    accessToken: '',
    idToken: '',
    refreshToken: '',
    username: '',
  },
  updateAuthTokens: () => {},
  isUserAuthenticated: () => {
    return false;
  },
  isReady: false,
});

export default AuthContext;
