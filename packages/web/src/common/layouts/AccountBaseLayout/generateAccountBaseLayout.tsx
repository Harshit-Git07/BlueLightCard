import React, { ReactElement } from 'react';
import { AuthedAmplitudeExperimentProvider } from '../../context/AmplitudeExperiment';
import { ViewOfferProvider } from '@bluelightcard/shared-ui/index';
import BaseAccountLayout from './BaseAccountLayout';

const generateAccountBaseLayout = (props: any) => {
  const PageComponent = (page: ReactElement) => {
    return (
      <AuthedAmplitudeExperimentProvider>
        <ViewOfferProvider>
          <BaseAccountLayout {...props}>{page}</BaseAccountLayout>
        </ViewOfferProvider>
      </AuthedAmplitudeExperimentProvider>
    );
  };

  return PageComponent;
};

export default generateAccountBaseLayout;
