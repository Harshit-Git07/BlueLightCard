import { Logger } from '@/logger';
import Facade from './facade';

/**
 * @description Used to communicate analytics operations to the native app
 */
export default class InvokeNativeAnalytics extends Facade implements NativeAnalytics.Analytics {
  private logger: Logger;
  private TAG = 'InvokeNativeAnalytics';

  constructor() {
    super('AnalyticsRequest');
    this.logger = Logger.getInstance();
  }

  /**
   * @description Logs analytics events
   * @param event
   * @param meta
   */
  public logAnalyticsEvent(properties: NativeAnalytics.Parameters): void {
    this.logger.debug(
      `logging event '${properties.event}' with data ${JSON.stringify(properties.parameters)}`,
      this.TAG,
    );
    this.callFunction('logAnalyticsEvent', properties);
  }
}
