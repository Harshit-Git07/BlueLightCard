import type { AppProps } from 'next/app';
import { FC, ReactElement } from 'react';
import { appWithTranslation } from 'next-i18next';
import { FlagsmithProvider } from 'flagsmith/react';
import flagsmith from 'flagsmith/isomorphic';

import '../styles/globals.css';
import { FEATURE_FLAG_ENVIRONMENT_ID } from '@/global-vars';
import AuthProvider from '@/context/AuthProvider';

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
import { NextPageWithLayout } from '@/page-types/layout';
config.autoAddCss = false;

const App: FC<AppProps> = ({ Component, pageProps }) => {
  // Use the layout defined at the page level, if available
  const getLayout = (Component as NextPageWithLayout).getLayout || ((page: ReactElement) => page);

  const renderedPageWithLayout = getLayout(<Component {...pageProps} />);

  return (
    <FlagsmithProvider
      options={{ environmentID: FEATURE_FLAG_ENVIRONMENT_ID }}
      flagsmith={flagsmith}
    >
      <AuthProvider>{renderedPageWithLayout}</AuthProvider>
    </FlagsmithProvider>
  );
};

export default appWithTranslation(App as any);
