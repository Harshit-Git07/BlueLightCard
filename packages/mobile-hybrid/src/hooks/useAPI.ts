import { Channels, eventBus } from '@/globals';
import { useEffect, useState } from 'react';

const useAPI = <R>(apiUrl: string) => {
  const [response, setResponse] = useState<R>();

  useEffect(() => {
    const listenerId = eventBus.on(Channels.API_RESPONSE, () => {
      const latest = eventBus.getLatestMessage(Channels.API_RESPONSE);
      const { url, response: _response } = latest!.message;
      console.log('Response', _response);
      if (url === apiUrl) {
        setResponse(_response);
      }
    });

    return () => {
      eventBus.off(Channels.API_RESPONSE, listenerId);
    };
  }, [setResponse, apiUrl]);

  return { response };
};

export default useAPI;
