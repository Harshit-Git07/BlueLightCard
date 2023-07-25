import { Logger } from "@/logger";
import Facade from "./facade";

/**
 * @description Used to communicate analytics operations to the native app
 */
export default class InvokeNativeAnalytics extends Facade implements NativeAnalytics.Analytics {
  private logger: Logger;
  private TAG = 'InvokeNativeAnalytics';

  constructor() {
    super('NativeAnalytics');
    this.logger = Logger.getInstance();
  }

  /**
   * @description Logs analytics events
   * @param event 
   * @param meta 
   */
  public logAnalyticsEvent(event: string, meta?: NativeAnalytics.Parameters): void {
    this.logger.debug(`logging event '${event}' with data ${meta}`, this.TAG);
    this.callFunction('logAnalyticsEvent', {
      event,
      parameters: meta ?? {},
    });
  }
}