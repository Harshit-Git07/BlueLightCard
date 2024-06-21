const throttleFetch = async (promise: ReturnType<typeof fetch>): Promise<Response> => {
  const response = await promise;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 1200);
  });
};

async function DataRequest(
  globalState: GlobalState & {
    onResponse: NativeReceive.WebViewAPIResponse['onResponse'];
  },
  { parameters }: MessageArgument,
) {
  const params = parameters as NativeAPICall.Parameters;
  const queryParamsString =
    params.parameters && Object.keys(params.parameters).length
      ? `?${Object.keys(params.parameters)
          .map((key) => `${key}=${params.parameters?.[key]}`)
          .join('&')}`
      : '';
  const encodedUrl = Buffer.from(`${params.path}${queryParamsString}`)
    .toString('base64')
    .replace(/\//g, '');
  const chunkSize = 10;

  const mockDataRequestUrl = `mocks/DataRequest/${params.method.toLowerCase()}/${encodedUrl}.json`;

  try {
    console.info('Resolve(DataRequest) Requesting mock data for url %s', params.path);
    const response = await throttleFetch(fetch(mockDataRequestUrl));
    const data = await response.text();

    const byteLength = data.length / 10;

    const chunks = [...Array(chunkSize)].map((chunk, index) => {
      const startIndex = index * byteLength;
      const endIndex = startIndex + byteLength;
      return Buffer.from(data.substring(startIndex, endIndex)).toString('base64');
    });

    globalState.onResponse(params.path, ...chunks);
  } catch (error) {
    console.error('Resolver(DataRequest) Error', error);
  }
}

function NavigationRequest(globalState: GlobalState, payload: MessageArgument) {}

function AnalyticsRequest(globalState: GlobalState, payload: MessageArgument) {}

function ExperimentRequest(globalState: GlobalState, payload: MessageArgument) {}

const resolvers: Record<string, (globalState: any, payload: MessageArgument) => void> = {
  DataRequest,
  NavigationRequest,
  AnalyticsRequest,
  ExperimentRequest,
};

export default resolvers;
