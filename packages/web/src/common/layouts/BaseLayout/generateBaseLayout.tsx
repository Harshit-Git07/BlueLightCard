import AuthProvider from '@/context/Auth/AuthProvider';
import UserProvider from '@/context/User/UserProvider';
import BaseLayout from '@/layouts/BaseLayout/BaseLayout';
import { ReactElement } from 'react';

function generateBaseLayout(props: any) {
  const PageComponent = (page: ReactElement) => {
    // TODO: Providers to be moved at a later date
    return (
      <AuthProvider>
        <UserProvider>
          <BaseLayout {...props}>{page}</BaseLayout>
        </UserProvider>
      </AuthProvider>
    );
  };

  return PageComponent;
}

export default generateBaseLayout;
