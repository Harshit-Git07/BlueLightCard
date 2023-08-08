import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="color-scheme" content="dark light" />
      </Head>
      <body className="dark:bg-neutral-black" id="app-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
