import { Logger } from '@/logger';
import Facade from './facade';

/**
 * @description Used to communicate api call operations to the native app
 */
export default class InvokeNativeAPICall extends Facade implements NativeAPICall.ApiCall {
  private logger: Logger;
  private TAG = 'DataRequest';

  constructor() {
    super('DataRequest');
    this.logger = Logger.getInstance();
  }

  /**
   * @description Makes api request call with the url, only supports GET method at the moment
   * @param url
   */
  public requestData(url: string, queryParams?: NativeAPICall.Parameters['parameters']): void {
    this.logger.debug(`requesting data from url ${url}`, this.TAG);
    this.callFunction('requestData', {
      path: url,
      method: 'GET',
      parameters: queryParams ?? {},
      queries: queryParams ?? {},
    });
  }
}
