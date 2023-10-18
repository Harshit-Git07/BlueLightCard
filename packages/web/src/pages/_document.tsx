import { Head, Html, Main, NextScript } from 'next/document';
import { FC } from 'react';
import NewRelicTag from '@/components/NewRelicTag/NewRelicTag';
import { DEFAULT_LANG } from '@/global-vars';
import Script from 'next/script';
const newRelicLicenseKey = process.env.NEXT_PUBLIC_NEWRELIC_LICENSE_KEY as string;
const newRelicApplicationId = process.env.NEXT_PUBLIC_NEWRELIC_APPLICATION_ID as string;

const AppDocument: FC = () => {
  return (
    <Html lang={DEFAULT_LANG}>
      <Head>
        <Script id="google-analytics-script" strategy="beforeInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WW7M2P5');
        `}
        </Script>
        {!!(newRelicLicenseKey && newRelicApplicationId) && (
          <NewRelicTag licenseKey={newRelicLicenseKey} applicationID={newRelicApplicationId} />
        )}

        {/* Prefetch dns for cdn */}
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_APP_CDN_URL} />

        {/* Preconnect to cdn */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_APP_CDN_URL} />
      </Head>
      <body className="dark:bg-surface-primary-dark">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WW7M2P5"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default AppDocument;
