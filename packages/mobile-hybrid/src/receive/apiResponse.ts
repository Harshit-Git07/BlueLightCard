import eventBus from '@/eventBus';
import { Channels } from '@/globals';
import { Logger } from '@/logger';
import { decodeBase64 } from '@/utils/base64';

/**
 * @description Used to receive api responses from the native app
 */
export default class NativeReceiveAPIResponse implements NativeReceive.WebViewAPIResponse {
  private logger: Logger;
  private static TAG = 'NativeReceiveAPIResponse';

  constructor() {
    this.logger = Logger.getInstance();
  }

  /**
   * @description Called on receiving api response
   * @description Due to limitations on the native app side, the stringified JSON sent has to be chunked and reconstructed back to full JSON on the web side
   * @param url
   * @param response
   */
  public onResponse(url: string, ...response: string[]): void {
    this.logger.debug(`api response from url '${url}'`, NativeReceiveAPIResponse.TAG);

    let invalidBase64Chunks = 0;

    const joinedChunks = response.reduce((acc, chunk) => {
      try {
        const decoded = decodeBase64(chunk);
        acc += decoded;
      } catch {
        invalidBase64Chunks += 1;
      }
      return acc;
    }, '');

    if (invalidBase64Chunks > 0) {
      this.logger.error(
        `${invalidBase64Chunks} chunks could not be decoded`,
        NativeReceiveAPIResponse.TAG,
      );
    }

    let parsedJSON;
    try {
      parsedJSON = JSON.parse(joinedChunks);
      eventBus.emit(Channels.API_RESPONSE, url, parsedJSON);
      this.logger.debug('Successfully parsed JSON', NativeReceiveAPIResponse.TAG, parsedJSON);
    } catch (error) {
      this.logger.error('Failed to parse JSON in response', NativeReceiveAPIResponse.TAG, error);
    }
  }
}
