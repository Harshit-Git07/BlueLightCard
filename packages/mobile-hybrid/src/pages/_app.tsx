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
  const apisLoading = Object.values(loading).find((v) => !!v);
  return (
    <>
      {apisLoading && (
        <div className="fixed top-0 flex z-20 items-center justify-center w-full h-full bg-white dark:bg-neutral-800">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppStoreProvider>
      <NewsStoreProvider>
        <main className={`${museoFont.variable} ${sourceSansPro.variable} mb-4`}>
          <Component {...pageProps} />
          {/* <Loader /> */}
        </main>
      </NewsStoreProvider>
    </AppStoreProvider>
  );
}
