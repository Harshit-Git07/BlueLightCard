import type { AppProps } from 'next/app';
import { FC } from 'react';
import { appWithTranslation } from 'next-i18next';
import { FlagsmithProvider } from 'flagsmith/react';
import flagsmith from 'flagsmith/isomorphic';
import { BRAND, REGION } from 'global-vars';

import '../styles/main.scss';

const featureToggleState = require(`../../brands/${BRAND}/featureToggleConfigs/${REGION}.json`);

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <FlagsmithProvider
      options={{
        environmentID: featureToggleState.environmentID,
        state: featureToggleState,
      }}
      flagsmith={flagsmith}
    >
      <Component {...pageProps} />
    </FlagsmithProvider>
  );
};

export default appWithTranslation(App);
