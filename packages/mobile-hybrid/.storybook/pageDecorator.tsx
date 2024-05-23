import { museoFont, sourceSansPro } from '@/font';
import { Decorator } from '@storybook/react';

import mockResolvers from './mockResolvers';

import '@/nativeReceive';
import Spinner from '@/modules/Spinner';
import UserProfileProvider from '@/components/UserProfileProvider/UserProfileProvider';

const pageDecorator: Decorator = (Story) => {
  const globalState = window as GlobalState;
  globalState.webkit = {
    messageHandlers: Object.keys(mockResolvers).reduce((acc, _interface) => {
      acc[_interface] = {
        postMessage(json) {
          mockResolvers[_interface](globalState, json);
        },
      };
      return acc;
    }, {} as typeof globalState.webkit.messageHandlers)
  };
  return (
    <UserProfileProvider>
      <main className={`${museoFont.variable} ${sourceSansPro.variable} font-museo dark:bg-neutral-black`}>
        <Story />
        <Spinner />
      </main>
    </UserProfileProvider>
  );
};
export default pageDecorator;
