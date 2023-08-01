import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <body className="dark:bg-neutral-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
