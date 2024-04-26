import eventBus from '@/eventBus';
import { Channels } from '@/globals';
import { useEffect } from 'react';

export const useOnResume = (callback: (event: string) => void) => {
  useEffect(() => {
    return eventBus.on(Channels.APP_LIFECYCLE, (lifecycleEvent) => {
      if (lifecycleEvent === 'onResume') {
        console.info('App webview resuming');
        callback(lifecycleEvent);
      }
    });
  }, [callback]);
};
