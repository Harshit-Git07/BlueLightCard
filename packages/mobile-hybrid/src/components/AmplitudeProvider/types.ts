import { PropsWithChildren } from 'react';

export type AmplitudeProviderProps = PropsWithChildren & {
  experimentKeys: string[];
  featureFlagKeys: string[];
};

export enum AmplitudeExperimentState {
  Control = 'control',
  Treatment = 'treatment',
  DarkRead = 'dark-read',
}

export enum AmplitudeFeatureFlagState {
  On = 'on',
  Off = 'off',
}
