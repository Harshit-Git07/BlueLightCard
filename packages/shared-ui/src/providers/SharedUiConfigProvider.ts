import { createContext, useContext } from 'react';

export type SharedUIConfig = {
  globalConfig: {
    cdnUrl: string;
    brand: string;
  };
};

const SharedUIConfigContext = createContext<SharedUIConfig | undefined>(undefined);

export const SharedUIConfigProvider = SharedUIConfigContext.Provider;

export function useSharedUIConfig() {
  const config = useContext(SharedUIConfigContext);
  if (!config) {
    throw new Error(
      'Missing shared UI config. Did you forget to wrap your app with <SharedUIConfigProvider>?',
    );
  }
  return config;
}
