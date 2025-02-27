interface EventsMap {
  [event: string]: any;
}

export interface Unsubscribe {
  (): void;
}

export interface Emitter<Events extends EventsMap> {
  /**
   * Calls each of the listeners registered for a given event.
   *
   * ```js
   * ee.emit('tick', tickType, tickDuration)
   * ```
   *
   * @param event The event name.
   * @param args The arguments for listeners.
   */
  emit<K extends keyof Events>(this: this, event: K, ...args: Parameters<Events[K]>): void;

  /**
   * Event names in keys and arrays with listeners in values.
   *
   * ```js
   * emitter1.events = emitter2.events
   * emitter2.events = { }
   * ```
   */
  events: Partial<{ [E in keyof Events]: Events[E][] }>;

  /**
   * Add a listener for a given event.
   *
   * ```js
   * const unbind = ee.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   * ```
   *
   * @param event The event name.
   * @param cb The listener function.
   * @returns Unbind listener from event.
   */
  on<K extends keyof Events>(this: this, event: K, cb: Events[K]): Unsubscribe;
}

/**
 * Create event emitter.
 *
 * ```js
 * import { createNanoEvents } from 'nanoevents'
 *
 * class Ticker {
 *   constructor() {
 *     this.emitter = createNanoEvents()
 *   }
 *   on(...args) {
 *     return this.emitter.on(...args)
 *   }
 *   tick() {
 *     this.emitter.emit('tick')
 *   }
 * }
 * ```
 */
export function createNanoEvents<Events extends EventsMap>(): Emitter<Events> {
  return {
    emit(event, ...args) {
      for (
        let i = 0, callbacks = this.events[event] || [], length = callbacks.length;
        i < length;
        i++
      ) {
        callbacks[i](...args);
      }
    },
    events: {},
    on(event, cb) {
      (this.events[event] ||= []).push(cb);
      return () => {
        this.events[event] = this.events[event]?.filter((i) => cb !== i);
      };
    },
  };
}
