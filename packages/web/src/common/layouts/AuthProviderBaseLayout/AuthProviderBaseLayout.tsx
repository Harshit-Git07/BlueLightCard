import React from 'react';
import { LayoutProps } from './types';
import AuthProvider from '@/context/Auth/AuthProvider';
import UserProvider from '@/context/User/UserProvider';
import BaseLayout from '../BaseLayout/BaseLayout';

const AuthProviderBaseLayout: React.FC<LayoutProps> = (props) => {
  return (
    <AuthProvider>
      <UserProvider>
        <BaseLayout {...props}>{props.children}</BaseLayout>
      </UserProvider>
    </AuthProvider>
  );
};

export default AuthProviderBaseLayout;
