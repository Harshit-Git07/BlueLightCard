import useSWR, { mutate } from 'swr';
import axios from 'axios';
import {
  IDENTITY_API_KEY,
  IDENTITY_ELIGIBILITY_FORM_OUTPUT_ENDPOINT,
  IDENTITY_ORGANISATION_ENDPOINT,
} from '@/global-vars';

const fetcher = async (key: string) => {
  const [url, body] = key.split(', ');
  return await axios.post(url, body).then((res) => res.data);
};

const fetcherWithHeaders = async (url: string, data: any, headers: any) => {
  return await axios.post(url, data, { headers }).then((res) => res.data);
};

const createBody = (employment: string) => {
  let retired = 0;
  let employed = 0;
  let volunteers = 0;
  let body;

  if (employment === 'retired') {
    retired = 1;
    body = { retired: retired };
  } else if (employment === 'employed') {
    employed = 1;
    body = { employed: employed };
  } else if (employment === 'volunteers') {
    volunteers = 1;
    body = { volunteers: volunteers };
  }
  return body;
};

export function useOrganisation(employment: string) {
  const body = createBody(employment);
  // Join the URL and the body into a single string with ', ' as the separator
  const key = employment ? `${IDENTITY_ORGANISATION_ENDPOINT}, ${JSON.stringify(body)}` : null;

  const { data, error } = useSWR(key, fetcher);
  return {
    data: data,
    isLoading: key && !error && !data, // isLoading is true only when a request is being made
    isIdle: !key, // isIdle is true when no request is being made due to lack of key (employment)
    isError: error,
  };
}

export async function fetchOrganisationData(employment: string) {
  const body = createBody(employment);
  // Make the request manually
  const key = `${IDENTITY_ORGANISATION_ENDPOINT}, ${JSON.stringify(body)}`;
  const data = await fetcher(key);
  // This will update the cache with the new data and trigger a revalidation
  mutate(key, data, false);
  return data;
}

export function useEmployer(organisationId: string) {
  const key = organisationId ? `${IDENTITY_ORGANISATION_ENDPOINT}/${organisationId}` : null;

  const { data, error } = useSWR(key, fetcher);

  return {
    data: data,
    isLoading: key && !error && !data, // isLoading is only true when a request is being made
    isIdle: !key, // Add isIdle state to indicate when no request is being made due to lack of key
    isError: error,
  };
}

export async function fetchEmployerData(organisationId: string, employment: string) {
  let retired = 0;
  let employed = 0;
  let volunteers = 0;
  let temp;

  if (employment === 'retired') {
    retired = 1;
    temp = { retired: retired };
  } else if (employment === 'employed') {
    employed = 1;
    temp = { employed: employed };
  } else if (employment === 'volunteers') {
    volunteers = 1;
    temp = { volunteers: volunteers };
  }
  const body = temp;
  // Make the request manually
  const key = `${IDENTITY_ORGANISATION_ENDPOINT}/${organisationId}, ${JSON.stringify(body)}`;
  const data = await fetcher(key);

  // This will update the cache with the new data and trigger a revalidation
  mutate(key, data, false);
  return data;
}

export async function addECFormOutputData(trackingData: object) {
  // Make the request manually
  return fetcherWithHeaders(IDENTITY_ELIGIBILITY_FORM_OUTPUT_ENDPOINT, trackingData, {
    ['x-api-key']: IDENTITY_API_KEY,
  });
}
