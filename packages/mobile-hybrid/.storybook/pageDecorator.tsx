import { museoFont, sourceSansPro } from "@/font";
import { NewsStoreProvider } from "@/modules/news/store";
import { AppStoreProvider } from "@/store";
import { Decorator } from "@storybook/react";

import mockResolvers from './mockResolvers';

import '@/nativeReceive';
import Spinner from "@/modules/Spinner";
import UserServiceProvider from "@/components/UserServiceProvider/UserServiceProvider";

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
    <AppStoreProvider>
      <NewsStoreProvider>
        <UserServiceProvider>
          <main className={`${museoFont.variable} ${sourceSansPro.variable} font-museo dark:bg-neutral-black`}>
            <Story />
            <Spinner />
          </main>
        </UserServiceProvider>
      </NewsStoreProvider>
    </AppStoreProvider>
  );
};

export default pageDecorator;
