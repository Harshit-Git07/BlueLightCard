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

  export interface Parameters {
    path: string;
    method: string;
    parameters: Record<string, any>;
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
}

declare type NativeCallParameters =
  | NativeNavigation.Parameters
  | NativeAPICall.Parameters
  | NativeAnalytics.Parameters;

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
