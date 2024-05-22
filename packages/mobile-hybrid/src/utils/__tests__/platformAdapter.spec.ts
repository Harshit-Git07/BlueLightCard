import { MobilePlatformAdapter } from '../platformAdapter';
import { amplitudeStore } from '@/components/AmplitudeProvider/AmplitudeProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';

describe('MobilePlatformAdapter', () => {
  describe('getAmplitudeFeatureFlag', () => {
    test('it returns the experiment value from the amplitude store', () => {
      const platformAdapter = new MobilePlatformAdapter();

      const mockExperiments = {
        mockExperimentOne: 'control',
      };
      amplitudeStore.set(experimentsAndFeatureFlags, mockExperiments);

      const experimentOneResult = platformAdapter.getAmplitudeFeatureFlag('mockExperimentOne');
      expect(experimentOneResult).toEqual('control');
    });

    test('it returns undefined if the experiment does not exist in the amplitude store', () => {
      const platformAdapter = new MobilePlatformAdapter();

      const mockExperiments = {};
      amplitudeStore.set(experimentsAndFeatureFlags, mockExperiments);

      const experimentOneResult = platformAdapter.getAmplitudeFeatureFlag('mockExperimentTwo');
      expect(experimentOneResult).toEqual(undefined);
    });
  });

  describe('invokeV5Api', () => {
    test('it throws an error if the V5 API feature flag is not enabled', async () => {
      const platformAdapter = new MobilePlatformAdapter();
      platformAdapter.getAmplitudeFeatureFlag = jest.fn().mockReturnValue(undefined);

      const request = () =>
        platformAdapter.invokeV5Api('/eu/redemptions/member/redeem', { method: 'GET' });

      expect(request).toThrow('V5 API calls are not supported by current app version');
    });
  });
});
