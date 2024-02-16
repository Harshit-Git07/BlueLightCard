import { PropsWithChildren } from 'react';

export type AmplitudeProviderProps = PropsWithChildren & {
  experimentKeys: string[];
  featureFlagKeys: string[];
};
