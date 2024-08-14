import eventBus from '@/eventBus';
import Facade from './facade';
import { Channels } from '@/globals';
import { Logger } from '@/logger';
import { Unsubscribe } from '@/dependencies/nanoevents';

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

  public async requestDataAsync<T>(
    url: string,
    queryParams?: NativeAPICall.Parameters['parameters'],
  ): Promise<T> {
    const responsePromise = new Promise<T>((resolve, reject) => {
      let unsubscribe: Unsubscribe | null = null;

      const timeout = setTimeout(() => {
        unsubscribe?.();
        reject(new Error('API call timed out'));
      }, 30_000);

      unsubscribe = eventBus.on(Channels.API_RESPONSE, (pathWithQuery, data): void => {
        const [incomingPath, _] = pathWithQuery.split('?');
        if (url !== incomingPath) {
          return;
        }

        clearTimeout(timeout);

        resolve(data as T);
      });
    });

    this.requestData(url, queryParams);

    return responsePromise;
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
