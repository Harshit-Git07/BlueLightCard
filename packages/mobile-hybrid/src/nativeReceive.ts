/**
 * This module is used to register functions that will become available to the native app shell
 * that calls them, once the webview has loaded.
 */
import { Logger } from '@/logger';
import NativeReceiveAPIResponse from '@/receive/apiResponse';
import NativeReceiveLifecycle from '@/receive/lifecycle';
import NativeReceiveNavigation from '@/receive/navigation';

// Create instances of handlers use by the registered functions
const nativeReceiveNavigation = new NativeReceiveNavigation();
const nativeReceiveLifecycle = new NativeReceiveLifecycle();
const nativeReceiveAPIResponse = new NativeReceiveAPIResponse();

// Logger.debugMode = process.env.NODE_ENV !== 'production';
Logger.debugMode = true;

// Map of interfaced function name to handler
const fns: { [key: string]: any } = {
  onNavigationRequestSuccess:
    nativeReceiveNavigation.onNavigationRequestSuccess.bind(nativeReceiveNavigation),
  onNavigationRequestFailure:
    nativeReceiveNavigation.onNavigationRequestFailure.bind(nativeReceiveNavigation),
  onBackPressed: nativeReceiveNavigation.onBackPressed.bind(nativeReceiveNavigation),
  onLifecycle: nativeReceiveLifecycle.onLifecycle.bind(nativeReceiveLifecycle),
  onResponse: nativeReceiveAPIResponse.onResponse.bind(nativeReceiveAPIResponse),
};

/* Since Next.js does CSR + SSR, when running server side the window object is not available,
 * so we need to make sure we only register the functions when running client side
 */
if (typeof window !== 'undefined') {
  const globalState = window as Window & typeof globalThis;

  (Object.keys(fns) as any[]).forEach((fn) => {
    globalState[fn] = fns[fn];
  });
}
