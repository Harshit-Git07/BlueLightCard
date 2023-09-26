import { useState } from 'react';
import { NextRouter } from 'next/router';

const useJwt = (input_router: NextRouter) => {
  const router: NextRouter = input_router;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // Redirect user to the desired page
  const redirectToPage = (path: string) => {
    router.push(path);
  };

  const _extractTokens = (key: string, fail_path: string) => {
    if (sessionStorage.getItem('cognito')) {
      // Get token that matches key from session storage, from the cognito object
      const cognito = JSON.parse(sessionStorage.getItem('cognito') || '{}');
      const token = cognito[key];
      // Check expiry of token, unit of time is seconds
      if (token && token.exp && token.exp < Date.now() / 1000) {
        switch (key) {
          case 'accessToken':
            setAccessToken(token);
            break;
          case 'idToken':
            setIdToken(token);
            break;
          default:
            // If no token found, redirect to desired path
            redirectToPage(fail_path);
            break;
        }
      } else {
        // If no token found, redirect to desired path
        redirectToPage(fail_path);
      }
    }
  };

  const getAccessToken = (fail_path: string) => {
    if (!accessToken) {
      _extractTokens('accessToken', fail_path);
    }
    return accessToken;
  };

  const getIdToken = (fail_path: string) => {
    if (!idToken) {
      _extractTokens('idToken', fail_path);
    }
    return idToken;
  };

  const clearTokens = () => {
    // Remove tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    setAccessToken(null);
    setIdToken(null);
  };

  return { getAccessToken, getIdToken, clearTokens };
};

export default useJwt;
