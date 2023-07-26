import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AppStoreProvider } from '@/store';
import '@/nativeReceive';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppStoreProvider>
      <Component {...pageProps} />
    </AppStoreProvider>
  )
}
