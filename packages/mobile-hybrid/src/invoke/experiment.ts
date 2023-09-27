import { Logger } from '@/logger';
import Facade from './facade';

/**
 * @description Used to communicate experiment requests from native app
 */
export default class InvokeNativeExperiment extends Facade implements NativeExperiment.Experiment {
  private logger: Logger;
  private TAG = 'InvokeNativeExperiment';

  constructor() {
    super('ExperimentRequest');
    this.logger = Logger.getInstance();
  }

  /**
   * @description Logs Experiments
   * @param event
   * @param meta
   */
  public experiment(keys: string[]): void {
    this.logger.debug(`requesting experiment variants for flag keys: ${keys.join()}`, this.TAG);
    this.callFunction('experiment', {
      keys,
    });
  }
}
