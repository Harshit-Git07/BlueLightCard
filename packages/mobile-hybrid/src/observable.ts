/**
 * @description Simple class that implements the observable pattern, should be used to observe triggering of events
 */
export default class Observable {
  private observers: {
    [event: string]: any[];
  };

  private static instance: Observable | null;

  constructor() {
    this.observers = {};
  }

  /**
   * @description Instantiates a singleton
   * @returns {Observable}
   */
  static getInstance(): Observable {
    if (!this.instance) {
      this.instance = new Observable();
    }
    return this.instance;
  }

  /**
   * @description Subscribe to a paticular event
   * @param event 
   * @param callback 
   */
  subscribe(event: string, callback: (...args: any[]) => void): void {
    if (!this.observers[event]) {
      this.observers[event] = [];
    }
    this.observers[event].push(callback);
  }

  /**
   * @description Notify all subscribers against the event
   * @param event 
   * @param args 
   */
  notify(event: string, ...args: any[]): void {
    if (this.observers[event]) {
      this.observers[event].forEach((observer) => {
        observer(...args);
      });
    }
  }
}