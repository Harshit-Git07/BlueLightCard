import { Channels, eventBus } from '@/globals';
import { useEffect } from 'react';

export const useOnResume = (callback: (event: string) => void) => {
  useEffect(() => {
    const listenerId = eventBus.on(Channels.APP_LIFECYCLE, () => {
      const latest = eventBus.getLatestMessage(Channels.APP_LIFECYCLE);

      if (latest!.message === 'onResume') {
        console.info('App webview resuming');
        callback(latest!.message);
      }
    });

    return () => {
      eventBus.off(Channels.APP_LIFECYCLE, listenerId);
    };
  }, [callback]);
};
