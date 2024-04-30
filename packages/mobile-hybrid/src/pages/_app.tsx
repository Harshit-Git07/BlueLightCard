import '@/styles/globals.css';
import '@/styles/carousel.css';
import type { AppProps } from 'next/app';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { AppStoreProvider } from '@/store';

import '@/nativeReceive';

import { museoFont, sourceSansPro } from '@/font';
import { NewsStoreProvider } from '@/modules/news/store';
import Spinner from '@/modules/Spinner';
import AmplitudeProvider from '@/components/AmplitudeProvider/AmplitudeProvider';
import { ViewOfferProvider } from '@bluelightcard/shared-ui';
import { experimentKeys, featureFlagKeys } from '@/components/AmplitudeProvider/amplitudeKeys';
import UserServiceProvider from '@/components/UserServiceProvider/UserServiceProvider';
import { PlatformAdapterProvider } from '@bluelightcard/shared-ui';
import { MobilePlatformAdapter } from '@/utils/platformAdapter';

dayjs.extend(CustomParseFormat);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlatformAdapterProvider adapter={new MobilePlatformAdapter()}>
      <AppStoreProvider>
        <UserServiceProvider>
          <NewsStoreProvider>
            <AmplitudeProvider experimentKeys={experimentKeys} featureFlagKeys={featureFlagKeys}>
              <main className={`${museoFont.variable} ${sourceSansPro.variable} mb-4`}>
                <ViewOfferProvider>
                  <Component {...pageProps} />
                </ViewOfferProvider>
                <Spinner />
              </main>
            </AmplitudeProvider>
          </NewsStoreProvider>
        </UserServiceProvider>
      </AppStoreProvider>
    </PlatformAdapterProvider>
  );
}
