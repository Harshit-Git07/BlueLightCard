import type { AppProps } from 'next/app'
import { FC } from "react";
import { appWithTranslation } from "next-i18next";
import "../styles/main.scss";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

export default appWithTranslation(App);
