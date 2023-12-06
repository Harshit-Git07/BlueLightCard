import eventBusInit from './eventBus';

export const eventBus = eventBusInit();

export enum Channels {
  API_RESPONSE = 'nativeAPIResponse',
  EXPERIMENTS = 'nativeExperiments',
  APP_LIFECYCLE = 'nativeAppLifecycle',
}
