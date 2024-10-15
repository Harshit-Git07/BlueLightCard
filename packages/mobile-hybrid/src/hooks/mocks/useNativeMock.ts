import { useRouter } from 'next/router';
import { IS_SSR, USE_NATIVE_MOCK } from '@/globals';
import dataMocks from './data/dataMocks';
import experimentMocks from './experimentMocks';

/**
 * Hook to create mocked versions of the event bridge interfaces.
 * These message handlers are usually mounted to the webview by Native.
 * Instead, this hook allows the frontend to be mocked and ran
 * in a regular browser environment.
 */
function useNativeMock() {
  const router = useRouter();

  if (!USE_NATIVE_MOCK || IS_SSR) return false;

  const globalState = window as GlobalState;
  globalState['webkit'] = {
    messageHandlers: {
      AnalyticsRequest: {
        postMessage: () => {
          return;
        },
      },
      DataRequest: {
        postMessage: (json: MessageArgument) => {
          const parameters = json.parameters as NativeAPICall.Parameters;
          const { path } = parameters;
          const mockedResponse = dataMocks[path];

          if (!mockedResponse) throw new Error(`No mock found for url ${path}`);

          globalState.onResponse(
            path,
            Buffer.from(JSON.stringify(mockedResponse)).toString('base64'),
          );
        },
      },
      ExperimentRequest: {
        postMessage: () => {
          globalState.setExperiment(JSON.stringify(experimentMocks));
        },
      },
      NavigationRequest: {
        postMessage: (json: MessageArgument) => {
          const parameters = json.parameters as NativeNavigation.Parameters;

          if (parameters.internalUrl.includes('/offers.php?type=1&opensearch=1')) {
            router.push('/searchresults?search=nike');
            return;
          }

          router.push(parameters.internalUrl);
        },
      },
    },
  };

  return true;
}

export default useNativeMock;
