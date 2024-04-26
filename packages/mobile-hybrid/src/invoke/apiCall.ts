import { Logger } from '@/logger';
import Facade from './facade';

export type RequestOptions = {
  /**
   * Determines whether to allow the mobile app to cache the response.
   *
   * @default 'never'
   */
  cachePolicy?: 'never' | 'auto';
  method: NativeAPICall.Parameters['method'];
  queryParameters?: Record<string, string>;
  body?: string;
};

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
    this.logger.debug(
      `requesting data from url ${url}, query params ${JSON.stringify(queryParams ?? {})}`,
      this.TAG,
    );
    this.callFunction('requestData', {
      path: url,
      method: 'GET',
      parameters: queryParams ?? {},
      queries: queryParams ?? {},
    });
  }

  public requestDataV5(path: string, options: RequestOptions): void {
    this.logger.debug(`requesting v5 data from url ${path}`, this.TAG);
    this.callFunction('requestData', {
      version: '5',
      cacheable: options.cachePolicy === 'auto' ? 'true' : 'false',
      path,
      method: options.method,
      queries: options.queryParameters ?? {},
      body: options.body,
    });
  }
}
