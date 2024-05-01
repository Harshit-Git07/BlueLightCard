import eventBus from '@/eventBus';
import { Channels } from '@/globals';
import { useEffect, useState } from 'react';

export interface APIResponse<TData> {
  data: TData;
}

const useAPI = (apiUrl: string) => {
  const [response, setResponse] = useState<unknown>();

  useEffect(
    () =>
      eventBus.on(Channels.API_RESPONSE, (path, data) => {
        if (path.includes(apiUrl)) {
          setResponse(data);
        }
      }),
    [setResponse, apiUrl],
  );

  return response;
};

export default useAPI;
