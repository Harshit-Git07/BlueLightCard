import { PropsWithChildren } from 'react';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

export type AmplitudeProps = PropsWithChildren & {
  keyName: FeatureFlags | Experiments;
  value: string;
};
