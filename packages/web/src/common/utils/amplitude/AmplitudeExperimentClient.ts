import { AMPLITUDE_DEPLOYMENT_KEY } from '@/root/global-vars';
import { ExperimentClient } from '@amplitude/experiment-js-client';

export default class AmplitudeExperimentClient {
  protected static _instance: ExperimentClient;

  // Exists only to defeat instantiation
  protected constructor() {}

  // Exists to be implemented
  static instantiateClient(): ExperimentClient | PromiseLike<ExperimentClient> {
    throw new Error('Method not implemented.');
  }

  public static async Instance() {
    if (!this._instance) {
      this._instance = await this.instantiateClient();
    }

    return this._instance;
  }
}
