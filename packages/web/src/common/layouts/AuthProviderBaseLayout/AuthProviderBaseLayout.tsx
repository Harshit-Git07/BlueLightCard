import React from 'react';
import { LayoutProps } from './types';
import AuthProvider from '@/context/Auth/AuthProvider';
import UserProvider from '@/context/User/UserProvider';
import BaseLayout from '../BaseLayout/BaseLayout';
import {
  LoggedOutAmplitudeExperimentProvider,
  AuthedAmplitudeExperimentProvider,
} from '@/context/AmplitudeExperiment';
import requireAuth from '../../hoc/requireAuth';

const BaseLayoutWrapperAuth: React.FC<LayoutProps> = (props) => (
  <UserProvider>
    <AuthedAmplitudeExperimentProvider>
      <BaseLayout {...props}>{props.children}</BaseLayout>
    </AuthedAmplitudeExperimentProvider>
  </UserProvider>
);

const BaseLayoutWrapper: React.FC<LayoutProps> = (props) => (
  <UserProvider>
    <LoggedOutAmplitudeExperimentProvider>
      <BaseLayout {...props}>{props.children}</BaseLayout>
    </LoggedOutAmplitudeExperimentProvider>
  </UserProvider>
);

const BaseLayoutWrapperWithAuth = requireAuth(BaseLayoutWrapperAuth);

const AuthProviderBaseLayout: React.FC<LayoutProps> = ({ requireAuth, ...props }) => {
  return (
    <AuthProvider>
      {requireAuth === false ? (
        <BaseLayoutWrapper {...props} />
      ) : (
        <BaseLayoutWrapperWithAuth {...props} />
      )}
    </AuthProvider>
  );
};

export default AuthProviderBaseLayout;
