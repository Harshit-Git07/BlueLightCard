declare namespace NativeNavigation {
  function navigate(url: string): void;
  function onRootBackClicked(): void;

  export abstract class Navigation {
    public static navigate(url: string): void;
    public static onRootBackClicked(): void;
  }

  export interface Parameters {
    internalUrl: string;
  }
}

declare namespace NativeAPICall {
  function requestData(url: string): void;

  export abstract class ApiCall {
    static requestData(url: string): void;
  }

  export type HttpMethod =
    | 'GET'
    | 'PUT'
    | 'POST'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'TRACE';

  export interface Parameters {
    version?: '5' | undefined;
    /**
     * Determines whether to allow the mobile app to cache the response. Setting
     * this to 'true' does not guarantee that the response will be cached.
     *
     * @default 'true'
     */
    cacheable?: 'true' | 'false' | undefined;
    path: string;
    method: HttpMethod;
    parameters?: Record<string, any>;
    queries?: Record<string, any>;
    fields?: Record<string, any>;
    body?: string | undefined;
  }
}

declare namespace NativeClipboard {
  export interface Parameters {
    path: string;
    method: 'POST';
    body: string;
  }
}

declare namespace NativeAnalytics {
  function logAnalyticsEvent(event: string, meta?: string): void;

  export abstract class Analytics {
    static logAnalyticsEvent(event: string, meta?: string): void;
  }

  export interface Parameters {
    event: string;
    parameters: Record<string, any>;
  }
}

declare namespace NativeExperiment {
  function experiment(keys: string[]): void;

  export abstract class Experiment {
    static experiment(keys: string[]): void;
  }

  export interface Parameters {
    keys: string[];
  }
}

declare namespace NativeReceive {
  export abstract class WebViewNavigation {
    onNavigationRequestSuccess(): void;
    onNavigationRequestFailure(): void;
    onBackPressed(): void;
  }

  export abstract class WebViewLifecycle {
    onLifecycle(lifecycleEvent: string): void;
  }

  export abstract class WebViewAPIResponse {
    onResponse(url: string, ...response: string[]): void;
  }

  export abstract class WebViewExperiment {
    setExperiment(experiments: string): void;
  }
}

declare type NativeCallParameters =
  | NativeNavigation.Parameters
  | NativeAPICall.Parameters
  | NativeClipboard.Parameters
  | NativeAnalytics.Parameters
  | NativeExperiment.Parameters;

interface MessageArgument {
  message: string;
  parameters: NativeCallParameters;
}

declare type GlobalState = Window &
  typeof globalThis & {
    webkit: {
      messageHandlers: {
        [nativeInterface: string]: {
          postMessage: (json: MessageArgument) => void;
        };
      };
    };
    setTheme: (mode: 'light' | 'dark') => void;
  };
