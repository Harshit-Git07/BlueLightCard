import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { useAmplitude } from '@/hooks/useAmplitude';
import { AmplitudeExperimentState } from '@/components/AmplitudeProvider/types';

export function GetSearchVariant(): string {
  const { is } = useAmplitude();

  if (is(Experiments.SEARCH_UI_CONTRAST, 'border-variant')) {
    return 'border-variant';
  } else if (is(Experiments.TRENDING_SEARCHES, 'treatment')) {
    return 'trending-searches';
  } else if (is(Experiments.SEARCH_UI_CONTRAST, 'background-variant-dark')) {
    return 'background-variant-dark';
  } else if (is(Experiments.SEARCH_UI_CONTRAST, 'background-variant-light')) {
    return 'background-variant-light';
  } else return AmplitudeExperimentState.Control;
}
