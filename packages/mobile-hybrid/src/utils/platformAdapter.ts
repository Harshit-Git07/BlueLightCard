import { Unsubscribe } from '@/dependencies/nanoevents';
import eventBus from '@/eventBus';
import { Channels } from '@/globals';
import InvokeNativeAnalytics from '@/invoke/analytics';
import InvokeNativeAPICall from '@/invoke/apiCall';
import InvokeNativeClipboard from '@/invoke/clipboard';
import InvokeNativeNavigation from '@/invoke/navigation';
import {
  AmplitudeLogParams,
  Endpoints,
  EndpointsKeys,
  IPlatformAdapter,
  IPlatformWindowHandle,
  PlatformVariant,
  V5RequestOptions,
  V5Response,
  urlResolver,
} from '@bluelightcard/shared-ui';
import { z } from 'zod';
import { amplitudeStore } from '@/components/AmplitudeProvider/AmplitudeProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

const analytics = new InvokeNativeAnalytics();
const navigation = new InvokeNativeNavigation();
const clipboard = new InvokeNativeClipboard();

export class MobilePlatformAdapter implements IPlatformAdapter {
  // Do not end the endpoint with a slash
  endpoints: Endpoints = {
    REDEMPTION_DETAILS: '/eu/redemptions/member/redemptionDetails',
    REDEEM_OFFER: '/eu/redemptions/member/redeem',
    OFFER_DETAILS: '/eu/offers/offers',
  };

  private invokeNativeAPICall = new InvokeNativeAPICall();

  platform = PlatformVariant.MobileHybrid;

  getAmplitudeFeatureFlag(featureFlagName: string): string | undefined {
    const amplitudeExperiments = amplitudeStore.get(experimentsAndFeatureFlags);

    return amplitudeExperiments[featureFlagName];
  }

  invokeV5Api(endpointKey: EndpointsKeys, options: V5RequestOptions): Promise<V5Response> {
    const endpoint = urlResolver(endpointKey, this.endpoints, {
      pathParameter: options.pathParameter,
    });

    const v5ApiFeatureFlag = this.getAmplitudeFeatureFlag(FeatureFlags.V5_API_INTEGRATION);

    if (v5ApiFeatureFlag !== 'on') {
      throw new Error('V5 API calls are not supported by current app version');
    }

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
        if (endpoint !== incomingPath) {
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
          data: parsedMessage.data.body, // redemptionType
          status: parsedMessage.data.statusCode,
        });
      });
    });

    // Send the API request to the native app
    this.invokeNativeAPICall.requestDataV5(endpoint, options);

    return responsePromise;
  }

  logAnalyticsEvent(event: string, parameters: AmplitudeLogParams): void {
    analytics.logAnalyticsEvent({ event, parameters });
  }

  navigate(path: string): void {
    navigation.navigate(path);
  }

  navigateExternal(path: string): IPlatformWindowHandle {
    navigation.navigateExternal(path);
    return {
      isOpen: () => true,
    };
  }

  writeTextToClipboard(text: string): Promise<void> {
    return Promise.resolve(clipboard.writeText(text));
  }
}
