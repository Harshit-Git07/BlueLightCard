import { Unsubscribe } from '@/dependencies/nanoevents';
import eventBus from '@/eventBus';
import { Channels } from '@/globals';
import InvokeNativeAPICall from '@/invoke/apiCall';
import {
  IPlatformAdapter,
  PlatformVariant,
  V5RequestOptions,
  V5Response,
} from '@bluelightcard/shared-ui';
import { z } from 'zod';

export class MobilePlatformAdapter implements IPlatformAdapter {
  private invokeNativeAPICall = new InvokeNativeAPICall();

  platform = PlatformVariant.Mobile;

  invokeV5Api(path: string, options: V5RequestOptions): Promise<V5Response> {
    const responsePromise = new Promise<V5Response>((resolve, reject) => {
      let unsubscribe: Unsubscribe | null = null;

      // Set a timeout for the API call
      const timeout = setTimeout(() => {
        unsubscribe?.();
        reject(new Error('API call timed out'));
      }, 30_000);

      // Listen for the API response
      unsubscribe = eventBus.on(Channels.API_RESPONSE, (pathWithQuery, data): void => {
        // Ignore events that are not for this path
        const [incomingPath, _] = pathWithQuery.split('?');
        if (path !== incomingPath) {
          return;
        }

        // Clear the timeout
        clearTimeout(timeout);

        // Parse the event data
        const parsedMessage = z
          .object({
            statusCode: z.number(),
            body: z.string(),
          })
          .safeParse(data);

        // If the message is not valid, reject the promise
        if (!parsedMessage.success) {
          reject(parsedMessage.error);
          return;
        }

        // Resolve the promise with the parsed message
        resolve({
          body: parsedMessage.data.body,
          statusCode: parsedMessage.data.statusCode,
        });
      });
    });

    // Send the API request to the native app
    this.invokeNativeAPICall.requestDataV5(path, options);

    return responsePromise;
  }
}
