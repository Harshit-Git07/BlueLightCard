import "styles/main.scss";
import type { AppProps } from 'next/app'
import { FC } from "react";
import { appWithTranslation } from "next-i18next";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default appWithTranslation(App);
