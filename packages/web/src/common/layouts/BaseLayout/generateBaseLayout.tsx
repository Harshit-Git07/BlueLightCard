import BaseLayout from '@/layouts/BaseLayout/BaseLayout';
import { ReactElement } from 'react';
import AuthProviderBaseLayout from '../AuthProviderBaseLayout/AuthProviderBaseLayout';
import { LoggedOutAmplitudeExperimentProvider } from '../../context/AmplitudeExperiment';

function generateBaseLayout(props: any, requiresAuthProviders: boolean = false) {
  const PageComponent = (page: ReactElement) => {
    if (requiresAuthProviders) {
      return <AuthProviderBaseLayout {...props}>{page}</AuthProviderBaseLayout>;
    } else {
      return (
        <LoggedOutAmplitudeExperimentProvider>
          <BaseLayout {...props}>{page}</BaseLayout>
        </LoggedOutAmplitudeExperimentProvider>
      );
    }
  };

  return PageComponent;
}

export default generateBaseLayout;
