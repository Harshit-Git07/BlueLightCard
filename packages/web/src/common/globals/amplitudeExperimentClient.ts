import { AMPLITUDE_DEPLOYMENT_KEY } from '@/global-vars';
import { Experiment } from '@amplitude/experiment-js-client';

/**
 * Global singleton amplitude experiment client
 */
export const amplitudeExperimentClient = Experiment.initializeWithAmplitudeAnalytics(
  AMPLITUDE_DEPLOYMENT_KEY,
  {
    serverZone: 'eu',
  }
);
