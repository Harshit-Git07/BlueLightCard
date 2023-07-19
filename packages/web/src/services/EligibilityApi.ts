import useSWR, { mutate } from 'swr';
import axios from 'axios';

const API_URL =
  'https://ue8dcieh75.execute-api.eu-west-2.amazonaws.com/production/blc_uk/organisation';

const fetcher = async (key: string) => {
  const [url, body] = key.split(', ');
  return await axios.post(url, body).then((res) => res.data);
};

export function useOrganisation(employment: string) {
  let retired = 0;

  if (employment === 'retired') {
    retired = 1;
  }

  const body = { retired: retired };

  // Join the URL and the body into a single string with ', ' as the separator
  const key = employment ? `${API_URL}, ${JSON.stringify(body)}` : null;

  const { data, error } = useSWR(key, fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export async function fetchOrganisationData(employment: string) {
  let retired = 0;

  if (employment === 'retired') {
    retired = 1;
  }

  const body = { retired: retired };

  // Make the request manually
  const key = `${API_URL}, ${JSON.stringify(body)}`;
  const data = await fetcher(key);

  // This will update the cache with the new data and trigger a revalidation
  mutate(key, data, false);

  return data;
}

export function useEmployer(organisationId: string) {
  const key = organisationId ? `${API_URL}/${organisationId}` : null;

  const { data, error } = useSWR(key, fetcher);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export async function fetchEmployerData(organisationId: string) {
  // Make the request manually
  const key = `${API_URL}/${organisationId}`;
  const data = await fetcher(key);

  // This will update the cache with the new data and trigger a revalidation
  mutate(key, data, false);

  return data;
}
