import AuthProvider from '@/context/Auth/AuthProvider';
import UserProvider from '@/context/User/UserProvider';
import BaseLayout from '@/layouts/BaseLayout/BaseLayout';
import { ReactElement } from 'react';
import AuthProviderBaseLayout from '../AuthProviderBaseLayout/AuthProviderBaseLayout';

function generateBaseLayout(props: any, requiresAuthProviders: boolean = false) {
  const PageComponent = (page: ReactElement) => {
    if (requiresAuthProviders) {
      return <AuthProviderBaseLayout {...props}>{page}</AuthProviderBaseLayout>;
    } else {
      return <BaseLayout {...props}>{page}</BaseLayout>;
    }
  };

  return PageComponent;
}

export default generateBaseLayout;
