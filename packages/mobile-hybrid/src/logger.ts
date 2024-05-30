/**
 * @description Global logger that wraps the browser console api but with nicer message formatting
 */
export class Logger {
  private static instance: Logger;

  // Public settings for the logger
  public static debugMode: boolean = false;

  /**
   * @description Creates a singleton
   * @returns
   */
  public static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger();
    }
    return this.instance;
  }

  /**
   * @description Used for debugging in development, should be turned off for production
   * @param message
   * @param label
   */
  public debug(message: string, label: string, extra?: any): void {
    if (Logger.debugMode) {
      this._log(`(Debug) ${message}`, 'info', label, extra);
    } else {
      this.warn('Debugging needs to be turned on for you to see debug logs', label);
    }
  }

  /**
   * @description Log information messages
   * @param message
   */
  public info(message: string, label: string): void {
    this._log(message, 'info', label);
  }

  /**
   * @description Log warning messages
   * @param message
   */
  public warn(message: string, label: string): void {
    this._log(message, 'warn', label);
  }

  /**
   * @description Log error messages
   * @param message
   * @param stackTrace
   */
  public error(message: string, label: string, stackTrace?: any): void {
    this._log(message, 'error', label, stackTrace);
  }

  private _log(message: string, level: 'info' | 'warn' | 'error', label: string, args?: any): void {
    if (console[level]) {
      const date = new Date();
      if (args) {
        console[level](`[${label}][${date}]: ${message}`, args);
      } else {
        console[level](`[${label}][${date}]: ${message}`);
      }
    }
  }
}
