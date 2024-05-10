import '@/styles/globals.css';
import '@/styles/carousel.css';
import type { AppProps } from 'next/app';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

import '@/nativeReceive';

import { museoFont, sourceSansPro } from '@/font';
import Spinner from '@/modules/Spinner';
import AmplitudeProvider from '@/components/AmplitudeProvider/AmplitudeProvider';
import { ViewOfferProvider } from '@bluelightcard/shared-ui';
import { experimentKeys, featureFlagKeys } from '@/components/AmplitudeProvider/amplitudeKeys';
import UserServiceProvider from '@/components/UserServiceProvider/UserServiceProvider';
import { PlatformAdapterProvider } from '@bluelightcard/shared-ui';
import { MobilePlatformAdapter } from '@/utils/platformAdapter';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

dayjs.extend(CustomParseFormat);

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PlatformAdapterProvider adapter={new MobilePlatformAdapter()}>
        <UserServiceProvider>
          <AmplitudeProvider experimentKeys={experimentKeys} featureFlagKeys={featureFlagKeys}>
            <main className={`${museoFont.variable} ${sourceSansPro.variable} mb-4`}>
              <ViewOfferProvider>
                <Component {...pageProps} />
              </ViewOfferProvider>
              <Spinner />
            </main>
          </AmplitudeProvider>
        </UserServiceProvider>
      </PlatformAdapterProvider>
    </QueryClientProvider>
  );
}
