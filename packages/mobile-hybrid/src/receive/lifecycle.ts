import { Channels, eventBus } from '@/globals';
import { Logger } from '@/logger';

/**
 * @description Used to receive lifecycle events from the native app
 */
export default class NativeReceiveLifecycle implements NativeReceive.WebViewLifecycle {
  private logger: Logger;
  private static TAG = 'NativeReceiveLifecycle';

  constructor() {
    this.logger = Logger.getInstance();
  }

  /**
   * @description Called with the lifecycle event i.e resumed, paused etc
   * @param lifecycleEvent
   */
  public onLifecycle(lifecycleEvent: string): void {
    this.logger.debug(`app lifecycle received '${lifecycleEvent}'`, NativeReceiveLifecycle.TAG);
    eventBus.broadcast(Channels.APP_LIFECYCLE, lifecycleEvent);
  }
}
