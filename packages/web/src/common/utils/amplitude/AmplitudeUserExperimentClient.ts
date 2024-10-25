import { AMPLITUDE_DEPLOYMENT_KEY } from '@/root/global-vars';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import getLoggedInUserId from './getLoggedInUserId';
import AmplitudeExperimentClient from './AmplitudeExperimentClient';
import getDeviceFingerprint from '@/utils/amplitude/getDeviceFingerprint';

export default class AmplitudeUserExperimentClient extends AmplitudeExperimentClient {
  // Exists only to defeat instantiation
  private constructor() {
    super();
  }

  public static async instantiateClient() {
    const userId = getLoggedInUserId();

    this._instance = new ExperimentClient(AMPLITUDE_DEPLOYMENT_KEY, { serverZone: 'eu' });
    await this._instance.start({ user_id: userId, device_id: getDeviceFingerprint() });

    return this._instance;
  }
}
