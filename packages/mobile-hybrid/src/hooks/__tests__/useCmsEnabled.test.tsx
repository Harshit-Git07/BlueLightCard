import { renderHook } from '@testing-library/react';
import { useSetAtom } from 'jotai';
import {
  AmplitudeFeatureFlagState,
  type AmplitudeStore,
  experimentsAndFeatureFlags,
  FeatureFlags,
} from '@/components/AmplitudeProvider';
import { useCmsEnabled } from '../useCmsEnabled';

const givenAmplitudeStoreSet = (state: AmplitudeStore) => {
  return renderHook(() => {
    const setAmpStore = useSetAtom(experimentsAndFeatureFlags);
    setAmpStore(state);
  });
};

describe('useCmsEnabled', () => {
  it.each([
    {
      state: {
        [FeatureFlags.CMS_OFFERS]: AmplitudeFeatureFlagState.On,
      },
      expected: true,
    },
    {
      state: {
        [FeatureFlags.CMS_OFFERS]: AmplitudeFeatureFlagState.Off,
      },
      expected: false,
    },
    { state: {} as AmplitudeStore, expected: false },
  ])(
    'should return $expected when cms-offers when feature flag state is $state',
    ({ state, expected }: { state: AmplitudeStore; expected: boolean }) => {
      givenAmplitudeStoreSet(state);

      const { result } = renderHook(() => useCmsEnabled());

      expect(result.current).toBe(expected);
    },
  );
});
