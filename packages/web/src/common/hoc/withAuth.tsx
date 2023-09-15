import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import AuthContext from '@/context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { LOGIN_ROUTE } from '@/global-vars';

function redirectToLogin(router: any) {
  // TODO: Find a better way to manage production redirect
  // This method will be replaced with next router when login is implemented in the next app
  if (process.env.NODE_ENV == 'production') {
    window.location.replace(LOGIN_ROUTE);
  } else {
    router.push(LOGIN_ROUTE);
  }
}

const withAuth = (AuthComponent: NextPage<any>) => {
  const PageComponent: NextPage<any> = (props: any) => {
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
          // TODO: strip this out into its own component
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

  return PageComponent;
};

export default withAuth;
