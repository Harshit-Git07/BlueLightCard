import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import AuthContext from '@/context/Auth/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { LOGOUT_ROUTE } from '@/global-vars';
import LoadingPlaceholder from '@/offers/components/LoadingSpinner/LoadingSpinner';

export function redirectToLogin(router: any) {
  if (process.env.NODE_ENV == 'production') {
    window.location.replace(LOGOUT_ROUTE);
  } else {
    router.push(LOGOUT_ROUTE);
  }
}

const withAuth = function (AuthComponent: NextPage<any> | React.FC<any>) {
  const Component: React.FC<any> = (props: any) => {
    const authContext = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (authContext.isReady && !authContext.isUserAuthenticated()) {
        redirectToLogin(router);
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

export default withAuth;
