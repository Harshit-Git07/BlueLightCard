import type { AppProps } from 'next/app';
import { FC } from 'react';
import { appWithTranslation } from 'next-i18next';
import { FlagsmithProvider } from 'flagsmith/react';
import flagsmith from 'flagsmith/isomorphic';
import Header from '@/components/Header/Header';

import '../styles/globals.css';
import { FEATURE_FLAG_ENVIRONMENT_ID } from '@/global-vars';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <FlagsmithProvider
      options={{ environmentID: FEATURE_FLAG_ENVIRONMENT_ID }}
      flagsmith={flagsmith}
    >
      <Component {...pageProps} />
    </FlagsmithProvider>
  );
};

export default appWithTranslation(App as any);
