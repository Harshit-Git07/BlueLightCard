import { museoFont, sourceSansPro } from "@/font";
import { NewsStoreProvider } from "@/modules/news/store";
import { AppStoreProvider } from "@/store";
import { Decorator } from "@storybook/react";

import mockResolvers from './mockResolvers';

eventBus();

import '@/nativeReceive';
import eventBus from '@/eventBus';
import Spinner from "@/modules/Spinner";

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
        <main className={`${museoFont.variable} ${sourceSansPro.variable} font-museo dark:bg-neutral-black`}>
          <Story />
          <Spinner />
        </main>
      </NewsStoreProvider>
    </AppStoreProvider>
  );
};

export default pageDecorator;