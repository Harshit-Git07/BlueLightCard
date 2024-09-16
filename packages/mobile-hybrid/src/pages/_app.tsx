import '@/styles/globals.css';
import '@/styles/carousel.css';

import type { AppProps } from 'next/app';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

import '@/nativeReceive';

import { museoFont, sourceSansPro } from '@/font';
import Spinner from '@/modules/Spinner';
import AmplitudeProvider from '@/components/AmplitudeProvider/AmplitudeProvider';
import { SharedUIConfigProvider } from '@bluelightcard/shared-ui';
import { experimentKeys, featureFlagKeys } from '@/components/AmplitudeProvider/amplitudeKeys';
import { PlatformAdapterProvider } from '@bluelightcard/shared-ui';
import { MobilePlatformAdapter } from '@/utils/platformAdapter';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import UserProfileProvider from '@/components/UserProfileProvider/UserProfileProvider';

dayjs.extend(CustomParseFormat);

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SharedUIConfigProvider
        value={{
          globalConfig: {
            cdnUrl: 'https://cdn.bluelightcard.co.uk',
            brand: 'blc-uk',
          },
        }}
      >
        <PlatformAdapterProvider adapter={new MobilePlatformAdapter()}>
          <AmplitudeProvider experimentKeys={experimentKeys} featureFlagKeys={featureFlagKeys}>
            {/*
            AmplitudeProvider uses a custom Jotai store so all providers that use the default store should be
            added as children of the AmplitudeProvider.
          */}
            <UserProfileProvider>
              <main className={`${museoFont.variable} ${sourceSansPro.variable} mb-4`}>
                <Component {...pageProps} />
                <Spinner />
              </main>
            </UserProfileProvider>
          </AmplitudeProvider>
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>
    </QueryClientProvider>
  );
}
