import '@/styles/globals.css';
import '@/styles/carousel.css';
import type { AppProps } from 'next/app';
import { useContext, FC } from 'react';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { AppContext, AppStoreProvider } from '@/store';
import '@/nativeReceive';
import { museoFont, sourceSansPro } from '@/font';
import { NewsStoreProvider } from '@/modules/news/store';
import Spinner from '@/components/Spinner/Spinner';

dayjs.extend(CustomParseFormat);

const Loader: FC = () => {
  const { loading } = useContext(AppContext);
  return (
    loading && (
      <div className="absolute top-0 flex items-center justify-center w-[100vw] h-[100vh] bg-neutral-grey-800/[.5]">
        <Spinner />
      </div>
    )
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppStoreProvider>
      <NewsStoreProvider>
        <main className={`${museoFont.variable} ${sourceSansPro.variable}`}>
          <Component {...pageProps} />
          <Loader />
        </main>
      </NewsStoreProvider>
    </AppStoreProvider>
  );
}
