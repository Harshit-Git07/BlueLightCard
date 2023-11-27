import * as amplitude from '@amplitude/analytics-browser';
const { ServerZone, LogLevel } = amplitude.Types;

export class Amplitude {
  public isInitialised: boolean = false;

  initialise(apiKey: string) {
    if (this.isInitialised) {
      console.log('already initialised');
      return;
    }

    if (!apiKey) {
      throw new Error('No API key set');
    }

    amplitude.init(apiKey, {
      serverZone: ServerZone.EU,
      logLevel: LogLevel.Warn,
    });

    this.isInitialised = true;
  }

  setUserId(userId: string) {
    amplitude.setUserId(userId);
  }

  _isAmplitudeInitialised() {
    return this.isInitialised;
  }

  trackEventAsync(event: string, data: any) {
    if (!this.isInitialised) {
      throw new Error('Amplitude is not initialised');
    }

    return amplitude.track(event, data).promise;
  }

  trackEvent(event: string, data: any) {
    if (!this.isInitialised) {
      throw new Error('Amplitude is not initialised');
    }

    amplitude.track(event, data);
  }
}
