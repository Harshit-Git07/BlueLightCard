import { atom } from 'jotai';

export type AmplitudeStore = Record<string, string>;

// store experiments & feature flags together as they are requested & returned as a single list
export const experimentsAndFeatureFlags = atom<AmplitudeStore>({});
