import type { AppProps } from 'next/app';
import { FC, PropsWithChildren } from 'react';
import { appWithTranslation } from 'next-i18next';
import { FlagsmithProvider } from 'flagsmith/react';
import flagsmith from 'flagsmith/isomorphic';

import featureToggleState from '../feature-toggles.json';
import '../styles/main.scss';

const UserWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};

const userToEmail: Record<string, string> = {
  user_1: 'user_1@bluelightcard.co.uk',
  user_2: 'user_2@bluelightcard.co.uk',
  user_3: 'user_3@bluelightcard.co.uk',
};

const App: FC<AppProps> = ({ Component, pageProps }) => {
  let userId: string = 'user_1';
  if (typeof window !== 'undefined' && sessionStorage.getItem('userId')) {
    userId = `user_${sessionStorage.getItem('userId') as string}`;
  }
  return (
    <FlagsmithProvider
      options={{
        environmentID: featureToggleState.environmentID,
        state: featureToggleState,
        traits: {
          email_address: userToEmail[userId],
        },
        identity: userId,
      }}
      flagsmith={flagsmith}
    >
      <UserWrapper>
        <Component {...pageProps} />
      </UserWrapper>
    </FlagsmithProvider>
  );
};

export default appWithTranslation(App);
