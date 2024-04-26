import eventBus from '@/eventBus';
import { Channels } from '@/globals';
import { Logger } from '@/logger';

/**
 * @description Used to receive experiments from the native app
 */
export default class NativeReceiveExperiment implements NativeReceive.WebViewExperiment {
  private logger: Logger;
  private static TAG = 'NativeReceiveExperiment';

  constructor() {
    this.logger = Logger.getInstance();
  }
  /**
   * @description Called with the experiment variants
   * @param experiments
   */
  setExperiment(experiments: string): void {
    this.logger.debug(
      'Successfully received experiments',
      NativeReceiveExperiment.TAG,
      experiments,
    );
    const experimentData = JSON.parse(experiments);
    eventBus.emit(Channels.EXPERIMENTS, experimentData);
  }
}
