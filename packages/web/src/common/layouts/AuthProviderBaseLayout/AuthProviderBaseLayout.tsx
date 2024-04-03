import React from 'react';
import { LayoutProps } from './types';
import AuthProvider from '@/context/Auth/AuthProvider';
import UserProvider from '@/context/User/UserProvider';
import BaseLayout from '../BaseLayout/BaseLayout';
import OfferSheetProvider from '@/context/OfferSheet/OfferSheetProvider';
import { AuthedAmplitudeExperimentProvider } from '@/context/AmplitudeExperiment';
import requireAuth from '../../hoc/requireAuth';

const BaseLayoutWrapper: React.FC<LayoutProps> = (props) => (
  <UserProvider>
    <AuthedAmplitudeExperimentProvider>
      <OfferSheetProvider>
        <BaseLayout {...props}>{props.children}</BaseLayout>
      </OfferSheetProvider>
    </AuthedAmplitudeExperimentProvider>
  </UserProvider>
);

const BaseLayoutWrapperWithAuth = requireAuth(BaseLayoutWrapper);

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
