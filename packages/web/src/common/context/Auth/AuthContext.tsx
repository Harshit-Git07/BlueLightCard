import React from 'react';

export type AuthState = {
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
  },
  updateAuthTokens: () => {},
  isUserAuthenticated: () => {
    return false;
  },
  isReady: false,
});

export default AuthContext;
