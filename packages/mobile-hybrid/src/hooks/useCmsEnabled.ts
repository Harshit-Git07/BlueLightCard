import { AmplitudeFeatureFlagState, FeatureFlags } from '@/components/AmplitudeProvider';
import { useAmplitude } from './useAmplitude';

export function useCmsEnabled() {
  const { is } = useAmplitude();

  return is(FeatureFlags.CMS_OFFERS, AmplitudeFeatureFlagState.On);
}
