import { PropsWithChildren } from 'react';

export type AmplitudeProviderProps = PropsWithChildren & {
  experimentKeys: string[];
  featureFlagKeys: string[];
};

export enum AmplitudeExperimentState {
  Control = 'control',
  Treatment = 'treatment',
}

export enum AmplitudeFeatureFlagState {
  On = 'on',
  Off = 'off',
}
