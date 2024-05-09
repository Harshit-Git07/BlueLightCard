import { Logger } from '@/logger';
import Facade from './facade';
import { BRAND } from '@/globals';

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
    // Add the brand to the parameters
    const parametersWithBrand = {
      ...properties.parameters,
      brand: BRAND,
    };

    this.logger.debug(
      `logging event '${properties.event}' with data ${JSON.stringify(parametersWithBrand)}`,
      this.TAG,
    );
    this.callFunction('logAnalyticsEvent', { ...properties, parameters: parametersWithBrand });
  }
}
