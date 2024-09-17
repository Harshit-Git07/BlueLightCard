import * as amplitude from '@amplitude/analytics-browser';
import { ServerZoneType } from '@amplitude/analytics-types/lib/esm/server-zone';
import { BRAND } from '@/global-vars';

const { LogLevel } = amplitude.Types;

export const AMPLITUDE_SERVER_ZONE: ServerZoneType = 'EU';
export const AMPLITUDE_LOG_LEVEL = LogLevel.Warn;

export class Amplitude {
  public isInitialised: boolean = false;

  async initialise(apiKey: string) {
    if (this.isInitialised) {
      console.log('already initialised');
      return;
    }

    if (!apiKey) {
      throw new Error('No API key set');
    }

    const sessionId = sessionStorage.getItem('amplitude_session_id');

    const initResult = amplitude.init(apiKey, {
      serverZone: AMPLITUDE_SERVER_ZONE,
      logLevel: AMPLITUDE_LOG_LEVEL,
      transport: 'beacon',
    });
    if (sessionId) this.setSessionId(sessionId);

    this.isInitialised = true;

    return initResult;
  }

  setUserId(userId: string) {
    amplitude.setUserId(userId);
  }

  setSessionId(sessionId: string) {
    amplitude.setSessionId(Number(sessionId));
  }

  _isAmplitudeInitialised() {
    return this.isInitialised;
  }

  trackEventAsync(event: string, data: any) {
    if (!this.isInitialised) {
      throw new Error('Amplitude is not initialised');
    }

    const dataWithBrand = {
      ...data,
      brand: BRAND,
    };

    return amplitude.track(event, dataWithBrand).promise;
  }

  trackEvent(event: string, data: any) {
    if (!this.isInitialised) {
      throw new Error('Amplitude is not initialised');
    }

    const dataWithBrand = {
      ...data,
      brand: BRAND,
    };

    amplitude.track(event, dataWithBrand);
  }
}
