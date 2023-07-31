/**
 * @description Facade layer to abstract away from comms with native app
 */
export default abstract class Facade {
  constructor(private nativeInterface: string) {}

  /**
   * @description Call the function on the native interface
   * @param functionName
   * @param parameters
   */
  protected callFunction(functionName: string, parameters: NativeCallParameters): void {
    const globalState = window as GlobalState;
    if (typeof globalState?.webkit !== 'undefined') {
      globalState.webkit.messageHandlers[this.nativeInterface].postMessage({
        message: functionName,
        parameters,
      });
    }
  }
}
