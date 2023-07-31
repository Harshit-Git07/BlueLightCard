import { Logger } from '@/logger';

/**
 * @description Used to receive navigation events from the native app
 */
export default class NativeReceiveNavigation implements NativeReceive.WebViewNavigation {
  private logger: Logger;
  private static TAG = 'NativeReceiveNavigation';

  constructor() {
    this.logger = Logger.getInstance();
  }

  /**
   * @description Called on navigation success
   */
  public onNavigationRequestSuccess(): void {
    this.logger.debug('navigation request success', NativeReceiveNavigation.TAG);
  }

  /**
   * @description Called on navigation failure
   */
  public onNavigationRequestFailure(): void {
    this.logger.debug('navigation request failure', NativeReceiveNavigation.TAG);
  }

  /**
   * @description Called on back navigation pressed
   */
  public onBackPressed(): void {
    this.logger.debug('back navigation pressed', NativeReceiveNavigation.TAG);
  }
}
