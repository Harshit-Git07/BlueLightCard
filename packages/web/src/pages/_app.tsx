import '@/styles/globals.css';
import '@/styles/swiper.css';

import type { AppProps } from 'next/app';
import { FC, ReactElement, useContext, lazy } from 'react';
import { appWithTranslation } from 'next-i18next';
import { datadogRum } from '@datadog/browser-rum';
import flagsmith from 'flagsmith';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {
  DATADOG_APP_ID,
  DATADOG_CLIENT_TOKEN,
  DATADOG_ENV,
  DATADOG_DEFAULT_SERVICE,
  DATADOG_SITE,
  FLAGSMITH_KEY,
  BRAND,
  CDN_URL,
} from '@/global-vars';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
import { NextPageWithLayout } from '@/page-types/layout';
import Head from 'next/head';
import AmplitudeProvider from '@/utils/amplitude/provider';
import { FlagsmithProvider } from 'flagsmith/react';
import { PlatformAdapterProvider, SharedUIConfigProvider } from '@bluelightcard/shared-ui';
import AmplitudeContext from '../common/context/AmplitudeContext';
import { WebPlatformAdapter } from '../common/utils/WebPlatformAdapter';

config.autoAddCss = false;

if (DATADOG_APP_ID && DATADOG_CLIENT_TOKEN) {
  datadogRum.init({
    applicationId: DATADOG_APP_ID,
    clientToken: DATADOG_CLIENT_TOKEN,
    site: DATADOG_SITE,
    service: DATADOG_DEFAULT_SERVICE,
    env: DATADOG_ENV,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
} else {
  console.warn('Datadog auth keys are missing.');
}

const ReactQueryDevtoolsPreview = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);
const queryClient = new QueryClient();

const App: FC<AppProps> = ({ Component, pageProps }) => {
  useContext(AmplitudeContext);
  // Use the layout defined at the page level, if available
  const getLayout = (Component as NextPageWithLayout).getLayout || ((page: ReactElement) => page);

  const renderedPageWithLayout = getLayout(<Component {...pageProps} />) || null;

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        {/* TODO: Remove this meta tag when dark mode is enabled */}
        <meta name="color-scheme" content="light only" />

        {/* Cache control - Cache for 1 day, could be more? 30days? 1yr? */}
        <meta httpEquiv="cache-control" content="max-age=86400" />

        {/* Hard coded SEO data */}
        {typeof document !== 'undefined' && document.location.hostname.includes('staging') && (
          <meta name="robots" content="noindex" />
        )}

        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta property="og:site_name" content="Blue Light Card" />
        <meta name="twitter:creator" content="@bluelightcard" />
        <meta name="twitter:site" content="@bluelightcard" />

        {/* Google search console Meta */}
        <meta
          name="google-site-verification"
          content="DTJzAOYbFZcd8ox4dqRtKjYqQyvHEeLssZvRcWi9TbE"
        />
        <meta name="facebook-domain-verification" content="8jv2lrney5b68pwbcllhikuza0khd6" />

        {/* Mobile specific Metas */}
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
        />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <FlagsmithProvider
        options={{
          environmentID: FLAGSMITH_KEY,
          cacheFlags: true,
        }}
        flagsmith={flagsmith}
      >
        <SharedUIConfigProvider
          value={{
            globalConfig: {
              cdnUrl: CDN_URL,
              brand: BRAND,
            },
          }}
        >
          <PlatformAdapterProvider adapter={new WebPlatformAdapter()}>
            <AmplitudeProvider>{renderedPageWithLayout}</AmplitudeProvider>
          </PlatformAdapterProvider>
        </SharedUIConfigProvider>
      </FlagsmithProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      {['staging', 'preview'].includes(process.env.NEXT_PUBLIC_ENV ?? '') && (
        <ReactQueryDevtoolsPreview />
      )}
    </QueryClientProvider>
  );
};

export default appWithTranslation(App as any);
