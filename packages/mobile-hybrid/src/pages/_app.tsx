import '@/styles/globals.css';
import '@/styles/carousel.css';
import type { AppProps } from 'next/app';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { AppStoreProvider } from '@/store';

// initialise event bus instance
eventBus();

import '@/nativeReceive';

import { museoFont, sourceSansPro } from '@/font';
import { NewsStoreProvider } from '@/modules/news/store';
import eventBus from '@/eventBus';
import Loader from '@/modules/loader';

dayjs.extend(CustomParseFormat);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppStoreProvider>
      <NewsStoreProvider>
        <main className={`${museoFont.variable} ${sourceSansPro.variable} mb-4`}>
          <Component {...pageProps} />
          <Loader />
        </main>
      </NewsStoreProvider>
    </AppStoreProvider>
  );
}
