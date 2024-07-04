import { Logger } from '@/logger';
import Facade from './facade';

/**
 * @description Used to communicate lifecycle events to the native app
 */
export default class InvokeNativeLifecycle extends Facade implements NativeLifecycle.Lifecycle {
  private logger: Logger;
  private TAG = 'InvokeNativeLifecycle';
  constructor() {
    super('LifeCycleEventRequest'); // TODO check naming if necessary
    this.logger = Logger.getInstance();
  }

  /**
   * @description Logs lifecycle events
   * @param event
   * @param meta
   */
  public lifecycleEvent(event: string): void {
    const properties = {
      message: 'lifecycleEvent',
      parameters: {
        event,
      },
    };

    this.logger.debug(
      `logging event lifecycleEvent with data ${JSON.stringify(properties)}`,
      this.TAG,
    );
    this.callFunction('lifecycleEvent', properties); // TODO check naming if necessary
  }
}
