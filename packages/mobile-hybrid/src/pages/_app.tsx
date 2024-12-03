import '@/styles/globals.css';
import '@/styles/carousel.css';

import type { AppProps } from 'next/app';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

import '@/nativeReceive';

import { museoFont, sourceSansPro } from '@/font';
import Spinner from '@/modules/Spinner';
import AmplitudeProvider from '@/components/AmplitudeProvider/AmplitudeProvider';
import { BRAND, CDN_URL, USE_DEV_TOOLS } from '@/globals';
import {
  SharedUIConfigProvider,
  ViewOfferProvider,
  PlatformAdapterProvider,
} from '@bluelightcard/shared-ui';
import { experimentKeys, featureFlagKeys } from '@/components/AmplitudeProvider/amplitudeKeys';
import { MobilePlatformAdapter } from '@/utils/platformAdapter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfileProvider from '@/components/UserProfileProvider/UserProfileProvider';
import DeeplinkOverrideRouter from '@/components/DeeplinkOverrideRouter/DeeplinkOverrideRouter';
import DevToolsDrawer from '@/components/DevToolsDrawer';
import useNativeMock from '@/hooks/mocks/useNativeMock';

dayjs.extend(CustomParseFormat);

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  useNativeMock();

  return (
    <QueryClientProvider client={queryClient}>
      <SharedUIConfigProvider
        value={{
          globalConfig: {
            cdnUrl: CDN_URL,
            brand: BRAND,
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
                {USE_DEV_TOOLS ? <DevToolsDrawer /> : null}

                <ViewOfferProvider>
                  <DeeplinkOverrideRouter>
                    <Component {...pageProps} />
                  </DeeplinkOverrideRouter>
                </ViewOfferProvider>
                <Spinner />
              </main>
            </UserProfileProvider>
          </AmplitudeProvider>
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>
    </QueryClientProvider>
  );
}
