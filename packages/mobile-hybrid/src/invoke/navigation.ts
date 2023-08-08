import { Logger } from '@/logger';
import Facade from './facade';

/**
 * @description Used to communicate navigation operations to the native app
 */
export default class InvokeNativeNavigation extends Facade implements NativeNavigation.Navigation {
  private logger: Logger;
  private TAG = 'InvokeNativeNavigation';

  constructor() {
    super('NativeNavigation');
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
   * @description Communicates navigation back to root page
   */
  public onRootBackClicked(): void {
    this.logger.debug('root back clicked', this.TAG);
  }
}
