import { useAmplitudeExperiment } from '../context/AmplitudeExperiment';

export function useCmsEnabled() {
  const cmsFlagResult = useAmplitudeExperiment('cms-offers', 'off');

  return cmsFlagResult.data?.variantName === 'on';
}
