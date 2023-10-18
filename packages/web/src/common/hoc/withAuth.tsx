import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import AuthContext from '@/context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { LOGOUT_ROUTE } from '@/global-vars';

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
          <div className="w-full h-[100vh] flex justify-center">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin m-auto text-[5em] text-palette-primary dark:text-palette-secondary"
            />
          </div>
        )}
      </>
    );
  };
  return Component;
};

export default withAuth;
