import React from 'react';
import { LayoutProps } from './types';
import AuthProvider from '@/context/Auth/AuthProvider';
import UserProvider from '@/context/User/UserProvider';
import BaseLayout from '../BaseLayout/BaseLayout';
import OfferSheetProvider from '@/context/OfferSheet/OfferSheetProvider';
import { AuthedAmplitudeExperimentProvider } from '@/context/AmplitudeExperiment';

const AuthProviderBaseLayout: React.FC<LayoutProps> = (props) => {
  return (
    <AuthProvider>
      <UserProvider>
        <AuthedAmplitudeExperimentProvider>
          <OfferSheetProvider>
            <BaseLayout {...props}>{props.children}</BaseLayout>
          </OfferSheetProvider>
        </AuthedAmplitudeExperimentProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default AuthProviderBaseLayout;
