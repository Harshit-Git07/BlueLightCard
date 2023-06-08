import { Head, Html, Main, NextScript } from 'next/document';
import { FC } from 'react';
import NewRelicTag from '@/components/NewRelicTag/NewRelicTag';
import { DEFAULT_LANG } from '@/global-vars';

const newRelicLicenseKey = process.env.NEXT_PUBLIC_NEWRELIC_LICENSE_KEY as string;
const newRelicApplicationId = process.env.NEXT_PUBLIC_NEWRELIC_APPLICATION_ID as string;

const AppDocument: FC = () => {
  return (
    <Html lang={DEFAULT_LANG}>
      <Head>
        {!!(newRelicLicenseKey && newRelicApplicationId) && (
          <NewRelicTag licenseKey={newRelicLicenseKey} applicationID={newRelicApplicationId} />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default AppDocument;
