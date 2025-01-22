import { refreshIdTokenIfRequired } from '@/utils/refreshIdTokenIfRequired';

export async function fetchWithAuth<FetchResponseType>(
  url: string,
  options: RequestInit = {}
): Promise<FetchResponseType> {
  const idToken = await refreshIdTokenIfRequired();

  const headers: HeadersInit = {
    ...options?.headers,
    Authorization: `Bearer ${idToken}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  //This allows 204 No Content responses to be returned as they don't have a body
  if (response.status === 204 || !response.headers.get('Content-Type')) {
    return response as unknown as FetchResponseType;
  }

  return (await response.json()) as FetchResponseType;
}
