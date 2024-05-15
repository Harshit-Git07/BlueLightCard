import { Logger } from '@/logger';
import Facade from './facade';

/**
 * @description Used to communicate clipboard operations to the native app
 */
export default class InvokeNativeClipboard extends Facade {
  private logger: Logger;
  // NOTE: The DataRequest bridge is used for both API calls and clipboard operations.
  private TAG = 'DataRequest';

  constructor() {
    super('DataRequest');
    this.logger = Logger.getInstance();
  }

  public writeText(text: string): void {
    this.logger.debug(`writing text to clipboard ${text}`, this.TAG);
    this.callFunction('requestData', {
      path: 'clipboard',
      body: text,
      method: 'POST',
    });
  }
}
