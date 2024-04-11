/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Invokes the native postMessage on the interface injected by the native app
 * @param nativeInterface
 * @param payload
 */
export function invokeNative(nativeInterface: string, payload: any) {
  if (typeof (window as any).webkit !== 'undefined') {
    (window as any).webkit.messageHandlers[nativeInterface].postMessage(payload);
    console.info(`Invoke native api ${nativeInterface}`);
  }
}
