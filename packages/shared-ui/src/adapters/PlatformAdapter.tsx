import { createContext, useContext } from 'react';
import { AmplitudeLogParams, PlatformVariant } from '../types';

export type Amplitude = {
  isInitialised: boolean;
};

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE';

export type V5RequestOptions = {
  /**
   * Platforms should not cache responses if the cachePolicy is set to 'never'.
   * Setting the cachePolicy to 'auto' allows the platform to cache responses but
   * does not require it to do so. If this option is omitted, platforms should
   * default to 'never'.
   *
   * @default 'never'
   */
  cachePolicy?: 'never' | 'auto';
  method: HttpMethod;
  queryParameters?: Record<string, string>;
  body?: string;
};

export type V5Response = {
  status: number;
  data: string;
};

export type NavigationOptions = {
  /**
   * The target of the navigation. If set to `blank`, the URL will be opened in a new tab in web. On mobile platforms,
   * this option is ignored.
   *
   * @default 'self'
   */
  target: 'blank' | 'self';
};

export interface IPlatformWindowHandle {
  /**
   * Indicates if the window is open. Will return `false` if the window failed to open, or was closed. On mobile, this
   * method will always return `true`.
   */
  isOpen(): boolean;
}

export interface IPlatformAdapter {
  /**
   * Can be used by the shared-ui to introspect which platform it is running in
   */
  platform: PlatformVariant;
  /**
   * Retrieve the value of a single Amplitude feature flag/experiment
   * @param featureFlagName Name of the feature flag/experiment to retrieve
   */
  getAmplitudeFeatureFlag(featureFlagName: string): string | undefined;
  /**
   * Invokes a v5 API endpoint
   */
  invokeV5Api(path: string, options: V5RequestOptions): Promise<V5Response>;
  /**
   * Logs analytics events
   */
  logAnalyticsEvent(
    event: string,
    parameters: AmplitudeLogParams,
    amplitude?: Amplitude | null | undefined,
  ): void;
  /**
   * Navigate to a route within the app
   */
  navigate(path: string): void;
  /**
   * Navigate to an external URL
   */
  navigateExternal(url: string, options?: NavigationOptions): IPlatformWindowHandle;
  /**
   * Write text to the clipboard
   */
  writeTextToClipboard(text: string): Promise<void>;
}

const PlatfromAdapterContext = createContext<IPlatformAdapter | null>(null);

type Props = {
  children: React.ReactNode;
  adapter: IPlatformAdapter;
};

export function PlatformAdapterProvider({ adapter, children }: Props): React.ReactElement {
  return (
    <PlatfromAdapterContext.Provider value={adapter}>{children}</PlatfromAdapterContext.Provider>
  );
}

export function usePlatformAdapter() {
  const adapter = useContext(PlatfromAdapterContext);

  if (!adapter) {
    throw new Error(
      'Missing platform adapter implementation. Did you forget to wrap your app with <PlatformAdapterProvider>?',
    );
  }

  return adapter;
}
