import { createNanoEvents } from '@/dependencies/nanoevents';
import { Channels } from '@/globals';

interface Events {
  [Channels.API_RESPONSE]: (path: string, data: unknown) => void;
  [Channels.APP_LIFECYCLE]: (lifecycleEvent: string) => void;
  [Channels.EXPERIMENTS]: (experiments: Record<string, string>) => void;
}

export default createNanoEvents<Events>();
