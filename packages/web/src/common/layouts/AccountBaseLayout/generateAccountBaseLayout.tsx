import React, { ReactElement } from 'react';
import { AuthedAmplitudeExperimentProvider } from '../../context/AmplitudeExperiment';
import { ViewOfferProvider } from '@bluelightcard/shared-ui/index';
import BaseAccountLayout from './BaseAccountLayout';
import AuthProvider from '@/context/Auth/AuthProvider';
import UserProvider from '@/context/User/UserProvider';

const AccountLayout = (props: any) => (
  <UserProvider>
    <AuthedAmplitudeExperimentProvider>
      <ViewOfferProvider>
        <BaseAccountLayout {...props}>{props.children}</BaseAccountLayout>
      </ViewOfferProvider>
    </AuthedAmplitudeExperimentProvider>
  </UserProvider>
);

const AccountLayoutWithAuth = AccountLayout;

const generateAccountBaseLayout = (props: any) => {
  const PageComponent = (page: ReactElement) => {
    return (
      <AuthProvider>
        <AccountLayoutWithAuth {...props}>{page}</AccountLayoutWithAuth>
      </AuthProvider>
    );
  };

  return PageComponent;
};

export default generateAccountBaseLayout;
