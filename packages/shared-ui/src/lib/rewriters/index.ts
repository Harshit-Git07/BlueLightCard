import { useRouter as _useRouter } from 'next/router';
import { Channels, PlatformVariant } from '../../types';
import eventBus from '../eventBus';
import { invokeNative } from '../invoke';
import { FETCH_TIMEOUT } from '../../vars';

const timeoutIdMap: Record<string, NodeJS.Timeout> = {};

function generateTimeoutKey(input: string) {
  // incremental ids
  let iId = Object.keys(timeoutIdMap).filter((key) => key.startsWith(input)).length;
  iId += 1;
  return `${input}:${iId}`;
}

function removeTimeoutId(timeoutId: NodeJS.Timeout, timeoutKey: string) {
  clearTimeout(timeoutId);
  delete timeoutIdMap[timeoutKey];
}

/**
 * Handles posting of data request over event bridge on native app and waits to recieve api response from native
 * @param input
 * @returns
 */
function mobileFetch(input: Parameters<typeof window.fetch>[0]): Promise<Response> {
  invokeNative('DataRequest', {
    message: 'requestData',
    parameters: {
      path: input,
      method: 'GET',
    },
  });
  const bus = eventBus();
  return new Promise((resolve, reject) => {
    const timeoutKey = generateTimeoutKey(input.toString());
    const timeoutId = timeoutIdMap[timeoutKey];

    const _timeoutId = setTimeout(() => {
      removeTimeoutId(timeoutId, timeoutKey);
      reject(`Fetch error[${PlatformVariant.MobileHybrid}]: Fetch timed out waiting on response`);
    }, FETCH_TIMEOUT);

    timeoutIdMap[timeoutKey] = _timeoutId;

    bus.on(Channels.API_RESPONSE, () => {
      const latest = bus.getLatestMessage(Channels.API_RESPONSE);
      const message = latest!.message;

      if (message?.url.includes(input)) {
        removeTimeoutId(timeoutId, timeoutKey);
        resolve(
          new Response(JSON.stringify(message.response), {
            status: 200,
          }),
        );
      }
    });
  });
}

/**
 * Rewrite browser fetch function to either use the default fetch api or mobile hybrid event bridge
 * @param platform
 * @returns
 */
function fetchRewriter(platform: PlatformVariant) {
  return (...args: Parameters<typeof window.fetch>) => {
    if (platform === PlatformVariant.MobileHybrid && args[1]?.method?.toLowerCase() === 'post') {
      console.error('Fetch options error[%s]: Method "POST" is not supported', platform);
    }
    return platform === PlatformVariant.Web ? window.fetch(...args) : mobileFetch(args[0]);
  };
}

/**
 * Rewrite useRouter hook to include a native push function for mobile
 * @param platform
 * @returns
 */
function useRouterRewriter(platform: PlatformVariant) {
  const router = _useRouter() as ReturnType<typeof _useRouter> & {
    pushNative: (route: string, domain: string) => void;
  };
  router.pushNative = (route, domain) => {
    if (platform === PlatformVariant.Web) {
      return;
    }
    invokeNative('NavigationRequest', {
      message: 'navigate',
      parameters: {
        internalUrl: route,
        domain,
      },
    });
  };
  return router;
}

/**
 * -------------------------------------------------------
 * Library functions below
 * -------------------------------------------------------
 */
// fetch takes in an extra argument - platform
export async function fetch(
  input: Parameters<typeof window.fetch>[0],
  options?: Parameters<typeof window.fetch>[1],
  platform: PlatformVariant = PlatformVariant.Web,
) {
  return fetchRewriter(platform)(input, options);
}

// takes in an extra argument - platform
export function useRouter(platform: PlatformVariant = PlatformVariant.Web) {
  return useRouterRewriter(platform);
}
