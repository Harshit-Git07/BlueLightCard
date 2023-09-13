import useSWR, { mutate } from 'swr';
import axios from 'axios';

const IDENTITY_API_URL = process.env.NEXT_PUBLIC_IDENTITY_API_URL;
const ELIGIBILITY_FORM_DATA_API_URL = process.env.NEXT_PUBLIC_ELIGIBILITY_FORM_OUTPUT_API_URL;

const fetcher = async (key: string) => {
  const [url, body] = key.split(', ');
  return await axios.post(url, body).then((res) => res.data);
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
  const key = employment ? `${IDENTITY_API_URL}, ${JSON.stringify(body)}` : null;

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
  const key = `${IDENTITY_API_URL}, ${JSON.stringify(body)}`;
  const data = await fetcher(key);
  // This will update the cache with the new data and trigger a revalidation
  mutate(key, data, false);
  return data;
}

export function useEmployer(organisationId: string) {
  const key = organisationId ? `${IDENTITY_API_URL}/${organisationId}` : null;

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
  const key = `${IDENTITY_API_URL}/${organisationId}, ${JSON.stringify(body)}`;
  const data = await fetcher(key);

  // This will update the cache with the new data and trigger a revalidation
  mutate(key, data, false);
  return data;
}

export async function addECFormOutputData(trackingData: Object) {
  // Make the request manually
  const key = `${ELIGIBILITY_FORM_DATA_API_URL}, ${JSON.stringify(trackingData)}`;
  return await fetcher(key);
}
