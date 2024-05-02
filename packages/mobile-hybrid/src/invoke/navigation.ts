import { Logger } from '@/logger';
import Facade from './facade';

/**
 * @description Used to communicate navigation operations to the native app
 */
export default class InvokeNativeNavigation extends Facade implements NativeNavigation.Navigation {
  private logger: Logger;
  private TAG = 'InvokeNativeNavigation';

  constructor() {
    super('NavigationRequest');
    this.logger = Logger.getInstance();
  }

  /**
   * @description Navigates to the needed page
   * @param url
   */
  public navigate(url: string): void {
    this.logger.debug(`navigate to url ${url}`, this.TAG);
    this.callFunction('navigate', {
      internalUrl: url,
    });
  }

  /**
   * @description Navigates to an external page
   * @param url
   */
  public navigateExternal(url: string): void {
    this.logger.debug(`navigate to external url ${url}`, this.TAG);
    // The `url.php` route is used to open external URLs in the app. When we
    // navigate to this route with the `url` and `external` query parameters,
    // the app will open the URL in the device's default browser.
    this.callFunction('navigate', {
      internalUrl: `url.php?url=${encodeURIComponent(url)}&external=true`,
    });
  }

  /**
   * @description Communicates navigation back to root page
   */
  public onRootBackClicked(): void {
    this.logger.debug('root back clicked', this.TAG);
  }
}
