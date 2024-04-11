import { Channels } from "../src/types";
import eventBus from "../src/lib/eventBus";

const throttleFetch = async (promise: ReturnType<typeof fetch>): Promise<Response> => {
  const response = await promise;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 1200);
  });
};

async function DataRequest(
  globalState: any,
  { parameters }: any
) {
  const params = parameters;
  const queryParamsString = (params.parameters && Object.keys(params.parameters).length) ? `?${Object.keys(params.parameters).map((key) => `${key}=${params.parameters?.[key]}`).join('&')}` : '';
  const encodedUrl = btoa(`${params.path}${queryParamsString}`).replace(/\//g, '');

  const mockDataRequestUrl = `/mocks/DataRequest/${params.method.toLowerCase()}/${encodedUrl}.json`;

  try {
    console.info('Resolve(DataRequest) Requesting mock data for url %s', params.path);
    const response = await throttleFetch(fetch(mockDataRequestUrl));
    const data = await response.json();

    eventBus().broadcast(Channels.API_RESPONSE, {
      url: atob(encodedUrl),
      response: data,
    })
  } catch (error) {
    console.error('Resolver(DataRequest) Error', error);
  }
}

function NavigationRequest(globalState: any, payload: any) {
  console.info(`Native navigate`, payload);
}

function AnalyticsRequest(globalState: any, payload: any) {}

function ExperimentRequest(globalState: any, payload: any) {}

const resolvers: Record<string, (globalState: any, payload: any) => void> = {
  DataRequest,
  NavigationRequest,
  AnalyticsRequest,
  ExperimentRequest
};

export default resolvers;