import { AMPLITUDE_DEPLOYMENT_KEY } from '@/root/global-vars';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import getDeviceFingerprint from './getDeviceFingerprint';
import AmplitudeExperimentClient from './AmplitudeExperimentClient';

export default class AmplitudeDeviceExperimentClient extends AmplitudeExperimentClient {
  // Exists only to defeat instantiation
  private constructor() {
    super();
  }

  public static async instantiateClient() {
    const deviceId = getDeviceFingerprint();

    this._instance = new ExperimentClient(AMPLITUDE_DEPLOYMENT_KEY, { serverZone: 'eu' });
    await this._instance.start({ device_id: deviceId });

    return this._instance;
  }
}
